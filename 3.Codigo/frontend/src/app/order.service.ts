import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "./../environments/environment";
import { Query } from './operator/operator.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface UnitType {
    id?
    code?
    name?
    creation_date?
}


export interface Unit {

    id?
    code
    irradiated
    creationDate

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

    asPdf(orderId: number) {

        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');

        return this.http.get(`${environment.api.orders}/${orderId}/pdf`, { headers: headers, responseType: 'blob' })

    }

    findById(orderId: number, q: Query) {

        return this.http.get<Order>(`${environment.api.orders}/${orderId}?filter=${JSON.stringify(q)}`)

    }

    markOrderAs(orderId: number, status: OrderStatus): Observable<Order> {

        return this.http.patch<Order>(`${environment.api.orders}/${orderId}`, {
            statusId: status.name
        })

    }

    markOrderAsAcceptedBy(orderId: number, status: OrderStatus, operatorId: number): Observable<Order> {

        return this.http.patch<Order>(`${environment.api.orders}/${orderId}`, {
            statusId: status.name,
            operatorId: operatorId,
            acceptedOn: new Date().toISOString()
        })

    }


    addIrradiation(orderId: number, irradiation: any) {

        return this.http.post(`${environment.api.orders}/${orderId}/irradiations`, irradiation);

    }

    addConciliationComment(orderId: number, { operatorId, comment, date }) {

        return this.http.post(`${environment.api.orders}/${orderId}/conciliationComments`, {
            operatorId: operatorId,
            comment: comment
        })

    }


    findStatuses() {

        return this.http.get<OrderStatus[]>(`${environment.api.orderStatus}`)

    }

    findPriorities() {

        return this.http.get<OrderPriority[]>(`${environment.api.orderPriorities}`);

    }

    findUnitTypes() {

        return this.http.get<UnitType[]>(`${environment.api.unitTypes}`);

    }

    createOrder(order: Order) {

        return this.http.post<Order>(`${environment.api.orders}`, order)

    }

    updateWithUnits(orderId: number, order: Order) {

        return this.http.put<Order>(`${environment.api.orders}/update/${orderId}`, order)

    }

    dailyReport(date: string) {

        let d = this.http.get(`${environment.api.dailyReport}?date=${date}`);
        let c = d.pipe(map((reportData: any) => ({
            date: reportData.date,
            orders: reportData.orders.map(order => ({
                ...order,
                unitTypeMappings: order.unitTypeMappings.map(utm => ({
                    ...utm,
                    billing: Math.ceil(utm.count / utm.unitType.billingDivider)
                }))
            })),
            orderCount: reportData.orders.length,
            orderCountPerInstitutionType: reportData.institutionTypes.map(it => ({
                it: it,
                count: reportData.orders.filter(o => o.institution.type.name === it.name).length
            }))
        })));

        return c;

    }

    monthlyReport(date: string) {

        return this.http.get(`${environment.api.monthlyReport}?date=${date}`)
            .pipe(map((reportData: any) => ({
                ...reportData,
                unitCount: reportData.orders.reduce((unitCount, order) => unitCount + order.unitCount, 0),
                unitCountMappings: reportData.unitTypes.map((ut) => ({
                    unitType: ut,
                    unitCount:
                        reportData.orders
                            .map(o => o.unitTypeMappings)
                            .map(utms => (utms.filter(utm => utm.unitType.code === ut.code))[0])
                            .reduce((unitCount, item) => unitCount + item.count, 0)
                })),
                mappingsPerInstitution: reportData.institutions.map((i) => ({
                    institution: i,
                    unitCount:
                        reportData.orders
                            .filter(o => o.institution.id === i.id)
                            .reduce((unitCount, order) => unitCount + order.unitCount, 0),
                    unitCountBefore19Hs:
                        reportData.orders
                            .filter(o => o.institution.id === i.id)
                            .map(order => order.irradiations.filter(i => new Date(i.irradiationStart).getHours() < 19)
                                .reduce((count, i) => count + i.units.length, 0))
                            .reduce((sum, item) => sum + item, 0),
                    unitCountAfter19Hs:
                        reportData.orders
                            .filter(o => o.institution.id === i.id)
                            .map(order => order.irradiations.filter(i => new Date(i.irradiationStart).getHours() >= 19)
                                .reduce((count, i) => count + i.units.length, 0))
                            .reduce((sum, item) => sum + item, 0),
                    unitCountPerUnitTypeMappings:
                        reportData.unitTypes.map((ut) => ({
                            unitType: ut,
                            unitCountBefore19Hs:
                                reportData.orders
                                    .filter(o => o.institution.id === i.id)
                                    .map(o => o.irradiations
                                        .filter(i => new Date(i.irradiationStart).getHours() < 19)
                                        .reduce((units, i) => [...units, ...i.units], [])
                                        .filter(u => u.type.code === ut.code)
                                        .length
                                    )
                                    .reduce((sum, i) => sum + i, 0),
                            unitCountAfter19Hs:
                                reportData.orders
                                    .filter(o => o.institution.id === i.id)
                                    .map(o => o.irradiations
                                        .filter(i => new Date(i.irradiationStart).getHours() >= 19)
                                        .reduce((units, i) => [...units, ...i.units], [])
                                        .filter(u => u.type.code === ut.code)
                                        .length
                                    )
                                    .reduce((sum, i) => sum + i, 0)

                        }))
                })),
                mappingsPerInstitutionType: reportData.institutionTypes.map((it) => ({
                    institutionType: it,
                    unitCount:
                        reportData.orders.filter(o => o.institution.type.name === it.name)
                            .reduce((unitCount, order) => unitCount + order.unitCount, 0),
                    unitCountBefore19Hs:
                        reportData.orders
                            .filter(o => o.institution.type.name === it.name)
                            .map(order => order.irradiations.filter(i => new Date(i.irradiationStart).getHours() < 19)
                                .reduce((count, i) => count + i.units.length, 0))
                            .reduce((sum, item) => sum + item, 0),
                    unitCountAfter19Hs:
                        reportData.orders
                            .filter(o => o.institution.type.name === it.name)
                            .map(order => order.irradiations.filter(i => new Date(i.irradiationStart).getHours() >= 19)
                                .reduce((count, i) => count + i.units.length, 0))
                            .reduce((sum, item) => sum + item, 0),
                    unitCountPerUnitTypeMappings:
                        reportData.unitTypes.map((ut) => ({
                            unitType: ut,
                            unitCountBefore19Hs:
                                reportData.orders
                                    .filter(o => o.institution.type.name === it.name)
                                    .map(o => o.irradiations
                                        .filter(i => new Date(i.irradiationStart).getHours() < 19)
                                        .reduce((units, i) => [...units, ...i.units], [])
                                        .filter(u => u.type.code === ut.code)
                                        .length
                                    )
                                    .reduce((sum, i) => sum + i, 0),
                            unitCountAfter19Hs:
                                reportData.orders
                                    .filter(o => o.institution.type.name === it.name)
                                    .map(o => o.irradiations
                                        .filter(i => new Date(i.irradiationStart).getHours() >= 19)
                                        .reduce((units, i) => [...units, ...i.units], [])
                                        .filter(u => u.type.code === ut.code)
                                        .length
                                    )
                                    .reduce((sum, i) => sum + i, 0)

                        }))
                }))

            })))


    }

}
