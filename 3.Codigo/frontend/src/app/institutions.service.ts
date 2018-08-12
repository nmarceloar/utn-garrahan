import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "./../environments/environment";

export interface Institution {

    id?: number
    name: string
    email: string
    address: string
    [key: string]: any

}

@Injectable()
export class InstitutionsService {

    constructor(private http: HttpClient) { }

    find() {

        return this.http.get<Institution[]>(environment.api.institutions)

    }

}
