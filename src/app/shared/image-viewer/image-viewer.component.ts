// tslint:disable:no-access-missing-member
import { Component, Inject, Input, Output, EventEmitter, HostListener, Renderer2 } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';

@Component({
  selector: 'image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent extends ModalBaseComponent {
  @Input()
  imageUrl: string;

  constructor(
    @Inject(Renderer2) renderer: Renderer2
  ) {
    super(renderer);
  }
}
