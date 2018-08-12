import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { MessageService, MessageType } from "./../message.service";
import { NavigationService } from "./../navigation.service";
import { SessionService } from "./../session.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    loginForm: FormGroup = LoginForm.newInstance();

    isLoading: boolean = false;
    canSubmit: boolean = false;

    submitted: boolean = false;

    constructor(
        private http: HttpClient,
        private sessionService: SessionService,
        private messagesService: MessageService,
        private navigationService: NavigationService,
        private router: Router) { }


    ngOnInit() {}

    ngOnDestroy() {}

    login() {

        if (this.loginForm.invalid) {
            this.submitted = true;
            return;
        }

        this.loginForm.disable();
        this.isLoading = true;
        this.sessionService.login(this.loginForm.value)
            .subscribe(() => {
                this.isLoading = false;
                this.navigationService.navigateToHome();
            }, (err) => {
                this.isLoading = false;
                this.loginForm.enable();
                this.messagesService.sendMessage({
                    type: MessageType.DANGER,
                    persist: false,
                    text: err.message
                });
            });



    }


}


class LoginForm extends FormGroup {

    static newInstance() {

        return new FormGroup({
            username: new FormControl("", Validators.required),
            password: new FormControl("", Validators.required)
        })
    }

    static fromModel(m: any): FormGroup {

        let d: FormGroup = LoginForm.newInstance();
        d.setValue(m);

        return d;

    }

}





