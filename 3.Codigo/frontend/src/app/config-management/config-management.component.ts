import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditConfigModalComponent } from '../edit-config-modal/edit-config-modal.component';
import { from } from 'rxjs';

@Component({
    selector: 'app-config-management',
    templateUrl: './config-management.component.html',
    styleUrls: ['./config-management.component.css']
})
export class ConfigManagementComponent implements OnInit {

    config: {}[] = [];

    constructor(
        private configService: ConfigService,
        private modalService: NgbModal) { }

    ngOnInit() {

        this.configService.findAll()
            .subscribe(c => this.setConfig(c), err => console.error(err))

    }

    private setConfig(c) {

        this.config = c

    }

    openModal(configElem) {

        let d: NgbModalRef = this.modalService.open(EditConfigModalComponent, { size: "lg" });
        d.componentInstance.setConfigElem(configElem);

        from(d.result)
            .subscribe(() => this.ngOnInit(), () => { });


    }

}
