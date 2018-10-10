import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, MessageType } from '../message.service';
import { UserService } from '../user.service';

import jwt_decode from "jwt-decode";

@Component({
    selector: 'app-password-change',
    templateUrl: './password-change.component.html',
    styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

    token: string;

    loginForm: FormGroup = new FormGroup({
        password: new FormControl("", Validators.required),
        passwordConfirm: new FormControl("", Validators.required),
    })

    submitted = false

    username: string

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

        this.userService.resetPassword({ ...this.loginForm.value, token: this.token })
            .subscribe(() => this.onAccountConfirmed(), err => this.onError(err))

    }

    onAccountConfirmed() {

        this.messageService.sendMessage({
            text: "La contraseña se modificó correctamente. Inicie sesión con sus credenciales",
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
