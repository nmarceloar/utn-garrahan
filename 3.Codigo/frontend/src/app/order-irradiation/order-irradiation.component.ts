import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService, Order } from '../order.service';
import { FormControl, Validators } from '@angular/forms';
import { interval, GroupedObservable, Observable, from as fromPromise } from 'rxjs';
import { map, flatMap, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { SessionService } from '../session.service';

import * as moment from "moment"
import { MessageService, MessageType } from '../message.service';

@Component({
    selector: 'app-order-irradiation',
    templateUrl: './order-irradiation.component.html',
    styleUrls: ['./order-irradiation.component.css']
})
export class OrderIrradiationComponent implements OnInit, OnDestroy {

    unitCodeDoesNotExist: boolean = false;
    order: Order

    isLoading = false;

    startTime: Date
    stopTime: Date

    currentUser

    isWaitingForTag: boolean = true;
    isWaitingForUnit: boolean = false;

    hasUnitCodeError: boolean = false;
    hasTagError: boolean = false;

    isIrradiationInProcess: boolean = false;

    pendingUnits: any[] = []
    completedUnits: any[] = []
    selectedUnits: any[] = []

    selectedTag: FormControl = new FormControl("", Validators.required);
    selectedUnitCode: FormControl = new FormControl("", Validators.required);

    private orderIncludes = [
        { priority: true },
        { status: true },
        { owner: { institution: true } },
        { conciliationComments: { operator: true } },
        { unitTypeMappings: { unitType: true } },
        { units: ["type", "irradiatedBy"] }
    ];

    constructor(
        private route: ActivatedRoute,
        private messageService: MessageService,
        private sessionService: SessionService,
        private modalService: NgbModal,
        private orderService: OrderService) {

        this.sessionService.events
            .subscribe(s => {
                this.currentUser = s.user
            })

    }

    ngOnInit() {

        this.route.params
            .pipe(
                map((params) => params.id),
                tap(() => this.isLoading = true),
                flatMap((id) => this.orderService.findById(id, { include: this.orderIncludes })),
                tap(
                    () => this.isLoading = false,
                    () => this.isLoading = false
                )
            )
            .subscribe(
                (order) => this.prepare(order),
                (err) => this.handleErr(err)
            )

    }

    ngOnDestroy() { }

    prepare(order: any) {

        this.order = order;

        this.selectedUnits = [];

        this.pendingUnits =
            order.units.filter(u => !u.irradiated);

        this.completedUnits =
            order.units
                .filter(u => u.irradiated)
                .map((u) => ({
                    ...u,
                    irradiationTime:
                        Math.ceil((new Date(u.irradiationEnd).getTime() - new Date(u.irradiationStart).getTime()) / (1000 * 60))
                }))

        this.isWaitingForTag = true;
        this.isWaitingForUnit = false


    }

    handleErr(err) {

        this.messageService.sendMessage({
            type: MessageType.DANGER,
            persist: false,
            text: err.message
        })

    }

    get canIrradiate() {

        return !!this.order && this.order.units.some(u => !u.irradiated)

    }

    onTagConfirmed() {

        if (this.selectedTag.invalid) {
            this.hasTagError = true;
            return;
        }

        this.hasTagError = false;
        this.isWaitingForTag = false;
        this.isWaitingForUnit = true;

    }

    selectUnit() {

        if (this.selectedUnitCode.invalid) {
            this.hasUnitCodeError = true;
            return;
        }

        this.hasUnitCodeError = false;

        let i = this.pendingUnits.findIndex(u => u.code === this.selectedUnitCode.value);
        if (i === -1) {
            this.unitCodeDoesNotExist = true;
            return;
        }

        this.unitCodeDoesNotExist = false;

        let item = this.pendingUnits.splice(i, 1)[0];

        item.irradiationTag = this.selectedTag.value;

        this.selectedUnits.unshift(item);

        this.selectedUnitCode.reset();

    }

    clearTag() {

        this.isWaitingForUnit = false;
        this.isWaitingForTag = true;

    }

    startIrradiation() {

        this.startTime = new Date();

        this.selectedTag.disable();
        this.selectedUnitCode.disable();

        this.isIrradiationInProcess = true;

    }

    stopIrradiation() {

        this.stopTime = new Date();

        this.selectedTag.enable();
        this.selectedUnitCode.enable();

        this.isIrradiationInProcess = false;

        this.selectedUnits.forEach((unit) => {
            unit.irradiated = true;
            unit.irradiationStart = this.startTime
            unit.irradiationEnd = this.stopTime
            unit.irradiatorUserId = this.currentUser.id
        })

        this.orderService.markUnitsAsIrradiated(this.order.id, this.selectedUnits)
            .pipe(flatMap(() => this.orderService.findById(this.order.id, { include: this.orderIncludes })))
            .subscribe(
                (d) => this.prepare(d),
                (err) => console.error(err)
            );

    }

    removeUnit(unit) {

        let removed = this.selectedUnits.splice(this.selectedUnits.indexOf(unit), 1)[0];
        this.pendingUnits.unshift(removed);

    }

    get canStart() {

        return this.selectedUnits.length > 0

    }






}
