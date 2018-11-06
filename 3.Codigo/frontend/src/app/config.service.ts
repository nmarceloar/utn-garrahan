import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from "./../environments/environment";
import { map } from 'rxjs/operators';

export interface ConfigElement {
    name: string,
    value: string,
    description: string
}

@Injectable({ providedIn: "root" })
export class ConfigService {

    constructor(private http: HttpClient) { }

    public findAll() {

        return this.http.get<ConfigElement[]>(`${environment.api.config}`)

    }

    public updateByName(name: string, config: ConfigElement) {

        return this.http.put<ConfigElement>(`${environment.api.config}/${name}`, config);

    }

    public updateAll(elems: ConfigElement[]) {

        return this.http.put(`${environment.api.config}`, elems);

    }


}


