import { Injectable } from '@angular/core';

import { Observable, throwError } from "rxjs"

import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpErrorResponse } from "@angular/common/http"

import { SessionService, SessionStatus } from "./session.service"
import { tap, map, catchError } from 'rxjs/operators';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)
            .pipe(
                tap(
                    () => { },
                    (err) => console.log(err)
                ),
                catchError(
                    (err) => throwError({
                        message: err.error.message ? err.error.message : err.error.error.message,
                        details: err
                    })
                )
            )

    }

}
