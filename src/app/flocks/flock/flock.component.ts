import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  templateUrl: './flock.component.html',
  styleUrls: ['./flock.component.scss']
})
export class FlockComponent implements OnInit {
  flock: FirebaseObjectObservable<any> = null;
  chickens: FirebaseListObservable<any> = null;
  // eggs: FirebaseListObservable<any> = null;
  stats: any;
  private flockId: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.authService.currentUserObservable.subscribe(authState => {
      if (authState) {
        this.db.object(`users/${authState['uid']}`).subscribe((user) => {
          this.flock = this.db.object(`flocks/${user.currentFlockId}`);
          const chickenPath = `chickens/${user.currentFlockId}`;
          this.chickens = this.db.list(chickenPath);
          this.db.list(`eggs/${user.currentFlockId}`).subscribe(eggs => {
            this.stats = this.buildStats(eggs);
          });
        });
      }
    });
  }

  deleteChicken(key) {
    this.chickens.remove(key);
  }

  buildStats(eggs: any) {
    let heaviestEgg = null;
    let highestWeight = 0;
    let totalWithWeight = 0;
    let totalWeight = 0;
    let earliestDate = null;
    let daysSinceFirst = 0;
    const eggsPerChicken: any = {};

    const sortedEggs = _.sortBy(eggs, 'date');

    sortedEggs.forEach((egg: any) => {
      if (!earliestDate) {
        earliestDate = egg.date;
      }

      if (!eggsPerChicken[egg.chicken]) {
        eggsPerChicken[egg.chicken] = 0;
      }
      eggsPerChicken[egg.chicken]++;

      // Find heaviest & avg
      if (egg.weight) {
        totalWithWeight++;
        totalWeight += +egg.weight;
        if (+egg.weight > highestWeight) {
          heaviestEgg = egg;
          highestWeight = egg.weight;
        }
      }
    });

    // Figure out who laid the most eggs
    let topProducer: string;
    let most = 0;
    for (const item in eggsPerChicken) {
      if (eggsPerChicken[item] > most) {
        topProducer = item;
        most = eggsPerChicken[item];
      }
    }

    const start = moment(earliestDate);
    const now = moment();
    daysSinceFirst = now.diff(start, 'days') + 1;

    return {
      total: eggs.length,
      heaviest: heaviestEgg,
      averageWeight: totalWeight / totalWithWeight,
      averageNumber: eggs.length / daysSinceFirst,
      firstEgg: earliestDate,
      mostEggs: topProducer
    }
  }

}
