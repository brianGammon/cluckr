import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';
import { SwRegistrationService } from './shared/services/sw-registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  updateAvailable = false;
  showLayout = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private swRegistrationService: SwRegistrationService
  ) { }

  ngOnInit() {
    this.swRegistrationService.updateAvailable.then(flag => this.updateAvailable = flag);

    this.router.events
      .filter(event => {
        return event instanceof NavigationEnd;
      })
      .map(() => {
        // Switch the Observable to the ActivatedRoute and keep going
        return this.activatedRoute;
      })
      .map(route => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((data) => {
        this.showLayout = data['showLayout'] === undefined || data['showLayout'] === true;
      });
  }

  refresh() {
    window.location.reload(true);
  }
}
