import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { UserService, ChickenService, EggService } from '../../shared/services';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Egg, Chicken } from '../../shared/models';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  templateUrl: './eggs-daily.component.html',
  styleUrls: ['./eggs-daily.component.scss']
})
export class EggsDailyComponent implements OnInit, OnDestroy {
  eggs: Observable<Egg[]> = null;
  dateString: string;
  previousDate: string;
  nextDate: string;

  @ViewChild(ConfirmDialogComponent)
  private confirmDialog: ConfirmDialogComponent;

  private flockId: string;
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private chickenService: ChickenService,
    private eggService: EggService
  ) { }

  ngOnInit() {
    this.userService.currentUser.takeUntil(this.unsubscriber).subscribe(user => {
      if (user) {
        this.flockId = user.currentFlockId;

        this.route.params.subscribe(params => {
          this.setNavDates(params['date']);
          this.dateString = params['date'];
          this.eggs = this.eggService.getEggsByDate(this.flockId, this.dateString);
        });
      }
    });
  }

  ngOnDestroy() {
    // clean up subscriptions
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  deleteEgg(key: string) {
    this.confirmDialog.open().result
      .then(confirmed => {
        if (confirmed) {
          this.eggService.deleteEgg(this.flockId, key)
          .catch(error => console.log(error));
        }
      });
  }

  private setNavDates(date: string) {
    const currDate = moment.utc(date);

    this.previousDate = currDate.subtract(1, 'days').format('YYYY-MM-DD').toString();

    this.nextDate = currDate.add(2, 'days').format('YYYY-MM-DD').toString();
  }
}
