import { Component, OnInit } from '@angular/core';
import { OrderService, UnitType } from '../order.service';
import { MessageService } from '../message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditHemocomponentModalComponent } from '../edit-hemocomponent-modal/edit-hemocomponent-modal.component';
import { from } from 'rxjs';

@Component({
    selector: 'app-hemocomponents',
    templateUrl: './hemocomponents.component.html',
    styleUrls: ['./hemocomponents.component.css']
})
export class HemocomponentsComponent implements OnInit {

    unitTypes: UnitType[]

    constructor(
        private orderService: OrderService,
        private modalService: NgbModal,
        private messageService: MessageService) { }

    ngOnInit() {

        this.orderService.findUnitTypes()
            .subscribe(types => this.unitTypes = types, err => this.messageService.error(err.message))

    }

    enable(unitType) { }

    disable(unitType) {

        this.showConfirmationModal().subscribe();

    }

    private showConfirmationModal() {

        let m = this.modalService.open(EditHemocomponentModalComponent);
        return from(m.result);

    }

}
