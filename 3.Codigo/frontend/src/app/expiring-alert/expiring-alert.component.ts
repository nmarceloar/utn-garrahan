import { Component, OnInit, OnDestroy } from '@angular/core';

import { from as fromPromise, timer, interval, Subscription } from "rxjs"

import { filter, map } from "rxjs/operators"

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ModalLoginComponent } from "./../modal-login/modal-login.component"

import { SessionService, SessionStatus } from "./../session.service"

import * as moment from "moment"


@Component({
    selector: 'app-expiring-alert',
    templateUrl: './expiring-alert.component.html',
    styleUrls: ['./expiring-alert.component.css']
})
export class ExpiringAlertComponent implements OnInit, OnDestroy {

    timerSubscription: Subscription;

    diff = undefined; 

    constructor(
        private sessionService: SessionService,
        private modalService: NgbModal) { }

    ngOnInit() {

        this.sessionService.events
            .pipe(filter(d => d.status === SessionStatus.EXPIRING))
            .subscribe((s) => this.startTimer(s))

        this.sessionService.events
            .pipe(filter(d => d.status !== SessionStatus.EXPIRING))
            .subscribe(() => this.stopTimer())


    }

    get isShowing() {
        return !!this.diff
    }

    ngOnDestroy(): void {

        this.stopTimer();

    }

    stopTimer(): void {

        if (this.isShowing) {

            this.timerSubscription.unsubscribe();
            this.diff = undefined; 

        }


    }


    private startTimer(sessionEvent): void {

        this.timerSubscription = interval(1000)
            .pipe(map(() => {
                let seconds = Math.floor((sessionEvent.date.getTime() - Date.now()) / 1000);
                return {
                    minutes: Math.trunc(seconds/60),
                    seconds: seconds % 60
                }
            }))
            .subscribe(d => this.diff = d);

    }

    public renovar() {

        fromPromise(this.modalService.open(ModalLoginComponent).result)
            .subscribe(
                (r) => console.log(r),
                (err) => console.error(err)
            )

    }


}

class DiffTimer {

    constructor(private start: Date, private end: Date) { }

    get diffInMinutes() {

        return moment(this.end.getTime()).diff(moment(this.end), 'minutes')

    }

    get diffInSeconds() {

        return moment(this.end.getTime()).diff(moment(this.end), 'seconds')

    }




}
