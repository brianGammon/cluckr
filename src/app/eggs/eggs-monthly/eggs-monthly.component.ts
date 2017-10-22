import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { UserService, ChickenService, EggService } from '../../shared/services';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Egg, Chicken } from '../../shared/models';
import { CalendarEvent } from 'angular-calendar';

@Component({
  templateUrl: './eggs-monthly.component.html',
  styleUrls: ['./eggs-monthly.component.scss']
})
export class EggsMonthlyComponent implements OnInit {
  eggs: Observable<Egg[]> = null;
  dateString: string;
  previousMonth: string;
  nextMonth: string;
  events: Observable<CalendarEvent[]>;
  viewDate = new Date(Date.now());

  private eggsSubscription: Subscription;
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
    private router: Router,
    private userService: UserService,
    private eggService: EggService
  ) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if (this.eggsSubscription) {
        this.eggsSubscription.unsubscribe();
      }

      if (user && user.currentFlockId) {
        this.flockId = user.currentFlockId;

        this.route.params.subscribe(params => {
          this.setNavDates(params['date']);
          this.dateString = params['date'];


          const selectedDate = moment(this.dateString);
          this.viewDate = selectedDate.toDate();
          const startOfMonth = selectedDate.startOf('month').format('YYYY-MM-DD');
          const endOfMonth   = selectedDate.endOf('month').format('YYYY-MM-DD');
          console.log(`Start: ${startOfMonth}, End: ${endOfMonth}`);

          this.eggsSubscription = this.eggService.getEggsByDateRange(this.flockId, startOfMonth, endOfMonth).subscribe((eggs: Egg[]) => {
            const eggEvents = [];
            eggs.forEach(egg => {
              const title = egg.chickenName + ' ' + (egg.weight ? `${egg.weight}g` : 'egg');
              eggEvents.push({
                title,
                color: this.colors.blue,
                start: moment(egg.date).toDate()
              });
            });
            this.events = Observable.of(eggEvents);
          });
        });
      }
    });
  }

  goToDate(date: Date) {
    const dateString = moment(date).format('YYYY-MM-DD');
    this.router.navigateByUrl(`/eggs/day/${dateString}`);
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    this.goToDate(event.start);
  }

  private setNavDates(date: string) {
    const currDate = moment.utc(date);

    this.previousMonth = currDate.subtract(1, 'month').format('YYYY-MM').toString();

    this.nextMonth = currDate.add(2, 'month').format('YYYY-MM').toString();
  }
}
