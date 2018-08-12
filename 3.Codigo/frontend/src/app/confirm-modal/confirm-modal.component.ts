
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit, OnDestroy {

    hasError: boolean = false;

    form: FormGroup = new FormGroup({
        comment: new FormControl("", [Validators.required, Validators.minLength(20)])
    })

    constructor(private activeModal: NgbActiveModal) { }

    ngOnInit() { }

    ngOnDestroy() { }

    accept() {

        if (this.form.invalid) {
            this.hasError = true;
            return;
        }

        this.activeModal.close(this.form.value.comment);

    }

    reject() {

        this.activeModal.dismiss();

    }

}
