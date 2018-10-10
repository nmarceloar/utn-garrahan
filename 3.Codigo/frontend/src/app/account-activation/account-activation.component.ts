import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { MessageService, MessageType } from '../message.service';

import jwt_decode from "jwt-decode";

@Component({
    selector: 'app-account-activation',
    templateUrl: './account-activation.component.html',
    styleUrls: ['./account-activation.component.css']
})
export class AccountActivationComponent implements OnInit {

    token: string;

    loginForm: FormGroup = new FormGroup({
        password: new FormControl("", Validators.required),
        passwordConfirm: new FormControl("", Validators.required),
    }, { validators: passwordMatch })

    submitted = false;

    username

    constructor(
        private router: Router,
        private messageService: MessageService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {

        this.token = this.activatedRoute.snapshot.queryParams.token
        this.username = jwt_decode(this.token).username

    }

    confirm() {

        if (this.loginForm.invalid) {
            this.submitted = true
            return
        }

        this.userService.activate({ ...this.loginForm.value, token: this.token })
            .subscribe(() => this.onAccountConfirmed(), err => this.onError(err))

    }

    onAccountConfirmed() {

        this.messageService.sendMessage({
            text: "La cuenta se activó correctamente. Inicie sesión con sus credenciales",
            ttlInSeconds: 10,
            type: MessageType.SUCCESS,
            persist: true
        })

        this.router.navigateByUrl("/login")

    }

    onError(err) {

        this.messageService.error(err.message)

    }

}


const passwordMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {

    const password = control.controls.password.value
    const passwordConfirm = control.controls.passwordConfirm.value

    const compare = password && passwordConfirm

    if (compare)
        return password === passwordConfirm ? null : { 'passwordMatch': true }

    return null

};
