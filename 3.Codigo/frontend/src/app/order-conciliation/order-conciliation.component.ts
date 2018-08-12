import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { OrderService, Order, OrderStatus } from '../order.service';
import { MessageService, MessageType } from '../message.service';
import { interval, from as fromPromise, zip, throwError } from 'rxjs';
import { take, switchMap, map, tap, finalize, flatMap, catchError } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { User, SessionService } from '../session.service';

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
                        text: "La operación se realizó correctamente. La orden ya puede comenzar a ser irradiada"
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

    rejectOrder() {

        this.nextStatus =
            this.statuses.filter((status) => status.name === "RECHAZADA")[0];

        fromPromise(this.modalService.open(ConfirmModalComponent, { size: "lg" }).result)
            .pipe(
                catchError(() => throwError({
                    message: "Operación cancelada por el usuario"
                })),
                flatMap((comment) => zip(
                    this.orderService.markOrderAs(this.order.id, this.nextStatus),
                    this.orderService.addConciliationComment(this.order.id, {
                        operatorId: this.user.id,
                        comment: comment,
                        date: new Date()
                    })
                )),
                flatMap(([order, comment]) => this.orderService.findById(order.id, { include: this.orderIncludes }))
            )
            .subscribe(
                order => this.order = order,
                err => this.messageService.sendMessage({
                    type: MessageType.WARNING,
                    persist: false,
                    text: err.message
                })
            )




    }

    get hasOrder() {

        return !!this.order;


    }


    get canModify() {

        return this.order.status.name === "PENDIENTE" // isPending 

    }


}
