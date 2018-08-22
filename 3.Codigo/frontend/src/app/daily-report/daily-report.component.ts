import { Component, OnInit, HostListener } from '@angular/core';
import { OrderService } from '../order.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MessageService, MessageType } from '../message.service';
import { getLocaleDateTimeFormat } from '@angular/common';

@Component({
    selector: 'app-daily-report',
    templateUrl: './daily-report.component.html',
    styleUrls: ['./daily-report.component.css']
})
export class DailyReportComponent implements OnInit {

    report: {}

    isLoading: boolean = false;

    searchForm: FormGroup = new FormGroup({
        selectedDate: new FormControl("", Validators.required)
    })

    constructor(
        private orderService: OrderService,
        private messageService: MessageService) { }

    ngOnInit() {

        const [month, date, year] = (new Date()).toLocaleString().split(",")[0].split("/");

        this.searchForm.setValue({
            selectedDate: [year, month.padStart(2, '0'), date.padStart(2, '0')].join("-")
        })

        this.generateReport();

    }

    generateReport() {

        let date = new Date(this.searchForm.value.selectedDate.split("-").join("/")).toISOString()

        this.isLoading = true
        this.orderService.dailyReport(date)
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
        window.print()
    }

    @HostListener("window:beforeprint")
    hideUI() {

        console.log("before")

    }

    @HostListener("window:afterprint")
    restoreUI() {

        console.log("after")
    }

    get hasReport() {

        return !!this.report

    }


}


