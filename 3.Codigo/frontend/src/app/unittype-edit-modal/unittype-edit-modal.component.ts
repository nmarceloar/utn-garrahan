import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../config.service';
import { UnitTypeService } from '../unit-type.service';

@Component({
    selector: 'app-unittype-edit-modal',
    templateUrl: './unittype-edit-modal.component.html',
    styleUrls: ['./unittype-edit-modal.component.css']
})
export class UnittypeEditModalComponent implements OnInit {

    unitTypeForm: FormGroup = new FormGroup({
        id: new FormControl({ value: "", disabled: true }),
        code: new FormControl({ value: "", disabled: true }),
        name: new FormControl({ value: "", disabled: false }, [Validators.required, Validators.minLength(5)])
    });

    constructor(
        private activeModal: NgbActiveModal,
        private unitTypeService: UnitTypeService) { }

    ngOnInit() { }

    update() {

        this.unitTypeService.update(this.unitTypeForm.controls.id.value, this.unitTypeForm.value)
            .subscribe(() => {

                this.activeModal.close()

            }, (err) => {

                this.activeModal.dismiss()

            })

    }

    cancel() {

        this.activeModal.dismiss()

    }

    setUnitType(unitType) {


        this.unitTypeForm.setValue({
            id: unitType.id,
            code: unitType.code,
            name: unitType.name
        });

    }

}

