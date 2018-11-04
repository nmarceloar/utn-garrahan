import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService, Order } from '../order.service';
import { FormControl, Validators } from '@angular/forms';
import { interval, GroupedObservable, Observable, from as fromPromise, timer, throwError, from } from 'rxjs';
import { map, flatMap, tap, take, catchError } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { SessionService } from '../session.service';

import * as moment from "moment"
import { MessageService, MessageType } from '../message.service';
import { CancelConfirmationModalComponent } from '../cancel-confirmation-modal/cancel-confirmation-modal.component';
import { ModalReloginComponent } from '../modal-relogin/modal-relogin.component';
import { SelectUnitModalComponent } from '../select-unit-modal/select-unit-modal.component';
import { ConfigService } from '../config.service';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
    selector: 'app-order-irradiation',
    templateUrl: './order-irradiation.component.html',
    styleUrls: ['./order-irradiation.component.css']
})
export class OrderIrradiationComponent implements OnInit, OnDestroy {

    irradiations: any[];

    unitCodeDoesNotExist: boolean = false;
    order: Order

    lastErrorCode: string

    isLoading = false;

    startTime: Date
    stopTime: Date

    canStop: boolean = false;

    currentUser

    minTimeOfIrradiation: number;

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
        { orderAcceptor: true },
        { status: true },
        { owner: { institution: true } },
        { conciliationComments: { operator: true } },
        { unitTypeMappings: { unitType: true } },
        { units: { type: true } }
    ];

    constructor(
        private route: ActivatedRoute,
        private messageService: MessageService,
        private sessionService: SessionService,
        private configService: ConfigService,
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


        this.configService.load()
            .subscribe((config) => {

                let minTime = +((config.filter(d => (d as any).name === "minTimeOfIrradiationInMinutes")[0] as any).value)
                this.minTimeOfIrradiation = (minTime) * 60 * 1000


            }, (err) => {
                this.handleErr(err)
            })


    }

    ngOnDestroy() { }

    prepare(order: any) {

        [this.selectedTag, this.selectedUnitCode].forEach(d => d.reset())

        this.order = order;

        this.irradiations = order.irradiations.sort((a, b) => a.irradiationStart > b.irradiationStart ? -1 : 1)

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

        this.selectedTag.setValue(this.selectedTag.value.substr(2), { emitEvent: false })

        if (this.selectedTag.invalid) {
            this.hasTagError = true;
            return;
        }

        this.hasTagError = false;

        this.isWaitingForUnit = { should: true }

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

        this.selectedUnitCode.setValue(this.selectedUnitCode.value.substr(2), { emitEvent: false })

        if (this.selectedUnitCode.invalid) {

            this.hasUnitCodeError = true;
            return;

        }

        this.hasUnitCodeError = false;

        let i = this.pendingUnits.filter(u => u.code === this.selectedUnitCode.value)

        if (i.length === 0) {

            this.unitCodeDoesNotExist = true;
            this.lastErrorCode = this.selectedUnitCode.value;
            this.selectedUnitCode.reset()
            return;

        }

        this.unitCodeDoesNotExist = false;

        if (i.length === 1) {

            let item = this.pendingUnits.splice(this.pendingUnits.findIndex(u => u === i[0]), 1)[0];

            item.irradiationTag = this.selectedTag.value;

            this.selectedUnits.unshift(item);

            this.selectedUnitCode.reset();

            this.isWaitingForUnit = { should: true }


        } else {

            let d: NgbModalRef = this.modalService.open(SelectUnitModalComponent, {
                size: "lg",
                backdrop: "static",
                centered: true,
                keyboard: false
            })

            d.componentInstance.units = i;

            from(d.result)
                .subscribe(selectedUnit => {

                    let item = this.pendingUnits.splice(this.pendingUnits.findIndex(u => u === selectedUnit), 1)[0];

                    item.irradiationTag = this.selectedTag.value;

                    this.selectedUnits.unshift(item);

                    this.selectedUnitCode.reset();

                    this.isWaitingForUnit = { should: true }

                }, () => { })


        }


    }


    startIrradiation() {

        this.startTime = new Date();

        this.canStop = false;
        timer(this.minTimeOfIrradiation)
            .subscribe(() => this.canStop = true)

        this.selectedTag.disable();
        this.selectedUnitCode.disable();

        this.isIrradiationInProcess = true;


    }

    stopIrradiation() {

        this.stopTime = new Date();

        this.showConfirmationModal()
            .subscribe((comments) => {

                this.showReloginModal()
                    .subscribe(() => {

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
                                catchError(err => throwError(new Error(`Error al intentar registro de irradiación. ${err.message}`))),
                                flatMap(() => this.orderService.findById(this.order.id, { include: this.orderIncludes })),
                                catchError(err => throwError(new Error(`Error. ${err.message}`))),
                        )
                            .subscribe(
                                (d) => this.handleEndOfIrradiation(d),
                                (err) => this.handleFailingEndOfIrradiation(err)
                            );



                    }, () => {

                        console.log(`Login modal closed or dismissed`)

                    })

            }, () => {

                console.log(`Confirm modal closed`);

            })




    }

    private showConfirmationModal() {
        return fromPromise(
            this.modalService.open(CancelConfirmationModalComponent, { backdrop: "static", keyboard: false, size: "lg" }).result);
    }

    private showReloginModal() {

        return fromPromise(
            this.modalService.open(ModalReloginComponent, { backdrop: "static", keyboard: false, size: "lg" }).result);

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

        this.messageService.error(err.message)

    }

    get hasTag() {

        return this.selectedTag.value && (this.isWaitingForUnit as any).should

    }


    get canStart() {

        return this.selectedUnits.length > 0

    }

    @HostListener('window:beforeunload', ['$event'])
    preventPageRefresh(event) {

        if (this.isIrradiationInProcess)
            event.returnValue = "Está seguro que desea salir ?"

    }






}
