import { Directive, ElementRef, Input, OnChanges, Renderer, SimpleChanges } from '@angular/core';

@Directive({
	selector: '[focused]'
})
export class AutofocusDirective implements OnChanges {

	@Input()
	focused: any; 

	constructor(private element: ElementRef) { }

	ngOnChanges(data: SimpleChanges) {

		console.log(data)

		if (this.focused.should)
			this.element.nativeElement.focus()

	}


}
