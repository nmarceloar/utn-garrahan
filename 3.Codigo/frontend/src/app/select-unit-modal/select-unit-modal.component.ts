import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-select-unit-modal',
    templateUrl: './select-unit-modal.component.html',
    styleUrls: ['./select-unit-modal.component.css']
})
export class SelectUnitModalComponent implements OnInit {

    units: any[]

    constructor(private activeModal: NgbActiveModal) { }

    ngOnInit() { }

    select(unit) {

        this.activeModal.close(unit);

    }

}
