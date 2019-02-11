import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderStatus, OrderService } from '../order.service';
import { AppMessagesService } from '../app-messages.service';
import { MessageService, MessageType } from '../message.service';
import { SessionService } from '../session.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { map, tap, flatMap, catchError } from 'rxjs/operators';
import { from as fromPromise, throwError, zip, from, timer } from "rxjs"
import { UnitEditModalComponent } from '../unit-edit-modal/unit-edit-modal.component';
import { ClientUsbConfigComponent } from '../client-usb-config/client-usb-config.component';
import { Location } from '@angular/common';


@Component({
    selector: 'app-operator-edit-order',
    templateUrl: './operator-edit-order.component.html',
    styleUrls: ['./operator-edit-order.component.css']
})
export class OperatorEditOrderComponent implements OnInit {

    usbReaderEnabled: FormControl = new FormControl(true)

    invalidCharCount: number = 0

    user
    order
    unitTypes
    statuses

    removedUnitIds: number[] = []

    nextStatus: OrderStatus;

    isPrinting: boolean = false;

    selectedCarrier: FormControl = new FormControl("");

    submited: boolean = false;

    addedUnits: any[] = []
    removedUnits: any[] = []

    isLoading: boolean = false;

    isWaitingForUnit = { should: true }

    unitForm: FormGroup = new FormGroup({
        unitType: new FormControl(null, Validators.required),
        unitCode: new FormControl("", Validators.required)
    })


    private orderIncludes = [
        { units: { type: true } },
        { priority: true },
        { status: true },
        { owner: { institution: true } },
        { conciliationComments: { operator: true } },
        { unitTypeMappings: { unitType: true } }
    ];

    constructor(
        private location: Location,
        private appMessages: AppMessagesService,
        private orderService: OrderService,
        private messageService: MessageService,
        private sessionService: SessionService,
        private modalService: NgbModal,
        private route: ActivatedRoute) {

        this.sessionService.events.subscribe(sessionEvent => {
            this.user = sessionEvent.user
        })

    }

    ngOnInit() {

        zip(
            this.orderService.findUnitTypes(),
            this.orderService.findStatuses(),
            this.orderService.findById(this.route.snapshot.params.id, { include: this.orderIncludes })
                .pipe(tap(() => this.startLoading()))
        ).subscribe(([types, statuses, order]) => {
            this.unitTypes = types
            this.statuses = statuses
            this.order = order
            this.selectedCarrier.setValue(order.carrier)
            this.stopLoading()
        }, err => this.handleErr(err));

    }

    ngOnDestroy(): void { }


    startLoading() {
        this.isLoading = true;
    }


    stopLoading() {
        this.isLoading = false;
    }


    handleErr(err) {

        this.stopLoading()
        this.messageService.sendMessage({
            type: MessageType.DANGER,
            persist: false,
            text: err.message
        })

    }

    private usbEnabled(): boolean {
        return this.usbReaderEnabled.value as boolean
    }


    private unitExists() {

        return this.order.units.some(unit =>
            (unit.type.code === this.unitForm.value.unitType.code) && (unit.code === this.unitForm.value.unitCode)
        )

    }


    addUnit() {

        if (this.usbEnabled()) {

            this.unitForm.controls.unitCode.setValue(this.unitForm.controls.unitCode.value.substr(this.invalidCharCount),
                { emitEvent: false })

        }

        if (this.unitForm.invalid) {
            this.submited = true;
            return
        }

        if (this.unitExists()) {

            this.messageService.sendMessage({
                persist: false,
                type: MessageType.DANGER,
                text: "Ya existe una unidad con igual tipo y código",
                ttlInSeconds: 3
            })

            this.unitForm.controls.unitCode.reset();

            this.isWaitingForUnit = { should: true }

            return;

        }

        this.order.units.unshift({
            code: this.unitForm.value.unitCode,
            type: this.unitForm.value.unitType,
            creationDate: new Date()
        })

        this.sortUnits()

        this.updateMappings()

        this.unitForm.controls.unitCode.reset();

        this.submited = false;

        this.isWaitingForUnit = { should: true }

    }


