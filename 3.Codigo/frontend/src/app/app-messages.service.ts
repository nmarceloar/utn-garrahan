import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppMessagesService {

    private isPrintingSubject: Subject<boolean> = new Subject<boolean>();

    constructor() { }


    get isPrinting() {

        return this.isPrintingSubject.asObservable()

    }

    printStarted() {

        this.isPrintingSubject.next(true)

    }

    printEnded() {

        this.isPrintingSubject.next(false)

    }


}
