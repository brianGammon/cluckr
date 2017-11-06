import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'user-form-container',
  templateUrl: './user-form-container.component.html',
  styleUrls: ['./user-form-container.component.scss']
})
export class UserFormContainerComponent {
  appVersion: string = environment.appVersion;

  @Input()
  errorMessage: string;

  @Input()
  showTabs = true;
}
