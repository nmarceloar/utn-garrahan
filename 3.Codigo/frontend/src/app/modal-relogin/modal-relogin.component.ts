import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SessionService, SessionStatus } from "./../session.service";


@Component({
    selector: 'app-modal-re login',
    templateUrl: './modal-relogin.component.html',
    styleUrls: ['./modal-relogin.component.css']
})
export class ModalReloginComponent implements OnInit {

    isLoading: boolean = false;
    errorMsg: string;

    loginForm: FormGroup = new FormGroup({
        username: new FormControl(""),
        password: new FormControl("")
    })

    constructor(
        private sessionService: SessionService,
        private activeModal: NgbActiveModal) {

        this.sessionService.events
            .subscribe(e => this.handleSessionEvent(e))

    }

    handleSessionEvent(se) {

        if ((se.status === SessionStatus.LOGGED_IN) || (se.status === SessionStatus.EXPIRING)) {

            this.loginForm.setValue({
                username: se.user.username,
                password: ""
            })

            return;

        }

        if (se.status === SessionStatus.EXPIRED) {
            this.activeModal.dismiss(); // session expired
            return;
        }


    }


    ngOnInit() { }


    accept() {

        this.isLoading = true;
        this.errorMsg = "";

        this.sessionService.check(this.loginForm.value)
            .subscribe(
                () => {
                    this.isLoading = false;
                    this.activeModal.close() // cred ok
                },
                (err) => {
                    this.isLoading = false;
                    this.errorMsg = err.message;
                }
            )

    }

    get hasError() {
        return this.errorMsg;
    }


}
