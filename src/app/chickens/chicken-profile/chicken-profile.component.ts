import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, ChickenService, EggService } from '../../shared/services';
import { Observable } from 'rxjs/Observable';
import { Egg, Chicken } from '../../shared/models';
import * as _ from 'lodash';

@Component({
  templateUrl: './chicken-profile.component.html',
  styleUrls: ['./chicken-profile.component.scss']
})
export class ChickenProfileComponent implements OnInit {
  chicken: Observable<Chicken> = null;
  heaviest: Egg;
  total: number;
  flockId: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private chickenService: ChickenService,
    private eggService: EggService
  ) {
    this.route.params.subscribe(params => {
      const chickenId = params['chickenId'];

      this.userService.currentUser.subscribe(user => {
        if (user) {
          this.flockId = user.currentFlockId;
          this.chicken = this.chickenService.getChicken(this.flockId, chickenId);

          this.eggService.getEggsByChickenId(this.flockId, chickenId).subscribe(data => {
            // this.getStreak(eggs);
            this.total = data.length;
            if (this.total > 0) {
              this.heaviest = this.getHeaviest(data);
            }
          });
        }
      });
    });
  }

  ngOnInit() {
  }

  getStreak(eggs) {
    // let days = 0;

    // _.sortBy(eggs, 'date');

    // _.forEach(eggs, function (egg) {
    //   console.log(egg);
    //  });
  }

  getHeaviest(eggs: Egg[]) {
    let heaviest = 0;
    let heaviestEgg = null;
    eggs.forEach(egg => {
      if (egg.weight && +egg.weight >= heaviest) {
        heaviest = +egg.weight;
        heaviestEgg = egg;
      }
    });
    return heaviestEgg;
  }

}
