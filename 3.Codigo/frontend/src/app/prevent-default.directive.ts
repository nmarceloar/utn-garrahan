import { Directive, HostListener } from '@angular/core';
import { Event } from '@angular/router';

@Directive({
    selector: '[appPreventDefault]'

})
export class PreventDefaultDirective {

    constructor() { }

    @HostListener("keydown.tab", ["$event"])
    preventTab($event) {

        event.preventDefault();

    }



}
