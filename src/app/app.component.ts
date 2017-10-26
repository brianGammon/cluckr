import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { SwRegistrationService } from './shared/services/sw-registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  updateAvailable = false;
  constructor(
    private swRegistrationService: SwRegistrationService
  ) { }

  ngOnInit() {
    this.swRegistrationService.updateAvailable.then(flag => this.updateAvailable = flag);
  }

  refresh() {
    window.location.reload(true);
  }
}
