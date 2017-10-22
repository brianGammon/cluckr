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
        this.user = user;
        this.flocks = this.flockService.getFlocks(user);
      }
    });
  }

  addFlock() {
    if (this.newFlockName) {
      this.flockService.addFlock(this.newFlockName, this.user['$key'])
        .then(data => {
          this.newFlockName = '';
          return this.userService.linkFlock(data.key);
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
      this.userService.linkFlock(this.joinFlockId)
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

  deleteFlock(flockId: string) {
    if (window.confirm('Are you sure? Click OK to delete the flock, along with chickens and eggs belonging to it.')) {
      if (this.user.currentFlockId === flockId) {
        this.userService.setCurrentFlockId(null);
      }

      this.flockService.deleteFlock(this.user['$key'], flockId)
        .then(() => this.userService.unlinkFlock(flockId))
        .catch(err => console.log(err));
    }
  }
}
