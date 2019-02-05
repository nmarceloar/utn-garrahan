import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from '../message.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

    user

    userForm: FormGroup = new FormGroup({
        firstname: new FormControl("", Validators.required),
        lastname: new FormControl("", Validators.required),
        dni: new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]),
        email: new FormControl("", [, Validators.required, Validators.email])
    })

    submitted: boolean = false

    constructor(
        private location: Location,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService) { }

    ngOnInit() {

        this.userService.findById(this.activatedRoute.snapshot.params.id)
            .subscribe(user => this.setUser(user), err => this.handleError(err))

    }

    setUser(user) {

        this.user = user

        this.userForm.patchValue(user)

    }

    handleError(err) {

        this.messageService.error(err.message)

    }

    editUser() {

        if (this.userForm.invalid) {
            this.submitted = true;
            return
        }


        this.userService.update(this.user.id, { ...this.userForm.value })
            .subscribe(user => {
                this.messageService.success(`La operación se realizó correctamente`)
            }, err => this.handleError(err))

    }

    cancelUser() {

        this.location.back()

    }

}
