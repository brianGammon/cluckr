import { HostListener, Renderer2 } from '@angular/core';

export abstract class ModalBaseComponent {
  showModal = false;

  constructor(
    private renderer: Renderer2
  ) { }

  @HostListener('click', ['$event.target']) onClick(element: Element) {
    if (element.className.indexOf('modal-background') !== -1) {
      this.close();
    }
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const escapeKey = 27;
    if (this.showModal && event.keyCode === escapeKey) {
      this.close();
    }
  }

  open() {
    this.showModal = true;
    this.renderer.addClass(document.documentElement, 'modal-open');
  }

  close() {
    this.showModal = false;
    this.renderer.removeClass(document.documentElement, 'modal-open');
  }
}
