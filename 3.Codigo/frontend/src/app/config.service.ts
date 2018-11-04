import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from "./../environments/environment";
import { map } from 'rxjs/operators';



@Injectable({ providedIn: "root" })
export class ConfigService {

    constructor(private http: HttpClient) { }

    public load() {

        return this.http.get<{}[]>(`${environment.api.config}`)

    }


}


