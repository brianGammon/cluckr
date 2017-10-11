import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { UserService, FlockService } from '../../shared/services';
import { User, Flock } from '../../shared/models';

@Component({
  templateUrl: './flocks.component.html',
  styleUrls: ['./flocks.component.scss']
})
export class FlocksComponent implements OnInit {
  flocks: Observable<Flock[]> = null;
  user: User;
  newFlockName: string;
  joinFlockId: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private flockService: FlockService
  ) {
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if (user) {
        if (user.currentFlockId) {
          this.user = user;
        }
        this.flocks = this.flockService.getFlocks(user['$key']);
      }
    });
  }

  addFlock() {
    if (this.newFlockName) {
      this.flockService.addFlock(this.newFlockName, this.user['$key'])
        .then(data => {
          this.newFlockName = '';
          return this.userService.setCurrentFlockId(data.key);
        })
        .then(() => {
          this.router.navigateByUrl('/flock');
        })
        .catch(err => console.log(err));
    } else {

      console.log('No flock name provided');
    }

  }

  joinFlock() {
    if (this.joinFlockId) {
      this.flockService.joinFlock(this.joinFlockId, this.user['$key'])
        .then(data => {
          console.log(data);

          return this.userService.setCurrentFlockId(this.joinFlockId);
        })
        .then(() => {
          this.router.navigateByUrl('/flock');
        })
        .catch(err => console.log(err));
    }
  }

  selectFlock(flockId: string) {
    this.userService.setCurrentFlockId(flockId);
    this.router.navigateByUrl('/flock');
  }
}
