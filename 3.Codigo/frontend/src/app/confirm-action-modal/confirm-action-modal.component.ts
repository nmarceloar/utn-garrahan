import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-action-modal',
    templateUrl: './confirm-action-modal.component.html',
    styleUrls: ['./confirm-action-modal.component.css']
})
export class ConfirmActionModalComponent implements OnInit {

    title: string
    message: string

    constructor(private activeModal: NgbActiveModal) { }

    ngOnInit() {
    }

    confirm() {
        this.activeModal.close();
    }

    dismiss() {
        this.activeModal.dismiss();
    }

}
