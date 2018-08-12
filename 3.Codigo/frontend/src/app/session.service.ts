
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { BehaviorSubject, Subscription, timer } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from '../environments/environment';
import { Institution } from "./institutions.service";


const storage = environment.storage
const api = environment.api;

export enum SessionStatus {
    NO_SESSION,
    LOGGED_IN,
    LOGGED_OUT,
    EXPIRING,
    EXPIRED
}

export class Session {

    constructor(
        public token: string,
        public iat: number,
        public exp: number,
        public offset: number,
        public user) { }

    get expirationDate() {

        return new Date(this.exp * 1000);

    }

    get startDate() {

        return new Date(this.iat * 1000);

    }

    get expirationAlert() {

        return new Date((this.exp * 1000) - (this.offset * 60 * 1000));

    }

    status(date: Date = new Date()) {

        return (date >= this.expirationDate) ?
            SessionStatus.EXPIRED : ((date >= this.expirationAlert) ?
                SessionStatus.EXPIRING : SessionStatus.LOGGED_IN)

    }

}

interface Role {

    id?: number
    name: string
    description: string

}


export interface User {

    id?
    avatarUrl
    firstname
    lastname
    username
    isInternal
    roles?: Role[]
    institution?: Institution


}


@Injectable()
export class SessionService {

    private session: Session;

    private timerSubscription: Subscription;

    private sessionEvents: BehaviorSubject<any> = new BehaviorSubject(this.checkSession());

    constructor(private http: HttpClient) { }

    public login({ username, password }) {

        return this.http.post(environment.api.login, { username, password })
            .pipe(tap((loginInfo) => this.setSession(loginInfo)))

    }

    private setSession(loginInfo) {

        let decoded = jwt_decode(loginInfo.token);

        this.session = new Session(
            loginInfo.token,
            decoded.iat,
            decoded.exp,
            environment.sessionAlertOffsetInMin,
            loginInfo.user
        )

        storage.setItem("session", JSON.stringify(this.session))

        this.sessionEvents.next(this.onSessionStarted());

    }

    private onSessionExpired() {

        storage.clear();

        return {
            status: SessionStatus.EXPIRED
        }

    }

    private onSessionExpiring() {

        this.timerSubscription = timer(this.session.expirationDate)
            .subscribe(() => {
                this.sessionEvents.next(this.onSessionExpired());
            });

        return {
            status: SessionStatus.EXPIRING,
            token: this.session.token,
            user: this.session.user,
            date: this.session.expirationDate
        }

    }

    private onSessionStarted() {

        if (this.timerSubscription)
            this.timerSubscription.unsubscribe();

        this.timerSubscription = timer(this.session.expirationAlert).subscribe(() => {
            this.sessionEvents.next(this.onSessionExpiring());
        });

        return {
            status: SessionStatus.LOGGED_IN,
            token: this.session.token,
            user: this.session.user,
            date: this.session.expirationDate
        }

    }

    private checkSession() {

        let s = JSON.parse(storage.getItem("session"));

        if (!s) {
            return {
                status: SessionStatus.NO_SESSION
            }
        }

        this.session = new Session(
            s.token,
            s.iat,
            s.exp,
            s.offset,
            s.user
        )


        let status = this.session.status();

        if (status === SessionStatus.EXPIRED)
            return this.onSessionExpired()

        if (status === SessionStatus.EXPIRING)
            return this.onSessionExpiring()

        return this.onSessionStarted();

    }


    public logout() {

        if (this.timerSubscription)
            this.timerSubscription.unsubscribe();

        storage.clear();

        this.sessionEvents.next({
            status: SessionStatus.LOGGED_OUT,
            date: new Date()
        })

    }


    get events() {

        return this.sessionEvents.asObservable();

    }

}
