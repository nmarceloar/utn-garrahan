import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';

import { Router, ActivatedRouteSnapshot, NavigationEnd } from "@angular/router"

import { SessionService, SessionStatus } from "./session.service"

import { Subscription } from "rxjs"
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    private s: Subscription;

    constructor(
        private router: Router,
        private sessionService: SessionService) {

        this.s = this.sessionService.events
            .subscribe(sessionEvent => this.handleSessionEvent(sessionEvent))

    }


    handleSessionEvent(sessionEvent) {

        switch (sessionEvent.status) {

            case SessionStatus.EXPIRED: {

                break;
            }

            default:
                break;

        }

    }


    ngOnInit() { }

    ngOnDestroy() {

        this.s.unsubscribe();
    }




}
