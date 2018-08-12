import { Injectable } from '@angular/core';

import { Observable } from "rxjs"

import {HttpInterceptor, HttpHandler, HttpEvent, HttpRequest} from "@angular/common/http"

import { SessionService, SessionStatus } from "./session.service"


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

	private token: string; 

	constructor(private sessionService: SessionService) {

		this.sessionService.events.subscribe(s => {
				this.token = s.token;
		})

	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if(this.token)
			return next.handle(req.clone({
				headers: req.headers.set(`Authorization`, `Bearer ${this.token}`)
			}));
		else 
			return next.handle(req);

	}
	
}
