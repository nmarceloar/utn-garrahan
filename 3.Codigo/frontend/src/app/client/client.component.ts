import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, merge, of, zip, Observable, Subscription, throwError } from "rxjs";
import { filter, map, startWith, switchMap, tap, pairwise, concatMap, partition, catchError, finalize } from 'rxjs/operators';
import { MessageService, MessageType } from '../message.service';
import { OrderService, Order, Page, OrderStatus, OrderPriority } from '../order.service';
import { InstitutionsService, Institution } from '../institutions.service';
import { Paging, Sorting, TableColumn, Query } from '../operator/operator.component';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit, OnDestroy {

    filtering: {};

    includes: {} = [
        { units: { type: true } },
        { status: true },
        { priority: true },
        { owner: true },
        { institution: true }
    ]

    paging: Paging
    sorting: Sorting

    pageSizes: number[] = [20, 30, 50]

    orders: Order[];
    orderCount = 0;

    institutions: Institution[]
    orderStatuses: OrderStatus[]
    orderPriorities: OrderPriority[]

    currentUser

    isLoading: boolean = false;

    searchForm: FormGroup = new FormGroup({
        id: new FormControl(),
        code: new FormControl(),
        statusId: new FormControl(),
        priorityId: new FormControl(),
        startDate: new FormControl(),
        endDate: new FormControl()
    })

    columns: TableColumn[] = [
        { name: "id", displayName: "ID", sortable: true },
        { name: "creationDate", displayName: "Creada", sortable: true },
        { name: "lastModified", displayName: "Modificada", sortable: true },
        { name: "code", displayName: "Código", sortable: true },
        { name: "ownerId", displayName: "Alta", sortable: true },
        { name: "carrier", displayName: "Transportista", sortable: true },
        { name: "statusId", displayName: "Estado", sortable: true },
        { name: "priorityId", displayName: "Prioridad", sortable: true },
        { name: "unitCount", displayName: "Unidades", sortable: true }
    ]

    constructor(
        private institutionService: InstitutionsService,
        private sessionService: SessionService,
        private router: Router,
        private orderService: OrderService,
        private messageService: MessageService) {

        this.sessionService.events.subscribe(s => {
            this.currentUser = s.user;
        })
    }


    ngOnInit(): void {

        let q = {

            where: { institutionId: this.currentUser.institutionId },
            skip: 0,
            limit: this.pageSizes[0],
            order: [`lastModified DESC`],
            include: this.includes

        };

        this.isLoading = true;
        zip(this.fetchData(), this.fetchOrders(q))
            .pipe(tap(() => this.isLoading = false, (err) => this.isLoading = false))
            .subscribe(
                (data: any) => {

                    this.institutions = data[0][0]
                    this.orderStatuses = data[0][1]
                    this.orderPriorities = data[0][2]

                    this.handleOrders(data[1][0], data[1][1])

                },
                (err) => {
                    this.handleErr(err)
                }
            )



    }

    private fetchData() {

        return zip(
            this.institutionService.find(),
            this.orderService.findStatuses(),
            this.orderService.findPriorities()
        );

    }

    private fetchOrders(q: Query) {

        return zip(of(q), this.orderService.find(q))

    }


    ngOnDestroy(): void { }

    where() {

        let fns = {

            id: (id) => ({ id: id }),
            code: (code) => ({ code: { regexp: `.*${code}.*` } }),
            priorityId: (id) => ({ priorityId: id }),
            statusId: (id) => ({ statusId: id }),
            startDate: (date) => ({
                or: [
                    { creationDate: new Date(date.split("-").join("/")).toISOString() },
                    { creationDate: { gt: new Date(date.split("-").join("/")).toISOString() } }
                ]
            }),
            endDate: (date) => ({
                or: [
                    { creationDate: new Date(date.split("-").join("/")).toISOString() },
                    { creationDate: { lt: new Date(date.split("-").join("/")).toISOString() } }
                ]
            })

        }

        let clauses = Object.entries(this.searchForm.value)
            .filter(([key, value]) => value)
            .map(([key, value]) => fns[key](value))
            .reduce((clauses, clause) => [...clauses, clause], [])

        let where = {
            and: [{ institutionId: this.currentUser.institutionId }, ...clauses]
        }

        return where;

    }


    handleOrders(query: Query, page: Page<Order>) {

        this.orderCount = page.count;
        this.orders = page.items;

        this.filtering = query.where;

        this.paging = {
            page: (query.skip / query.limit) + 1,
            pageSize: query.limit
        }

        let [name, direction] = query.order[0].split(' ')

        this.sorting = {
            name,
            direction
        }

    }



    handleErr(err) {

        this.messageService.sendMessage({
            type: MessageType.DANGER,
            persist: false,
            text: err.message
        })

    }


    search() {

        let query = {
            where: this.where(),
            skip: 0,
            limit: this.paging.pageSize,
            order: ["lastModified DESC"],
            include: this.includes
        }

        this.queryOrders(query);

    }



    private queryOrders(q: Query) {

        this.isLoading = true;
        this.fetchOrders(q)
            .pipe(tap(() => this.isLoading = false, (err) => this.isLoading = false))
            .subscribe(([q, orders]) => this.handleOrders(q, orders), (err) => this.handleErr(err));

    }

    changePage(page: number) {

        let query = {
            where: this.filtering,
            skip: (page - 1) * this.paging.pageSize,
            limit: this.paging.pageSize,
            order: [`${this.sorting.name} ${this.sorting.direction}`],
            include: this.includes
        }

        this.queryOrders(query);

    }

    changePageSize(pageSize: number) {

        let query = {
            where: this.filtering,
            skip: Math.floor((this.paging.page - 1) * this.paging.pageSize / pageSize) * pageSize,
            limit: pageSize,
            order: [`${this.sorting.name} ${this.sorting.direction}`],
            include: this.includes
        }

        this.queryOrders(query);

    }

    changeSorting({ name, direction }) {

        let query = {
            where: this.filtering,
            skip: 0,
            limit: this.paging.pageSize,
            order: [`${name} ${direction}`],
            include: this.includes
        }

        this.queryOrders(query);

    }

    createOrder() {

        this.router.navigate(["clientes", "ordenes", "alta"])

    }

}

