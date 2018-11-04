import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
    selector: 'app-config-management',
    templateUrl: './config-management.component.html',
    styleUrls: ['./config-management.component.css']
})
export class ConfigManagementComponent implements OnInit {

    config: {}[] = [];

    constructor(private configService: ConfigService) { }

    ngOnInit() {

        this.configService.load()
            .subscribe(c => this.setConfig(c), err => console.error(err))

    }

    private setConfig(c) {

        this.config = c

    }

}
