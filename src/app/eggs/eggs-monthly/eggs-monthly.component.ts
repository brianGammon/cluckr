import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { UserService, ChickenService, EggService } from '../../shared/services';
import { Observable } from 'rxjs/Observable';
import { Egg, Chicken } from '../../shared/models';
import { CalendarEvent } from 'angular-calendar';

@Component({
  templateUrl: './eggs-monthly.component.html',
  styleUrls: ['./eggs-monthly.component.scss']
})
export class EggsMonthlyComponent implements OnInit {
  eggs: Observable<Egg[]> = null;
  // chickens: Observable<Chicken[]> = null;
  dateString: string;
  previousMonth: string;
  nextMonth: string;
  events: Observable<CalendarEvent[]>;
  viewDate = new Date(Date.now());

  private flockId: string;
  private colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private eggService: EggService
  ) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if (user) {
        this.flockId = user.currentFlockId;

        this.route.params.subscribe(params => {
          this.setNavDates(params['date']);
          this.dateString = params['date'];

          this.eggService.getEggsByDate(this.flockId, this.dateString).subscribe(eggs => {
            const eggEvents = [];
            eggs.forEach(egg => {
              eggEvents.push({
                title: 'Click me',
                color: this.colors.blue,
                start: moment('2017-10-10').toDate()
              });
            });
            this.events = Observable.of(eggEvents);
          });
        });
      }
    });
  }

  private setNavDates(date: string) {
    const currDate = moment.utc(date);

    this.previousMonth = currDate.subtract(1, 'days').format('YYYY-MM-DD').toString();

    this.nextMonth = currDate.add(2, 'days').format('YYYY-MM-DD').toString();
  }
}
