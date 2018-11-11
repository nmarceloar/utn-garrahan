import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router, NavigationCancel, NavigationError } from "@angular/router"

import { SessionService, SessionStatus } from './../session.service'

import { MessageService } from "./../message.service"

import { filter, tap } from "rxjs/operators"
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppMessagesService } from '../app-messages.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {

    currentUser: any = null;

    isPrinting: boolean = false;

    constructor(
        private router: Router,
        private appMessages: AppMessagesService,
        private messageService: MessageService,
        private sessionService: SessionService) { }

    ngOnInit() {


        this.sessionService.events.subscribe((sessionEvent) => {

            if (sessionEvent.status === SessionStatus.LOGGED_OUT || sessionEvent.status === SessionStatus.EXPIRED) {
                this.currentUser = null;
                this.router.navigateByUrl("login");
                return;
            }

            this.currentUser = sessionEvent.user


        })

        this.appMessages.isPrinting.subscribe(is => this.isPrinting = is);

    }

    ngOnDestroy() { }

    get showsProfile() {

        return !!this.currentUser

    }

    get canAdmin() {

        return this.showsProfile && this.currentUser.roles.map(d => d.name).includes("admin");

    }

    get isClient() {

        return this.showsProfile && !this.currentUser.isInternal

    }

    logout() {

        this.sessionService.logout();

    }

}
