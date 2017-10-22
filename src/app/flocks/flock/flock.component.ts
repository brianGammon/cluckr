import { Component, OnInit } from '@angular/core';
import { UserService, FlockService, ChickenService, EggService } from '../../shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Flock, Chicken, FlockStats, Egg, User } from '../../shared/models';

@Component({
  templateUrl: './flock.component.html',
  styleUrls: ['./flock.component.scss']
})
export class FlockComponent implements OnInit {
  user: User;
  flock: Observable<Flock> = null;
  chickens: Observable<Chicken[]> = null;
  stats: FlockStats = null;
  eggSubscription: Subscription;
  private flockId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private flockService: FlockService,
    private chickenService: ChickenService,
    private eggService: EggService
  ) {}

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if (this.eggSubscription) {
        this.eggSubscription.unsubscribe();
      }

      this.user = user;

      if (user) {
        if (!user.currentFlockId) {
          return this.router.navigateByUrl('/flocks');
        }
        this.flockId = user.currentFlockId;
        this.flock = this.flockService.getFlock(user.currentFlockId);
        this.chickens = this.chickenService.getChickensList(user.currentFlockId);
        this.eggSubscription = this.eggService.getEggs(user.currentFlockId).subscribe(eggs => {
          this.stats = null;
          if (eggs.length > 0) {
            this.stats = this.buildStats(eggs);
          }
        });
      }
    });
  }

  deleteChicken(chicken: Chicken) {
    if (window.confirm('Are you sure? Press OK to delete the chicken.')) {
      this.chickenService.deleteChicken(this.flockId, chicken)
      .catch(err => console.log(err));
    }
  }

  buildStats(eggs: Egg[]): FlockStats {
    let heaviestEgg = null;
    let highestWeight = 0;
    let totalWithWeight = 0;
    let totalWeight = 0;
    let earliestDate = null;
    let daysSinceFirst = 0;
    const eggsPerChicken: any = {};

    const sortedEggs = _.sortBy(eggs, 'date');

    sortedEggs.forEach((egg: Egg) => {
      if (!earliestDate) {
        earliestDate = egg.date;
      }

      if (!eggsPerChicken[egg.chickenId]) {
        eggsPerChicken[egg.chickenId] = 0;
      }
      eggsPerChicken[egg.chickenId]++;

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
    };
  }

}
