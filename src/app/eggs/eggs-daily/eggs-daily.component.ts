import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from '../../shared/auth.service'
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  templateUrl: './eggs-daily.component.html',
  styleUrls: ['./eggs-daily.component.scss']
})
export class EggsDailyComponent implements OnInit {
  eggs: FirebaseListObservable<any> = null;
  chickens: FirebaseObjectObservable<any> = null;
  dateString: string;
  previousDate: string;
  nextDate: string;
  private flockId: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.authService.currentUserObservable.subscribe(authState => {
      if (authState) {
        this.db.object('/users/' + authState['uid']).subscribe(user => {
          this.flockId = user.currentFlockId;
          console.log(this.flockId);

          this.route.params.subscribe(params => {
            this.setNavDates(params['date']);
            this.dateString = params['date'];
            const eggsPath = 'eggs/' + this.flockId;
            this.eggs = this.db.list(eggsPath, {
              query: {
                orderByChild: 'date',
                equalTo: this.dateString
              }
            });

            const chickensPath = 'chickens/' + this.flockId;
            this.chickens = this.db.object(chickensPath);

          })
        })
      }
    })
  }

  deleteEgg(key) {
    this.eggs.remove(key)
    .catch(error => console.log(error))
  }

  private setNavDates(date: string) {
    const currDate = moment.utc(date);

    this.previousDate = currDate.subtract(1, 'days').format('YYYY-MM-DD').toString();

    this.nextDate = currDate.add(2, 'days').format('YYYY-MM-DD').toString();
  }
}
