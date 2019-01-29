import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { InstitutionsService, InstitutionType } from '../institutions.service';
import { MessageService, MessageType } from '../message.service';
import { Location } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { ConfirmActionModalComponent } from '../confirm-action-modal/confirm-action-modal.component';

@Component({
    selector: 'app-create-institution',
    templateUrl: './create-institution.component.html',
    styleUrls: ['./create-institution.component.css']
})
export class CreateInstitutionComponent implements OnInit {

    types: InstitutionType[] = []

    form: FormGroup = new FormGroup({
        name: new FormControl("", Validators.required),
        address: new FormControl("", Validators.required),
        cuit: new FormControl("", [
            Validators.required,
            Validators.pattern(/^(30|33|34)(\-)[0-9]{8}(\-)[0-9]{1}$/),
            cuitValidator()
        ]),
        email: new FormControl("", [Validators.required, Validators.email]),
        type: new FormControl(null, Validators.required),
        invalidCharCount: new FormControl(0, [Validators.required, Validators.pattern(/^[0-9]{1}$/)])

    })

    submitted: boolean = false;

    constructor(
        private institutionService: InstitutionsService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private locationService: Location) { }

    ngOnInit() {


        this.institutionService.findTypes()
            .subscribe(
                types => this.types = types,
                err => this.handleError(err)
            )


    }

    create() {

        if (this.form.invalid) {
            this.submitted = true;
            return;
        }

        this.showConfirmActionModal()
            .subscribe(() => {

                this.institutionService.create({
                    ...this.form.value,
                    cuit: this.form.controls.cuit.value.split("-").join(""),
                    typeId: (this.form.controls.type as any).name
                }).subscribe((i) => this.onSuccess(i), (err) => this.handleError(err))

            }, () => { })


    }

    private showConfirmActionModal() {

        let modal: NgbModalRef = this.modalService.open(ConfirmActionModalComponent, { size: "lg" });
        modal.componentInstance.title = `Confirmar alta de institución`
        modal.componentInstance.message = `Está seguro que desea realizar el alta de la institución ${this.form.controls.name.value}?`

        return from(modal.result);


    }

    handleError(err) {

        this.messageService.sendMessage({
            text: err.message,
            type: MessageType.DANGER,
            ttlInSeconds: 8,
            persist: false
        })


    }

    onSuccess(i) {

        this.messageService.sendMessage({
            text: "La operación se realizó correctamente",
            type: MessageType.SUCCESS,
            persist: true,
            ttlInSeconds: 8
        })

        this.locationService.back()

    }

    cancel() {

        this.locationService.back()

    }

}

function cuitValidator(): ValidatorFn {

    return (cuitControl: AbstractControl): { [key: string]: any } | null => {

        let cuit = cuitControl.value.split("-").join("")

        if (cuit.length !== 11) {
            return null;
        }

        var digitos = cuit.split("");

        var digito = digitos.pop();

        var acumulado = 0;
        for (var i = 0; i < digitos.length; i++) {
            acumulado += digitos[9 - i] * (2 + (i % 6));
        }

        var verif = 11 - (acumulado % 11);
        if (verif == 11) {
            verif = 0;
        }

        var valid = digito == verif

        return valid ? null : {
            "cuit": { value: cuit }
        }

    };
}
