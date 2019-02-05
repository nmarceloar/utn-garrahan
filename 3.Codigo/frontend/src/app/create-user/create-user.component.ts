import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

    userForm: FormGroup = new FormGroup({
        firstname: new FormControl("", Validators.required),
        lastname: new FormControl("", Validators.required),
        dni: new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]),
        username: new FormControl("", Validators.required),
        email: new FormControl("", [Validators.required, Validators.email]),
        initials: new FormControl("", [Validators.required, Validators.pattern(/^[A-Z]{2,5}$/)]),
        isAdmin: new FormControl(false, [Validators.required])
    })

    submitted: boolean = false



    constructor(
        private messagService: MessageService,
        private userService: UserService) { }

    ngOnInit() {

    }

    createUser() {

        if (this.userForm.invalid) {
            this.submitted = true;
            return

        }

        this.userService.createOperator({ ...this.userForm.value })
            .subscribe(
                user => this.messagService.success("La operación se realizó correctamente"),
                err => this.messagService.error(`Error. ${err.message}`)
            )

    }

}
