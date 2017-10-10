import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import * as _ from 'lodash';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  templateUrl: './chicken-profile.component.html',
  styleUrls: ['./chicken-profile.component.scss']
})
export class ChickenProfileComponent implements OnInit {
  chicken: FirebaseObjectObservable<any> = null;
  heaviest: any;
  total: number;
  flockId: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private db: AngularFireDatabase
  ) {
    this.route.params.subscribe(params => {
      const chickenId = params['chickenId'];

      this.authService.currentUserObservable.subscribe(authState => {
        if (authState) {
          this.db.object('/users/' + authState['uid']).subscribe(user => {
            this.flockId = user.currentFlockId;

            this.chicken = this.db.object(`chickens/${this.flockId}/${chickenId}`);

            const eggsPath = `eggs/${this.flockId}`;
            const eggs = this.db.list(eggsPath, {
              query: {
                orderByChild: 'chicken',
                equalTo: chickenId
              }
            });

            eggs.subscribe(data => {
              // this.getStreak(eggs);
              this.total = data.length;
              if (this.total > 0) {
                this.heaviest = this.getHeaviest(data);
              }
              console.log(this.heaviest);
            });
          });
        }
      });
    })
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

  getHeaviest(eggs) {
    let heaviest = 0;
    let heaviestEgg = null;
    eggs.forEach(egg => {
      console.log(+egg.weight);
      if (egg.weight && +egg.weight >= heaviest) {
        heaviest = +egg.weight;
        heaviestEgg = egg;
      }
    });
    return heaviestEgg;
  }

}