    private updateMappings() {

        this.order.unitTypeMappings =
            this.unitTypes.map(ut => ({
                unitType: ut,
                count: this.order.units.filter(u => u.type.code === ut.code).length
            }));

    }


    sortUnits() {

        this.order.units.sort((u1, u2) => u1.type.code < u2.type.code ? -1 : 1);

    }


    removeUnit(unit) {

        let removedUnit =
            this.order.units.splice(this.order.units.findIndex(u => u === unit), 1)[0]

        if (removedUnit.id)
            this.removedUnitIds.push(removedUnit.id)

        this.updateMappings()

    }

    edit(unit) {

        let m = this.modalService.open(UnitEditModalComponent, { centered: true, size: "lg", backdrop: "static" })
        m.componentInstance.unitTypes = this.unitTypes
        m.componentInstance.unit = unit

        from(m.result)
            .subscribe((data) => {

                let canReplace = (data.previous.code === data.actual.code) ||
                    (this.order.units.findIndex(unit => unit.code === data.actual.code) === -1)

                if (canReplace) {

                    let i = this.order.units.findIndex(u => u.code === data.previous.code)
                    this.order.units.splice(i, 1)
                    this.order.units.splice(i, 0, { ...data.actual, creationDate: data.previous.creationDate })

                    this.updateMappings()

                } else {

                    this.messageService.sendMessage({
                        persist: false,
                        type: MessageType.DANGER,
                        text: "Ya existe una unidad con ese codigo",
                        ttlInSeconds: 5
                    })

                }

                this.isWaitingForUnit = { should: true }

            }, () => { })

    }

    confirmChanges() {

        //if (this.selectedCarrier.invalid) {

        //    this.messageService.sendMessage({
        //        type: MessageType.DANGER,
        //        persist: false,
        //        text: "Debe ingresar un transportista para la orden",
        //        ttlInSeconds: 5
        //    })

        //    return;

        //}

        this.nextStatus =
            this.statuses.filter((status) => status.name === "PENDIENTE")[0];

        let unitsWithId = this.order.units.filter(u => u.id)
            .map((u) => ({
                id: u.id,
                code: u.code,
                creationDate: u.creationDate,
                unitTypeId: u.type.id
            }));

        let unitsWithoutId = this.order.units.filter(u => !u.id)
            .map((u) => ({
                code: u.code,
                creationDate: u.creationDate,
                unitTypeId: u.type.id
            }));

        let units = [...unitsWithId, ...unitsWithoutId];

        let order = {
            id: this.order.id,
            code: this.order.code,
            carrier: this.selectedCarrier.value,
            statusId: this.nextStatus.name,
            priorityId: this.order.priorityId,
            creationDate: this.order.creationDate,
            institutionId: this.order.institutionId,
            ownerId: this.order.ownerId,
            units: units,
            removedUnitIds: this.removedUnitIds
        }

        this.orderService.updateWithUnits(this.order.id, order)
            .pipe(flatMap(order => this.orderService.findById(order.id, { include: this.orderIncludes })))
            .subscribe(() => this.location.back(),
                err => {
                    this.messageService.sendMessage({
                        type: MessageType.DANGER,
                        persist: false,
                        text: `Error. ${err.message}`
                    })
                }
            );

    }


    get hasOrder() {

        return !!this.order;


    }


    get canModify() {

        return this.order.status.name === "RECHAZADA" || this.order.status.name === "PENDIENTE"

    }


    configUsb() {

        let m = this.modalService.open(ClientUsbConfigComponent, { centered: true, size: "lg", backdrop: "static" })
        m.componentInstance.invalidCharCount.setValue(this.invalidCharCount)

        from(m.result)
            .subscribe(invalidCharCount => this.invalidCharCount = invalidCharCount, () => { })

    }

}
