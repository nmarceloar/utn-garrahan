import { Component, OnInit } from '@angular/core';
import { InstitutionsService, Institution } from '../institutions.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../message.service';
import { OrderService, Order } from '../order.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
    selector: 'app-institution-details',
    templateUrl: './institution-details.component.html',
    styleUrls: ['./institution-details.component.css']
})
export class InstitutionDetailsComponent implements OnInit {

    institution: Institution
    orders: Order[] = []

    newUserInProcess: boolean = false;

    userForm: FormGroup = new FormGroup({
        firstname: new FormControl("", Validators.required),
        lastname: new FormControl("", Validators.required),
        dni: new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]),
        username: new FormControl("", Validators.required),
        email: new FormControl("", [, Validators.required, Validators.email])
    })

    submitted = false;

    constructor(
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private orderService: OrderService,
        private institutionService: InstitutionsService) { }

    ngOnInit() {

        this.institutionService.findById(this.activatedRoute.snapshot.params.id, { include: ["users", "type"] })
            .subscribe(
                i => this.setInstitution(i),
                err => this.handleError(err)
            )

        this.orderService.find({
            where: { institutionId: this.activatedRoute.snapshot.params.id },
            limit: 5,
            order: ["creationDate DESC"]
        }).subscribe(o => this.orders = o.items, err => this.handleError(err))

        this.newUserInProcess = false;

    }

    private setInstitution(i) {

        this.institution = i;

    }

    private handleError(err) {

        this.messageService.error(err.message)
        this.userForm.enable();

    }

    get hasInstitution() {
        return !!this.institution
    }

    newUser() {

        this.userForm.reset();
        this.userForm.enable();
        this.newUserInProcess = true;

    }

    disableUser(userId) {

        this.userService.disable(userId)
            .subscribe(() => this.ngOnInit(), err => this.handleError(err))

    }

    enableUser(userId) {

        this.userService.enable(userId)
            .subscribe(() => this.ngOnInit(), err => this.handleError(err))

    }

    createUser() {

        if (this.userForm.invalid) {

            this.submitted = true;
            return

        }

        this.userForm.disable()
        this.userService.createClient({
            institutionId: this.activatedRoute.snapshot.params.id,
            ...this.userForm.value
        }).subscribe(u => this.ngOnInit(), err => this.handleError(err))

    }

    cancelUser() {

        this.newUserInProcess = false;

    }

}
