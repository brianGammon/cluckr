import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent {
  @Output()
  showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  showModal = true;

  @Input()
  imageUrl: string;

  constructor() {
  }

  @HostListener('click', ['$event.target']) onClick(element: Element) {
    if (element.className.indexOf('modal-background') !== -1) {
      this.toggleModal();
    }
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const escapeKey = 27;
    if (event.keyCode === escapeKey) {
      this.toggleModal();
    }
  }

  toggleModal() {
    this.showModal = !this.showModal;
    this.showModalChange.emit(this.showModal);
  }
}
