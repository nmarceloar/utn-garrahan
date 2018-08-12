import { Component, OnDestroy, OnInit } from '@angular/core';

import { NavigationEnd, Router } from "@angular/router";

import { timer } from "rxjs";

import { filter } from "rxjs/operators";

import { MessageService } from "./../message.service";


@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class MessageStackComponent implements OnInit, OnDestroy {

    private messages: any[] = [];

    constructor(
        private router: Router,
        private messagesService: MessageService) { }


    ngOnInit() {

        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e) => {

                this.messages
                    .filter(a => !a.persist)
                    .forEach(a => this.closeAlert(a))

            })

        this.messagesService.messages
            .subscribe(message => {

                this.push(message);

            })

    }

    private push(message) {
        this.messages.unshift(message);
    }

    ngOnDestroy() { }

    closeAlert(alert) {

        this.messages.splice(this.messages.indexOf(alert), 1)

    }




}
