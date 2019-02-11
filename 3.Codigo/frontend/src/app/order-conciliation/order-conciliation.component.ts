import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order, OrderStatus } from '../order.service';
import { MessageService, MessageType } from '../message.service';
import { interval, from as fromPromise, zip, throwError, timer } from 'rxjs';
import { take, switchMap, map, tap, finalize, flatMap, catchError } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { User, SessionService } from '../session.service';
import { Location } from '@angular/common';
import { OrderPrintModalComponent } from '../order-print-modal/order-print-modal.component';


import * as jsPDF from "jspdf"
import { AppMessagesService } from '../app-messages.service';


@Component({
    selector: 'app-order-conciliation',
    templateUrl: './order-conciliation.component.html',
    styleUrls: ['./order-conciliation.component.css']
})
export class OrderConciliationComponent implements OnInit, OnDestroy {

    statuses: OrderStatus[];
    nextStatus: OrderStatus;

    order: Order
    user: User

    isPreparing: boolean = false;
    isPrinting: boolean = false;

    isLoading: boolean = false;

    private orderIncludes = [
        { units: { type: true } },
        { orderAcceptor: true },
        { priority: true },
        { status: true },
        { owner: { institution: true } },
        { conciliationComments: { operator: true } },
        { unitTypeMappings: { unitType: true } },
        { irradiations: [{ units: { type: true } }, { irradiator: true }] }
    ];

    constructor(
        private el: ElementRef,
        private appMessages: AppMessagesService,
        private orderService: OrderService,
        private messageService: MessageService,
        private sessionService: SessionService,
        private router: Router,
        private modalService: NgbModal,
        private route: ActivatedRoute) {

        this.sessionService.events.subscribe(sessionEvent => {
            this.user = sessionEvent.user
        })
    }

    ngOnInit() {


        this.orderService.findStatuses()
            .subscribe(
                (statuses: OrderStatus[]) => this.statuses = statuses
            );


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

    }

    handleErr(err) {

        this.isLoading = false;
        this.messageService.sendMessage({
            type: MessageType.DANGER,
            persist: false,
            text: err.message
        })

    }

    acceptOrder() {

        this.nextStatus =
            this.statuses.filter((status) => status.name === "EN_PROCESO")[0];

        this.orderService.markOrderAsAcceptedBy(this.order.id, this.nextStatus, this.user.id)
            .pipe(
                tap(order => console.log(order)),
                flatMap(order => this.orderService.findById(order.id, { include: this.orderIncludes }))
            )
            .subscribe(
                (order) => {

                    this.order = order
                    this.messageService.sendMessage({
                        type: MessageType.SUCCESS,
                        persist: true,
                        text: "La operación se realizó correctamente. La orden ya puede comenzar a ser irradiada"
                    })

                    this.router.navigateByUrl(`/operadores/ordenes/${this.order.id}/irradiación`);

                },
                err => {

                    this.messageService.sendMessage({
                        type: MessageType.DANGER,
                        persist: false,
                        text: `Error al intentar modificar la orden. ${err.message}`
                    })
                }

            );

    }

    rejectOrder() {

        this.nextStatus =
            this.statuses.filter((status) => status.name === "RECHAZADA")[0];

        fromPromise(this.modalService.open(ConfirmModalComponent, { size: "lg" }).result)
            .subscribe(
                (comment) => zip(
                    this.orderService.markOrderAs(this.order.id, this.nextStatus),
                    this.orderService.addConciliationComment(this.order.id, {
                        operatorId: this.user.id,
                        comment: comment,
                        date: new Date()
                    })
                )
                    .pipe(flatMap(([order, comment]) => this.orderService.findById(order.id, { include: this.orderIncludes })))
                    .subscribe(
                        order => {
                            this.order = order
                            this.messageService.sendMessage({
                                type: MessageType.SUCCESS,
                                persist: false,
                                text: "La operación se realizó exitosamente. La orden permanecerá rechazada hasta la próxima revisión del cliente."
                            })

                        },
                        err => this.messageService.sendMessage({
                            type: MessageType.DANGER,
                            persist: false,
                            text: `Error al intentar modificar la orden. ${err.message}`
                        })
                    ),
                (err) => { console.log("Operación cancelada por el usuario") }

            )

    }


    editOrder() {

        this.router.navigateByUrl(`/operadores/ordenes/${this.order.id}/editar`)

    }

    get hasOrder() {

        return !!this.order;


    }

    get canModify() {

        return this.order.status.name === "PENDIENTE" // isPending 

    }


    onPrint() {

        this.appMessages.printStarted()
        this.isPrinting = true;

        this.isPreparing = true;
        timer(500)
            .subscribe(() => {

                this.isPreparing = false;
                timer(250).subscribe(() => {
                    window.print()
                })


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
