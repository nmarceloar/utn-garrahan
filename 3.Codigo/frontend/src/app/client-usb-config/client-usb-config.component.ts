import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-client-usb-config',
    templateUrl: './client-usb-config.component.html',
    styleUrls: ['./client-usb-config.component.css']
})
export class ClientUsbConfigComponent implements OnInit {

    invalidCharCount: FormControl = new FormControl(0, [Validators.required, Validators.pattern(/^[0-9]{1}$/)]);
    sumbitted: boolean = false;

    constructor(private activeModal: NgbActiveModal) { }

    ngOnInit() { }

    confirm() {

        if (!this.invalidCharCount.valid)
            return

        this.activeModal.close(+this.invalidCharCount.value);

    }

    cancel() {

        this.activeModal.dismiss();

    }



}
