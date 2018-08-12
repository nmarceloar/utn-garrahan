import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "./../environments/environment";
import { Query } from './operator/operator.component';
import { Observable } from 'rxjs';


export interface Unit {

    id?
    code
    irradiationTag?
    irradiated?
    irradiationStart?
    irradiationEnd?
    creationDate?

}

export interface Order {
    id?
    code
    statusId?
    status?
    carrier?
    institutionId?
    ownerId
    creationDate?
    priorityId
    units?
}

export interface OrderStatus {
    id?
    name: string
    description: string
}

export interface OrderPriority {

    id?: number
    name: string
    description: string

}

export interface Page<T> {

    count: number
    items: T[]

}

@Injectable()
export class OrderService {

    constructor(private http: HttpClient) { }

    find(q: Query) {

        return this.http.get<Page<Order>>(`${environment.api.orders}/page?filter=${JSON.stringify(q)}`)

    }

    findById(orderId: number, q: Query) {

        return this.http.get<Order>(`${environment.api.orders}/${orderId}?filter=${JSON.stringify(q)}`)

    }

    markOrderAs(orderId: number, status: OrderStatus): Observable<Order> {

        return this.http.patch<Order>(`${environment.api.orders}/${orderId}`, {
            statusId: status.name
        })

    }

    markUnitsAsIrradiated(orderId: number, units: Unit[]) {

        return this.http.put(`${environment.api.orders}/${orderId}/units/irradiated`, {units: units}); 

    }

    addConciliationComment(orderId: number, { operatorId, comment, date }) {

        return this.http.post(`${environment.api.orders}/${orderId}/conciliationComments`, {
            operatorId: operatorId,
            comment: comment
        })

    }


    findStatuses() {

        return this.http.get(`${environment.api.orderStatus}`)

    }

    findPriorities() {

        return this.http.get(`${environment.api.orderPriorities}`)

    }

}

