import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, ChickenService, EggService } from '../../shared/services';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Egg, Chicken } from '../../shared/models';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  templateUrl: './chicken-profile.component.html',
  styleUrls: ['./chicken-profile.component.scss']
})
export class ChickenProfileComponent implements OnInit, OnDestroy {
  chicken: Observable<Chicken> = null;
  heaviest: Egg;
  longestStreak: number;
  total: number;
  flockId: string;
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private chickenService: ChickenService,
    private eggService: EggService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const chickenId = params['chickenId'];

      this.userService.currentUser.takeUntil(this.unsubscriber).subscribe(user => {
        if (user) {
          this.flockId = user.currentFlockId;
          this.chicken = this.chickenService.getChicken(this.flockId, chickenId)
            .map(chicken => {
              this.eggService.getEggsByChickenId(this.flockId, chickenId).takeUntil(this.unsubscriber).subscribe(eggs => {
                this.total = eggs.length;
                if (this.total > 0) {
                  const stats = this.buildStats(eggs);
                  this.heaviest = stats.heaviest;
                  this.longestStreak = stats.longestStreak;
                }
              });
              return chicken;
            });
        }
      });
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

    const sortedEggs = _.sortBy(eggs, 'date');
    _.forEach(sortedEggs, function (egg) {
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
    });

    const stats = new ChickenStats();
    stats.heaviest = heaviestEgg;
    stats.longestStreak = longestStreak;
    return stats;
  }
}
export class ChickenStats {
  heaviest: Egg;
  longestStreak: number;
}
