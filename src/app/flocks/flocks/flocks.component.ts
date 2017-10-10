import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from '../../shared/auth.service'

@Component({
  templateUrl: './flocks.component.html',
  styleUrls: ['./flocks.component.scss']
})
export class FlocksComponent implements OnInit {
  flocks: FirebaseListObservable<any> = null;

  constructor(
    private authService: AuthService,
    private db: AngularFireDatabase
  ) {
    this.authService.currentUserObservable.subscribe(authState => {
      if (authState) {
        this.flocks = this.db.list('flocks', {
          query: {
            orderByChild: 'users/' + authState.uid,
            equalTo: true
          }
        });
      }
    })
  }

  ngOnInit() {

  }


}
