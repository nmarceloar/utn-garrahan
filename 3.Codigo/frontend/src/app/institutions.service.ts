import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "./../environments/environment";
import { Query } from "./operator/operator.component";

export interface Institution {

    id?: number
    name: string
    email: string
    address: string
    cuit: string
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


    create(institution: Institution): Observable<Institution> {

        return this.http.post<Institution>(`${environment.api.institutions}`, institution)

    }

    findById(id, q = {}): Observable<Institution> {

        return this.http.get<Institution>(`${environment.api.institutions}/${id}?filter=${JSON.stringify(q)}`)

    }




    find(q: Query = {}) {

        return this.http.get<Institution[]>(`${environment.api.institutions}?filter=${JSON.stringify(q)}`)

    }

    findTypes(q: Query = {}) {

        return this.http.get<InstitutionType[]>(`${environment.api.institutionTypes}?filter=${JSON.stringify(q)}`)

    }

    update(id, i): Observable<Institution> {

        return this.http.put<Institution>(`${environment.api.institutions}/${id}`, i)

    }

}
