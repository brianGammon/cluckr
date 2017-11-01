import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserService, FlockService } from '../../shared/services';
import { Subscription } from 'rxjs/Subscription';
import { User, Flock } from '../models';
import * as moment from 'moment';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  user: User;
  flocks: Flock[];
  currentFlock: Flock;
  dayString: string = moment().format('DD');
  monthString: string = moment().format('YYYY-MM');
  appVersion: string = environment.appVersion;
  show = false;

  private flocksSubscription: Subscription;

  constructor(
    private userService: UserService,
    private flockService: FlockService
  ) {}

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if (this.flocksSubscription) {
        this.flocksSubscription.unsubscribe();
      }

      if (user) {
        this.user = user;
        this.flocksSubscription = this.flockService.getFlocks(user).subscribe(result => {
          this.flocks = result;
          this.currentFlock = result.find(flock => flock.$key === user.currentFlockId);
        });
      } else {
        this.user = null;
        this.currentFlock = null;
        this.flocks = null;
      }
    });
  }

  toggleCollapse() {
    this.show = !this.show;
  }

  signOut() {
    this.userService.signOut();
  }

  setCurrentFlockId(flockId: string) {
    this.userService.setCurrentFlockId(flockId);
  }

}
