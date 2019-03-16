import { Component, OnInit } from '@angular/core';
import { ConfigService, Config } from '../config.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditConfigModalComponent } from '../edit-config-modal/edit-config-modal.component';
import { from } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from '../message.service';

@Component({
    selector: 'app-config-management',
    templateUrl: './config-management.component.html',
    styleUrls: ['./config-management.component.css']
})
export class ConfigManagementComponent implements OnInit {

    config: Config

    configForm: FormGroup = new FormGroup({
        minTimeOfIrradiationInMinutes: new FormControl(0, [Validators.required, Validators.pattern(/^[0-9](\.[0-9]+)?$/)])
    })

    submited: boolean = false

    constructor(
        private messageService: MessageService,
        private configService: ConfigService,
        private modalService: NgbModal) { }

    ngOnInit() {

        this.configService.get()
            .subscribe(c => this.setConfig(c), err => this.messageService.error(err.message))

    }

    private setConfig(c) {

        console.log(this.configForm.value)

        this.config = c;
        this.configForm.patchValue(c, { emitEvent: false });

        console.log(this.configForm.value)

    }

    updateConfig() {

        if (this.configForm.invalid) {
            this.submited = true;
            return;
        }

        this.configService.update(this.configForm.value)
            .subscribe(
                data => {
                    this.setConfig(data)
                    this.messageService.success(`La configuración se actualizó correctamente`)
                },
                err => this.messageService.error(err.message))

    }

    openModal(configElem) {

        let d: NgbModalRef = this.modalService.open(EditConfigModalComponent, { size: "lg" });
        d.componentInstance.setConfigElem(configElem);

        from(d.result)
            .subscribe(() => this.ngOnInit(), () => { });


    }

}
