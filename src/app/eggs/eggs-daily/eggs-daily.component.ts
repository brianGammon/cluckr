import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { UserService, ChickenService, EggService } from '../../shared/services';
import { Observable } from 'rxjs/Observable';
import { Egg, Chicken } from '../../shared/models';

@Component({
  templateUrl: './eggs-daily.component.html',
  styleUrls: ['./eggs-daily.component.scss']
})
export class EggsDailyComponent implements OnInit {
  eggs: Observable<Egg[]> = null;
  chickens: Observable<Chicken[]> = null;
  dateString: string;
  previousDate: string;
  nextDate: string;
  private flockId: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private chickenService: ChickenService,
    private eggService: EggService
  ) {}

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if (user) {
        this.flockId = user.currentFlockId;

        this.route.params.subscribe(params => {
          this.setNavDates(params['date']);
          this.dateString = params['date'];
          this.eggs = this.eggService.getEggsByDate(this.flockId, this.dateString);
          this.chickens = this.chickenService.getChickens(this.flockId);
        });
      }
    });
  }

  deleteEgg(key) {
    this.eggService.deleteEgg(this.flockId, key)
      .catch(error => console.log(error));
  }

  private setNavDates(date: string) {
    const currDate = moment.utc(date);

    this.previousDate = currDate.subtract(1, 'days').format('YYYY-MM-DD').toString();

    this.nextDate = currDate.add(2, 'days').format('YYYY-MM-DD').toString();
  }
}
