import { Directive, ElementRef, Input, OnChanges, Renderer, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[focused]'
})
export class AutofocusDirective implements OnChanges {

    @Input()
    focused: boolean = false;

    constructor(private element: ElementRef) { }

    ngOnChanges(data: SimpleChanges) {

        if (this.focused)
            this.element.nativeElement.focus(); 

    }


}
