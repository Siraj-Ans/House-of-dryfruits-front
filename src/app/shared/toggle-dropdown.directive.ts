import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropDownDirective]',
  standalone: true,
})
export class DropDownDirective {
  private isOpen = false;

  constructor(private el: ElementRef) {}

  @HostListener('click')
  toggle() {
    this.isOpen = !this.isOpen;
    this.el.nativeElement.style.display = this.isOpen ? 'block' : 'none';
  }
}
