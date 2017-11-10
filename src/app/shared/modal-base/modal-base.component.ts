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
    this.stopBodyScrolling(true);
  }

  close() {
    this.showModal = false;
    this.renderer.removeClass(document.documentElement, 'modal-open');
    this.stopBodyScrolling(false);
  }

  // https://benfrain.com/preventing-body-scroll-for-modals-in-ios/
  private stopBodyScrolling(bool) {
    if (bool === true) {
        document.body.addEventListener('touchmove', this.freezeVp, false);
    } else {
        document.body.removeEventListener('touchmove', this.freezeVp, false);
    }
  }

  private freezeVp(e) {
    e.preventDefault();
  }
}
