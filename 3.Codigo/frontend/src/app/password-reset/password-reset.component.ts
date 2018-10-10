import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { MessageService, MessageType } from '../message.service';

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

    prForm = new FormGroup({
        email: new FormControl("", [Validators.required, Validators.email])
    })

    submitted = false;

    constructor(
        private router: Router,
        private messageService: MessageService,
        private userService: UserService) { }

    ngOnInit() {
    }

    resetPassword() {

        if (this.prForm.invalid) {
            this.submitted = true;
            return
        }

        this.userService.requestPasswordReset(this.prForm.controls.email.value)
            .subscribe(() => this.onSuccess(), (err) => this.onError(err))

    }

    onSuccess() {

        this.messageService.sendMessage({
            type: MessageType.SUCCESS,
            text: "La operación se realizó exitosamente. Revise su email para más instrucciones.",
            ttlInSeconds: 10,
            persist: false
        })


    }

    onError(err) {

        this.messageService.error(err.message)

    }

}
