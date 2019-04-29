import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective implements AfterViewInit {
  @Input() focus: boolean;

    constructor(private element: ElementRef) {}

    ngAfterViewInit() {
        if (this.focus) {
            this.element.nativeElement.focus();
        }
    }

}
