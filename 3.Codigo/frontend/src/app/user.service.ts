import { HttpClient } from "@angular/common/http";

import { Injectable } from '@angular/core';

import { throwError } from "rxjs";

import { catchError } from "rxjs/operators";

import { environment } from '../environments/environment';

const api = environment.api;

@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }

    find(q = {}) {

        return this.http.get(`${environment.api.users}?filter=${JSON.stringify(q)}`)
            .pipe(catchError(err => throwError(err.error.error)))

    }

    makeAdmin(userId, { isAdmin }) {

        return this.http.put(`${environment.api.users}/operators/${userId}/admin`, { isAdmin })

    }

    findById(userId, q = {}) {

        return this.http.get(`${environment.api.users}/${userId}?filter=${JSON.stringify(q)}`)

    }

    createClient(user: any) {

        return this.http.post(`${environment.api.users}/clients`, user);

    }

    createOperator(user: any) {

        return this.http.post(`${environment.api.users}/operators`, user);

    }

    update(id: any, user: any) {

        return this.http.put(`${environment.api.users}/${id}`, user);

    }


    activate(data: any) {

        return this.http.post(`${environment.api.accountConfirm}`, data);

    }

    enable(userId) {

        return this.http.put(`${environment.api.users}/${userId}/enable`, {});

    }

    disable(userId) {

        return this.http.put(`${environment.api.users}/${userId}/disable`, {});

    }

    requestPasswordReset(email: string) {

        return this.http.post(`${environment.api.passwordResetRequests}`, { email });

    }

    resetPassword(resetInfo) {

        return this.http.post(`${environment.api.passwordReset}`, resetInfo);

    }

    clients() {

        return this.http.get(`${environment.api.users}/clients`);

    }

    operators() {

        return this.http.get(`${environment.api.users}/operators`);

    }



}



