import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from "./../environments/environment";

@Injectable()
export class UnitTypeService {

    constructor(private http: HttpClient) { }

    public update(id, unitType) {

        return this.http.put(`${environment.api.unitTypes}/${id}`, unitType);

    }

}
