import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-unit-edit-modal',
    templateUrl: './unit-edit-modal.component.html',
    styleUrls: ['./unit-edit-modal.component.css']
})
export class UnitEditModalComponent implements OnInit {

    unit: any
    unitTypes: any

    previous: any

    submitted = false;

    unitForm: FormGroup = new FormGroup({
        code: new FormControl(null, Validators.required),
        type: new FormControl(null, Validators.required)
    })

    constructor(private activeModal: NgbActiveModal) { }


    ngOnInit() {

        this.previous = { ...this.unit }
        this.unitForm.setValue({
            code: this.unit.code,
            type: this.unitTypes.filter(t => t.code === this.unit.type.code)[0]
        });

    }

    confirm() {

        if (this.unitForm.invalid) {
            this.submitted = true
            return
        }

        this.activeModal.close({ previous: this.previous, actual: this.unitForm.value })

    }

    cancel() {

        this.activeModal.dismiss();

    }

}
