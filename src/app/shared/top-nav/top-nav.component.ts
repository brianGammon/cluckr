import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { UserService, FlockService } from '../../shared/services';
import { Subscription } from 'rxjs/Subscription';
import { User, Flock } from '../models';
import * as moment from 'moment';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
  animations: [
    trigger('collapse', [
      state('open', style({
        opacity: '1',
        display: 'block',
        transform: 'translate3d(0, 0, 0)'
      })),
      state('closed', style({
        opacity: '0',
        display: 'none',
        transform: 'translate3d(0, -100%, 0)'
      })),
      transition('closed => open', animate('200ms ease-in')),
      transition('open => closed', animate('100ms ease-out'))
    ])
  ]
})
export class TopNavComponent implements OnInit {
  user: User;
  flocks: Flock[];
  currentFlock: Flock;
  dayString: string = moment().format('DD');
  monthString: string = moment().format('YYYY-MM');
  flocksSubscription: Subscription;
  show = false;

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
        this.flocksSubscription = this.flockService.getFlocks(user['$key']).subscribe(result => {
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
