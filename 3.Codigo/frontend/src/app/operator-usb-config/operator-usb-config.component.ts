import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-operator-usb-config',
    templateUrl: './operator-usb-config.component.html',
    styleUrls: ['./operator-usb-config.component.css']
})
export class OperatorUsbConfigComponent implements OnInit {

    form: FormGroup = new FormGroup({
        tagInvalidCharCount: new FormControl(0, [Validators.required, Validators.pattern(/^[0-9]{1}$/)]),
        unitInvalidCharCount: new FormControl(0, [Validators.required, Validators.pattern(/^[0-9]{1}$/)])
    });

    constructor(private activeModal: NgbActiveModal) { }

    ngOnInit() {
    }

    confirm() {

        if (this.form.invalid) {
            return
        }

        this.activeModal.close(this.form.value)

    }

    cancel() {

        this.activeModal.dismiss()

    }

}
