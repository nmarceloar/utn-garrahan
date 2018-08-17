import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Unit, UnitType, OrderService } from '../order.service';
import { zip, from } from 'rxjs';
import { Location } from '@angular/common';
import { SessionService } from '../session.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitEditModalComponent } from '../unit-edit-modal/unit-edit-modal.component';
import { MessageService, MessageType } from '../message.service';

@Component({
    selector: 'app-create-order',
    templateUrl: './create-order.component.html',
    styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {

    isWaitingForUnit = { should: false }

    submited = false;
    orderSubmitted = false;

    started  = { should: true }

    currentUser

    private units: any[] = []
    
    currentDate = new Date()

    private unitTypeMappings: any[] = [];

    unitTypes: any[]
    orderPriorities: any[]

    isEditing: boolean = false;
    editing: any;

    selectedPriority: FormControl = new FormControl(null, Validators.required);
    selectedCarrier: FormControl = new FormControl(null, Validators.required);
    selectedOrderCode: FormControl = new FormControl(null, Validators.required);

    unitForm: FormGroup = new FormGroup({
        unitCode: new FormControl("", Validators.required),
        unitType: new FormControl(null, Validators.required)
    })

    constructor(
        private orderService: OrderService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private sessionService: SessionService,
        private locationService: Location, ) {

        this.sessionService.events.subscribe(s => {
            this.currentUser = s.user;
        })

    }

    ngOnInit() {

        zip(this.orderService.findUnitTypes(), this.orderService.findPriorities())
            .subscribe(([unitTypes, orderPriorities]) => {
                this.unitTypes = unitTypes
                this.orderPriorities = orderPriorities
            })


    }

    addUnit() {

        if (this.unitForm.invalid) {
            this.submited = true;
            return
        }

        if (this.units.findIndex(unit => unit.code === this.unitForm.value.unitCode) !== -1) {

            this.messageService.sendMessage({
                persist: false,
                type: MessageType.DANGER,
                text: "Ya existe una unidad con ese codigo",
                ttlInSeconds: 5
            })

            this.isWaitingForUnit = { should: true }

            return;
        }

        this.units.unshift({
            code: this.unitForm.value.unitCode,
            type: this.unitForm.value.unitType
        })

        this.updateMappings();

        this.unitForm.reset();
        this.submited = false;

        this.isWaitingForUnit = { should: true }

    }

    private updateMappings() {

        this.unitTypeMappings =
            this.unitTypes.map(ut => ({
                code: ut.code,
                count: this.units.filter(u => u.type.code === ut.code).length
            }));


    }

    removeUnit(unit) {

        this.units.splice(this.units.findIndex(u => u === unit), 1)
        this.updateMappings(); 

    }

    edit(unit) {

        let m = this.modalService.open(UnitEditModalComponent, { centered: true, size: "lg", backdrop: "static" })
        m.componentInstance.unitTypes = this.unitTypes
        m.componentInstance.unit = unit

        from(m.result).subscribe((data) => {

            let canReplace = (data.previous.code === data.actual.code) ||
                (this.units.findIndex(unit => unit.code === data.actual.code) === -1)

            if (canReplace) {

                let i = this.units.findIndex(u => u.code === data.previous.code)
                this.units.splice(i, 1)
                this.units.splice(i, 0, data.actual)

                this.updateMappings() 

            } else {

                this.messageService.sendMessage({
                    persist: false,
                    type: MessageType.DANGER,
                    text: "Ya existe una unidad con ese codigo",
                    ttlInSeconds: 5
                })


            }

            this.isWaitingForUnit = { should: true }

        }, () => { })

    }

    cancel() {

        this.locationService.back();

    }

    createOrder() {

        let valid =
            [this.selectedCarrier, this.selectedOrderCode, this.selectedPriority].every(d => d.valid) &&
            (this.units.length > 0)

        if (!valid) {
            this.orderSubmitted = true;
            return;
        }


        let order = {
            code: Math.random(),
            carrier: this.selectedCarrier.value,
            priorityId: this.selectedPriority.value.id,
            ownerId: this.currentUser.id,
            institutionId: this.currentUser.institution.id,
            units: this.units.map((u) => ({
                code: u.code,
                unitTypeId: u.type.id
            }))
        }

        this.orderService.createOrder(order)
            .subscribe(order => {                
            	    this.messageService.sendMessage({
                    persist: true,
                    type: MessageType.SUCCESS,
                    text: "La operacion se completo exitosamente. Los operadores ya tienen disponible su orden",
                    ttlInSeconds: 5})
                this.locationService.back();}
                ,(err)=>{
                	this.messageService.sendMessage({
		        persist: false,
		        type: MessageType.DANGER,
		        text: "Error al intentar grabar la orden. " + err.message,
                    ttlInSeconds: 5
                })
})
		

    }



}
