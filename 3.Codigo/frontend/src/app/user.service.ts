import { HttpClient } from "@angular/common/http";

import { Injectable } from '@angular/core';

import { throwError } from "rxjs";

import { catchError } from "rxjs/operators";

import { environment } from '../environments/environment';

const api = environment.api;

@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }

    findAll() {

        return this.http.get(api.users)
            .pipe(catchError(err => throwError(err.error.error)))

    }

    create(user: any) {

        return this.http.post(environment.api.users, user);

    }

}



