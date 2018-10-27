import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-cancel-confirmation-modal',
    templateUrl: './cancel-confirmation-modal.component.html',
    styleUrls: ['./cancel-confirmation-modal.component.css']
})
export class CancelConfirmationModalComponent implements OnInit {

    isWaitingForComments = false;
    isConfirmed = false;

    submitted = false;

    comments: FormControl = new FormControl("", Validators.required);

    constructor(private activeModal: NgbActiveModal) { }

    ngOnInit() { }

    close() {

        if (!this.comments.valid) {

            this.submitted = true;
            return;

        }

        this.activeModal.close(this.comments.value);

    }

    dismiss() {

        this.activeModal.dismiss()

    }

    confirm() {

        this.isWaitingForComments = true;
        this.isConfirmed = true;

    }

}
