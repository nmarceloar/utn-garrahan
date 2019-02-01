import { Component, OnInit } from '@angular/core';
import { InstitutionsService, Institution, InstitutionType } from '../institutions.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../message.service';
import { OrderService, Order } from '../order.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

import { cuitValidator } from "../create-institution/create-institution.component"
import { tap } from 'rxjs/operators';
import { Observable, from, zip } from 'rxjs';

import { delay } from "rxjs/operators"

@Component({
    selector: 'app-institution-details',
    templateUrl: './institution-details.component.html',
    styleUrls: ['./institution-details.component.css']
})
export class InstitutionDetailsComponent implements OnInit {

    institution: Institution

    orders: Order[] = []

    it: InstitutionType[] = []

    newUserInProcess: boolean = false;

    institutionForm: FormGroup = new FormGroup({
        cuit: new FormControl("", [Validators.required, Validators.pattern(/^(30|33|34)(\-)?[0-9]{8}(\-)?[0-9]{1}$/)]),
        name: new FormControl("", Validators.required),
        email: new FormControl("", [Validators.required, Validators.email]),
        type: new FormControl(null, Validators.required),
        address: new FormControl("", Validators.required),
        userCount: new FormControl({ value: 0, disabled: true }),
        orderCount: new FormControl({ value: 0, disabled: true }),
        invalidCharCount: new FormControl(0, [Validators.required, Validators.pattern(/[0-9]{1}$/)])
    })

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


        zip(
            this.institutionService.findTypes(),
            this.institutionService.findById(this.activatedRoute.snapshot.params.id, { include: ["users", "type"] }),
            this.orderService.find({
                where: { institutionId: this.activatedRoute.snapshot.params.id },
                limit: 5,
                order: ["creationDate DESC"]
            })
        ).subscribe(([types, institution, institutionOrders]) => {

            this.it = types
            this.setInstitution(institution)
            this.orders = (institutionOrders as any).items


        }, err => this.handleError(err))

        this.newUserInProcess = false

    }

    private fetchTypes() {
        return this.institutionService.findTypes()
    }

    private fetchInstitution() {
        return this.institutionService.findById(this.activatedRoute.snapshot.params.id, { include: ["users", "type"] })
    }

    private fetchOrders() {

        return this.orderService.find({
            where: { institutionId: this.activatedRoute.snapshot.params.id },
            limit: 5,
            order: ["creationDate DESC"]
        })

    }

    private setInstitution(i) {

        this.institution = i;
        this.institutionForm
            .patchValue({ ...i, type: this.it.filter(_it => _it.name === i.type.name)[0] });
        this.institutionForm.controls.orderCount.disable()
        this.institutionForm.controls.userCount.disable()

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

    saveInstitution() {

        this.institutionForm.disable()
        this.institutionService.update(this.institution.id, {
            address: this.institutionForm.controls.address.value,
            cuit: this.institutionForm.controls.cuit.value,
            email: this.institutionForm.controls.email.value,
            invalidCharCount: this.institutionForm.controls.invalidCharCount.value,
            name: this.institutionForm.controls.name.value,
            typeId: this.institutionForm.controls.type.value.name,
        })
            .pipe(
                delay(1000),
                tap(() => this.institutionForm.enable()),
                tap(i => this.messageService.success("Los datos se actualizaron correctamente"))
            )
            .subscribe(i => this.ngOnInit(), err => this.handleError(err))


    }



}
