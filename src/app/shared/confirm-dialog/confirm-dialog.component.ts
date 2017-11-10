import { Component, Inject, HostListener, Renderer2 } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';

export class ConfirmDialogResult {
  result: Promise<boolean>;
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent extends ModalBaseComponent {
  showModal = false;
  private resolve: any;

  constructor(
    @Inject(Renderer2) renderer: Renderer2
  ) {
    super(renderer);
  }

  open(): ConfirmDialogResult {
    super.open();
    const result = new Promise<boolean>(resolve => {
      this.resolve = resolve;
    });

    return { result };
  }

  close(confirmed: boolean = false) {
    super.close();
    this.resolve(confirmed);
  }
}
