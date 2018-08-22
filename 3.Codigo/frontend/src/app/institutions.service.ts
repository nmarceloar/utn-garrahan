import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "./../environments/environment";
import { Query } from "./operator/operator.component";

export interface Institution {

    id?: number
    name: string
    email: string
    address: string
    [key: string]: any

}

export interface InstitutionType {

    id?: number
    name: string
    description: string

}


@Injectable()
export class InstitutionsService {

    constructor(private http: HttpClient) { }

    find(q: Query = {}) {

        return this.http.get<Institution[]>(`${environment.api.institutions}?filter=${JSON.stringify(q)}`)

    }

    findTypes(q: Query = {}) {

        return this.http.get<InstitutionType[]>(`${environment.api.institutionTypes}?filter=${JSON.stringify(q)}`)

    }

}
