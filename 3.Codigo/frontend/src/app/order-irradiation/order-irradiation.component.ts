import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService, Order } from '../order.service';
import { FormControl, Validators } from '@angular/forms';
import { interval, GroupedObservable, Observable, from as fromPromise, timer } from 'rxjs';
import { map, flatMap, tap, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { SessionService } from '../session.service';

import * as moment from "moment"
import { MessageService, MessageType } from '../message.service';
import { CancelConfirmationModalComponent } from '../cancel-confirmation-modal/cancel-confirmation-modal.component';

@Component({
    selector: 'app-order-irradiation',
    templateUrl: './order-irradiation.component.html',
    styleUrls: ['./order-irradiation.component.css']
})
export class OrderIrradiationComponent implements OnInit, OnDestroy {

    irradiations: any[];
    unitCodeDoesNotExist: boolean = false;
    order: Order

    isLoading = false;

    startTime: Date
    stopTime: Date

    currentUser

    comment: FormControl = new FormControl("");

    isWaitingForTag: {} = { should: true }
    isWaitingForUnit: {} = { should: false }

    hasUnitCodeError: boolean = false;
    hasTagError: boolean = false;

    isIrradiationInProcess: boolean = false;

    pendingUnits: any[] = []
    completedUnits: any[] = []
    selectedUnits: any[] = []

    selectedTag: FormControl = new FormControl("", Validators.required);
    selectedUnitCode: FormControl = new FormControl("", Validators.required);

    private orderIncludes = [
        { irradiations: [{ units: { type: true } }, { irradiator: true }] },
        { priority: true },
        { status: true },
        { owner: { institution: true } },
        { conciliationComments: { operator: true } },
        { unitTypeMappings: { unitType: true } },
        { units: ["type"] }
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

        [this.selectedTag, this.selectedUnitCode].forEach(d => d.reset())

        this.order = order;

        this.irradiations = order.irradiations.sort((a,b) => a.irradiationStart > b.irradiationStart ? -1 : 1)

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

        this.isWaitingForUnit = {should: true}



    }

    selectManually(unit) {

        let item = this.pendingUnits.splice(this.pendingUnits.findIndex(u => u === unit), 1)[0];

        item.irradiationTag = this.selectedTag.value;

        this.selectedUnits.unshift(item);

        this.isWaitingForUnit = { should: 1 }

        this.unitCodeDoesNotExist = false;
        this.hasUnitCodeError = false;

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

        this.isWaitingForUnit = {should: true}

    }


    startIrradiation() {

        this.startTime = new Date();

        this.selectedTag.disable();
        this.selectedUnitCode.disable();

        this.isIrradiationInProcess = true;

    }

    stopIrradiation() {

        this.stopTime = new Date();

        fromPromise(this.modalService.open(CancelConfirmationModalComponent, { backdrop: "static", keyboard: false }).result)
            .subscribe((comments) => {

                console.log(comments);

                this.selectedTag.enable();
                this.selectedUnitCode.enable();

                this.isIrradiationInProcess = false;

                let irradiation = {
                    units: this.selectedUnits.map(u => u.id),
                    irradiationStart: this.startTime,
                    irradiationEnd: this.stopTime,
                    irradiationTag: this.selectedTag.value,
                    irradiationTime: Math.ceil((this.stopTime.getTime() - this.startTime.getTime()) / 1000 / 60),
                    irradiatorId: this.currentUser.id,
                    comments: comments
                }

                this.orderService.addIrradiation(this.order.id, irradiation)
                    .pipe(
                        flatMap(() => this.orderService.findById(this.order.id, { include: this.orderIncludes }))
                    )
                    .subscribe(
                        (d) => this.handleEndOfIrradiation(d),
                        (err) => this.handleFailingEndOfIrradiation(err)
                    );

            }, () => { })




    }

    removeUnit(unit) {

        let removed = this.selectedUnits.splice(this.selectedUnits.indexOf(unit), 1)[0];
        this.pendingUnits.unshift(removed);

    }

    handleEndOfIrradiation(order: any) {

        let message = "La irradiación de los componentes se registró correctamente. "
        let add = order.status.name === "IRRADIADA" ? "La orden se ha completado en su totalidad." : "";

        let m = [message, add].join("");

        this.messageService.sendMessage({
            persist: true,
            type: MessageType.SUCCESS,
            text: m
        })

        this.prepare(order);

    }

    handleFailingEndOfIrradiation(err: any) {

        let message = "Error al intentar registro de irradiación. "
        let add = err.message

        let m = [message, add].join("");

        this.messageService.sendMessage({
            persist: true,
            type: MessageType.DANGER,
            text: m
        })

    }


    get canStart() {

        return this.selectedUnits.length > 0

    }

    get hasTag() {

        return this.selectedTag.value 

    }






}
