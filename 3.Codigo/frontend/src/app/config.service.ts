import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from "./../environments/environment";



@Injectable({ providedIn: "root" })
export class ConfigService {

    constructor(private http: HttpClient) { }

    public load() {

        return this.http.get<{}[]>(`${environment.api.config}`);

    }

    public update(config: {}[]) {

        return this.http.put<{}[]>(`${environment.api.config}`, config);

    }

}


