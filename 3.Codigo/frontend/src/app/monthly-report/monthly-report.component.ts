import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, MessageType } from '../message.service';

@Component({
    selector: 'app-monthly-report',
    templateUrl: './monthly-report.component.html',
    styleUrls: ['./monthly-report.component.css']
})
export class MonthlyReportComponent implements OnInit {

    report;
    isLoading = false;

    searchForm: FormGroup = new FormGroup({
        selectedDate: new FormControl(null, Validators.required)
    })

    constructor(
        private orderService: OrderService,
        private messageService: MessageService) { }

    ngOnInit() {

        var currentDate = new Date()
        this.searchForm.setValue({
            selectedDate: currentDate.toISOString().split("T")[0].split("-").filter((item, idx) => idx < 2).join("-")
        })

        this.generateReport();

    }

    generateReport() {

        var date = new Date(this.searchForm.value.selectedDate.split("-").join("/")).toISOString();

        this.isLoading = true;
        this.orderService.monthlyReport(date)
            .subscribe(
                (report) => {
                    this.isLoading = false
                    this.report = report
                },
                (err) => {
                    this.isLoading = false
                    this.report = null
                    this.messageService.sendMessage({
                        persist: false,
                        type: MessageType.DANGER,
                        text: `Error al intentar generar el informe: ${err.message}`,
                        ttlInSeconds: 5
                    })
                })

    }

    printReport() {

        window.print();

    }

    get hasReport() {

        return !!this.report

    }

}
