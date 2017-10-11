import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { UserService, FlockService } from '../../shared/services';
import { Flock } from '../../shared/models/flock';

@Component({
  templateUrl: './flocks.component.html',
  styleUrls: ['./flocks.component.scss']
})
export class FlocksComponent implements OnInit {
  flocks: Observable<Flock[]> = null;

  constructor(
    private userService: UserService,
    private flockService: FlockService
  ) {
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if (user) {
        this.flocks = this.flockService.getFlocks(user['$key']);
      }
    });
  }
}
