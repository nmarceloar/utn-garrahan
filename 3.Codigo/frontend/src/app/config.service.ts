import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from "./../environments/environment";
import { map } from 'rxjs/operators';

export interface Config {

    minTimeOfIrradiationInMinutes: number

}

@Injectable({ providedIn: "root" })
export class ConfigService {

    constructor(private http: HttpClient) { }

    public get() {

        return this.http.get<Config>(`${environment.api.config}`)

    }


    public update(config) {

        return this.http.put<Config>(`${environment.api.config}`, config);

    }


}


