import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { config } from 'rxjs';

@Component({
    selector: 'app-edit-config-modal',
    templateUrl: './edit-config-modal.component.html',
    styleUrls: ['./edit-config-modal.component.css']
})
export class EditConfigModalComponent implements OnInit {

    configElem: FormGroup

    constructor(
        private activeModal: NgbActiveModal,
        private configService: ConfigService) { }

    ngOnInit() { }

    update() {

        this.configService.updateByName(
            this.configElem.controls.name.value,
            this.configElem.value
        ).subscribe(() => {

            this.activeModal.close();

        }, (err) => {

            this.activeModal.dismiss()

        })

    }

    cancel() {

        this.activeModal.dismiss();

    }

    setConfigElem(configElem) {

        this.configElem = new FormGroup({
            name: new FormControl({
                value: configElem.name, disabled: true
            }),
            value: new FormControl({ value: +configElem.value, disabled: false },
                [
                    Validators.required,
                    configElem.isInteger ? Validators.pattern(/^[0-9]+$/) : Validators.pattern(/^[0-9](\.[0-9]+)?$/),
                    Validators.min(+configElem.min),
                    Validators.max(+configElem.max),
                ]
            ),
            description: new FormControl({ value: configElem.description, disabled: false })
        })

        console.log(this.configElem)

    }

}
