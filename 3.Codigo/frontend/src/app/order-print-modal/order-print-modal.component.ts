import { Component, OnInit, ElementRef } from '@angular/core';

import * as jsPDF from "jspdf"

@Component({
    selector: 'app-order-print-modal',
    templateUrl: './order-print-modal.component.html',
    styleUrls: ['./order-print-modal.component.css']
})
export class OrderPrintModalComponent implements OnInit {

    constructor(private el: ElementRef) { }

    ngOnInit() { }

    print() {

        let pdf = new jsPDF();

        pdf.fromHTML(this.el.nativeElement.innerHTML)

        pdf.save("boom.pdf");

    }



}
