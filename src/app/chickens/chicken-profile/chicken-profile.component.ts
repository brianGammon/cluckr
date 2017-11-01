import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, ChickenService, EggService, FlockService } from '../../shared/services';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Egg, Chicken } from '../../shared/models';
import { sortBy, forEach } from 'lodash';
import * as moment from 'moment';

@Component({
  templateUrl: './chicken-profile.component.html',
  styleUrls: ['./chicken-profile.component.scss']
})
export class ChickenProfileComponent implements OnInit, OnDestroy {
  chickens: Chicken[];
  index: number;
  stats: ChickenStats;
  objectKeys = Object.keys;
  showModal = false;
  isFlockOwner = false;

  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private chickenService: ChickenService,
    private eggService: EggService,
    private flockService: FlockService
  ) {
  }

  ngOnInit() {
    this.userService.currentUser.takeUntil(this.unsubscriber).subscribe(user => {
      if (user) {
        this.flockService.getFlock(user.currentFlockId).take(1)
          .subscribe(flock => this.isFlockOwner = (flock && user['$key'] === flock.ownedBy));

        this.chickenService.getChickensList(user.currentFlockId).takeUntil(this.unsubscriber).subscribe((chickens: Chicken[]) => {
          this.chickens = chickens;
          this.route.params.subscribe(params => {
            this.showModal = false;
            const chickenId = params['chickenId'];
            this.index = chickens.findIndex(chicken => chicken['$key'] === chickenId);
            this.eggService.getEggsByChickenId(user.currentFlockId, chickenId).takeUntil(this.unsubscriber).subscribe(eggs => {
              this.stats = this.buildStats(eggs);
            });
          });
        });
      } else {
        this.chickens = null;
        this.stats = null;
        this.isFlockOwner = false;
      }
    });
  }

  ngOnDestroy() {
    // clean up subscriptions
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  buildStats(eggs: Egg[]) {
    let heaviest = 0;
    let heaviestEgg = null;
    let streakCount = 0;
    let longestStreak = 0;
    let lastEggDate = null;

    const lastSevenDays = {};
    const startDay = moment().subtract(6, 'day');
    lastSevenDays[startDay.format('YYYY-MM-DD')] = 0;
    let daysAdded = 1;
    while (daysAdded < 7) {
      lastSevenDays[startDay.add(1, 'day').format('YYYY-MM-DD')] = 0;
      daysAdded++;
    }

    const sortedEggs = sortBy(eggs, 'date');
    forEach(sortedEggs, function (egg) {
      let resetStreak = false;

      // Determine the longest streak
      if (!lastEggDate) {
        // first one, start a streak
        streakCount = 1;
        longestStreak = 1;
        lastEggDate = egg.date;
      } else {
        // see if this egg date is 1 day past
        const thisEgg = moment(egg.date);
        const lastEgg = moment(lastEggDate);
        const daysBetween = thisEgg.diff(lastEgg, 'days');
        // Not counting if daysBetween === 0, means 2 in 1 day
        if (daysBetween === 1) {
          // Still got a streak going
          streakCount++;
        } else if (daysBetween > 1) {
          // current streak over
          resetStreak = true;
        }

        if (streakCount > longestStreak) {
          longestStreak = streakCount;
        }

        if (resetStreak) {
          streakCount = 1;
          resetStreak = false;
        }

        lastEggDate = egg.date;
      }

      // Figure out the heaviest
      if (egg.weight && +egg.weight >= heaviest) {
        heaviest = +egg.weight;
        heaviestEgg = egg;
      }

      // Track the past 7 days eggs
      if (lastSevenDays.hasOwnProperty(egg.date)) {
        lastSevenDays[egg.date]++;
      }
    });

    const stats = new ChickenStats();
    stats.total = eggs.length;
    stats.heaviest = heaviestEgg;
    stats.longestStreak = longestStreak;
    stats.lastSevenDays = lastSevenDays;
    return stats;
  }
}
export class ChickenStats {
  total: number;
  heaviest: Egg;
  longestStreak: number;
  lastSevenDays: {};
}
