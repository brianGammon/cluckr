import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { UserService, FlockService } from '../../shared/services';
import { User, Flock } from '../../shared/models';

@Component({
  templateUrl: './flocks.component.html',
  styleUrls: ['./flocks.component.scss']
})
export class FlocksComponent implements OnInit, OnDestroy {
  flocks: Observable<Flock[]> = null;
  user: User;
  newFlockName: string;
  joinFlockId: string;
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private userService: UserService,
    private flockService: FlockService
  ) {
  }

  ngOnInit() {
    this.userService.currentUser.takeUntil(this.unsubscriber).subscribe(user => {
      if (user) {
        this.user = user;
        this.flocks = this.flockService.getFlocks(user);
      }
    });
  }

  ngOnDestroy() {
    // clean up subscriptions
    this.unsubscriber.next();
    this.unsubscriber.complete();
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
      this.userService.getFlockMembers(flockId).take(1).subscribe(users => {
        const unlinkUsers = [];

        users.forEach(user => {
          unlinkUsers.push(this.userService.unlinkFlock(flockId, user['$key']));
        });

        Promise.all(unlinkUsers)
          .then(() => this.flockService.deleteFlock(this.user['$key'], flockId))
          .catch(err => {
            console.log(err);
            throw new Error(err);
          });
      });
    }
  }
}
