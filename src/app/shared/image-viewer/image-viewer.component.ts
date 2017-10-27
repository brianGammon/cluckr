import { Component, Input, Output, EventEmitter } from '@angular/core';

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

  toggleModal() {
    this.showModal = !this.showModal;
    this.showModalChange.emit(this.showModal);
  }
}
