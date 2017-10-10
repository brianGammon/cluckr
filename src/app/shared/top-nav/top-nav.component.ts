import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from '../../shared/auth.service';
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
  user: any;
  flocks: any;
  currentFlock: any;
  dayString: string = moment().format('DD');
  monthString: string = moment().format('YYYY-MM');

  // collapse:string = "closed";
  show = false;

  constructor(
    private authService: AuthService,
    private db: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.authService.currentUserObservable.subscribe(authState => {
      if (authState) {
        this.db.object('users/' + authState['uid']).subscribe(user => {

          this.user = user;
          this.db.list('flocks', {
            query: {
              orderByChild: 'users/' + authState['uid'],
              equalTo: true
            }
          }).subscribe(result => {

            this.flocks = result;
            this.currentFlock = result.find(flock => flock.$key === user.currentFlockId);
          });
        })

      }
    })
  }

  toggleCollapse() {
    this.show = !this.show
    // this.collapse = this.collapse == "open" ? 'closed' : 'open';

  }

  signOut() {
    this.authService.signOut();
  }

  setCurrentFlockId(flockId: string) {
    const ref = this.db.object('users/' + this.user.$key);
    ref.update({ currentFlockId: flockId});
  }

}
