import { Component, OnInit, HostListener } from '@angular/core';
import { OrderStatus, Order, OrderService } from '../order.service';
import { User, SessionService } from '../session.service';
import { MessageService, MessageType } from '../message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { map, tap, flatMap, catchError } from 'rxjs/operators';
import { from as fromPromise, throwError, zip, from, timer } from "rxjs"
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UnitEditModalComponent } from '../unit-edit-modal/unit-edit-modal.component';
import { AppMessagesService } from '../app-messages.service';

@Component({
    selector: 'app-edit-order',
    templateUrl: './edit-order.component.html',
    styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {

    user: User

    removedUnitIds: number[] = []

    order: Order
    nextStatus: OrderStatus;

    isPrinting: boolean = false;

    selectedCarrier: FormControl = new FormControl("");

    submited: boolean = false;

    addedUnits: any[] = []
    removedUnits: any[] = []

    isWaitingForUnit = { should: true }

    unitTypes: any[]
    statuses: any[];

    unitForm: FormGroup = new FormGroup({
        code: new FormControl("", Validators.required),
        type: new FormControl(null, Validators.required)
    })

    isLoading: boolean = false;

    private orderIncludes = [
        { units: { type: true } },
        { priority: true },
        { status: true },
        { owner: { institution: true } },
        { conciliationComments: { operator: true } },
        { unitTypeMappings: { unitType: true } }
    ];

    constructor(
        private appMessages: AppMessagesService,
        private orderService: OrderService,
        private messageService: MessageService,
        private sessionService: SessionService,
        private modalService: NgbModal,
        private route: ActivatedRoute) {

        this.sessionService.events.subscribe(sessionEvent => {
            this.user = sessionEvent.user
        })

        this.unitForm.valueChanges.subscribe(d => console.log(d))
    }

    ngOnInit() {


        zip(this.orderService.findUnitTypes(), this.orderService.findStatuses())
            .subscribe((data) => {
                this.unitTypes = data[0]
                this.statuses = data[1]
            });


        this.route.params
            .pipe(
                map((params) => params.id),
                tap(() => this.startLoading()),
                flatMap((orderId) => this.orderService.findById(orderId, {
                    include: this.orderIncludes
                }))
            )
            .subscribe(
                (order) => this.setOrder(order),
                (err) => this.handleErr(err)
            );

    }

    ngOnDestroy(): void { }


    startLoading() {
        this.isLoading = true;
    }


    stopLoading() {
        this.isLoading = false;
    }

    setOrder(order: Order) {

        this.isLoading = false;
        this.order = order;

        this.selectedCarrier.setValue(order.carrier);

    }

    handleErr(err) {

        this.isLoading = false;
        this.messageService.sendMessage({
            type: MessageType.DANGER,
            persist: false,
            text: err.message
        })

    }

    addUnit() {

        if (this.unitForm.invalid) {
            this.submited = true;
            return
        }

        if (this.order.units.findIndex(unit => unit.code === this.unitForm.value.code) !== -1) {

            this.messageService.sendMessage({
                persist: false,
                type: MessageType.DANGER,
                text: "Ya existe una unidad con ese codigo",
                ttlInSeconds: 5
            })

            this.isWaitingForUnit = { should: true }

            return;
        }


        let u = {
            code: this.unitForm.value.code,
            type: this.unitForm.value.type,
            creationDate: new Date().toISOString(),
            unitTypeId: this.unitForm.value.type.id
        }

        console.log(u)

        this.order.units.unshift(u)

        console.log(this.order.units)

        this.unitForm.reset();
        this.submited = false;

        this.isWaitingForUnit = { should: true }

    }

    removeUnit(unit) {

        let removedUnit = this.order.units.splice(this.order.units.findIndex(u => u === unit), 1)[0]

        if (removedUnit.id)
            this.removedUnitIds.push(removedUnit.id)

    }

    edit(unit) {

        let m = this.modalService.open(UnitEditModalComponent, { centered: true, size: "lg", backdrop: "static" })
        m.componentInstance.unitTypes = this.unitTypes
        m.componentInstance.unit = unit

        from(m.result).subscribe((data) => {

            let canReplace = (data.previous.code === data.actual.code) ||
                (this.order.units.findIndex(unit => unit.code === data.actual.code) === -1)

            if (canReplace) {

                let i = this.order.units.findIndex(u => u.code === data.previous.code)
                this.order.units.splice(i, 1)
                this.order.units.splice(i, 0, { ...data.actual, creationDate: data.previous.creationDate })

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

        if (this.selectedCarrier.invalid) {

            this.messageService.sendMessage({
                type: MessageType.DANGER,
                persist: false,
                text: "Debe ingresar un transportista para la orden",
                ttlInSeconds: 5
            })
            return;

        }

        this.nextStatus =
            this.statuses.filter((status) => status.name === "PENDIENTE")[0];

        console.log(this.nextStatus);

        let unitsWithId = this.order.units.filter(u => u.id).map((u) => ({
            id: u.id,
            code: u.code,
            creationDate: u.creationDate,
            unitTypeId: u.unitTypeId
        }));

        let unitsWithoutId = this.order.units.filter(u => !u.id).map((u) => ({
            code: u.code,
            creationDate: u.creationDate,
            unitTypeId: u.unitTypeId
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
            .pipe(
                flatMap(order => this.orderService.findById(order.id, { include: this.orderIncludes }))
            )
            .subscribe(
                (order) => {

                    this.setOrder(order);
                    this.messageService.sendMessage({
                        type: MessageType.SUCCESS,
                        persist: false,
                        text: "La operación se realizó correctamente. La orden permanecerá pendiente hasta ser revisada por un operador."
                    })
                },
                err => {
                    this.messageService.sendMessage({
                        type: MessageType.DANGER,
                        persist: false,
                        text: `Error. ${err.message}`
                    })
                }
            );

    }

    cancelOrder() {

        this.nextStatus =
            this.statuses.filter((status) => status.name === "CANCELADA")[0];

        this.orderService.markOrderAs(this.order.id, this.nextStatus)
            .pipe(
                tap(order => console.log(order)),
                flatMap(order => this.orderService.findById(order.id, { include: this.orderIncludes }))
            )
            .subscribe(
                (order) => {
                    this.order = order
                    this.messageService.sendMessage({
                        type: MessageType.SUCCESS,
                        persist: false,
                        text: "La operación se realizó correctamente. La orden ya no será tenida en cuenta por el Banco."
                    })
                },
                err => {
                    this.messageService.sendMessage({
                        type: MessageType.DANGER,
                        persist: false,
                        text: `Error al intentar cancelar la orden. ${err.message}`
                    })
                }
            );


    }


    get hasOrder() {

        return !!this.order;


    }


    get canModify() {

        return this.order.status.name === "RECHAZADA"  // isRejected ??

    }

    onPrint() {

        this.appMessages.printStarted()
        this.isPrinting = true;

        timer(500)
            .subscribe(() => {
                window.print()

            })

    }

    @HostListener("window:afterprint")
    afterPrint() {

        this.isPrinting = false;
        this.appMessages.printEnded()

    }

    @HostListener("document:keydown.control.p", ["$event"])
    onPrintTry(event: any) {

        event.preventDefault()

    }


}
