import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, ChickenService, EggService } from '../../shared/services';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/shareReplay';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Chicken, Egg } from '../../shared/models';

@Component({
  templateUrl: './eggs-add.component.html',
  styleUrls: ['./eggs-add.component.scss']
})
export class EggsAddComponent implements OnInit, OnDestroy {
  flockId: string;
  chickens: Observable<Chicken[]> = null;
  eggForm: FormGroup;
  location: Location;
  errorMessage: string = null;
  private userId: string;
  private unsubscriber: Subject<void> = new Subject<void>();

  formErrors = {
    'dateLaid': '',
    'chickenId': '',
    'weight': ''
  };

  validationMessages = {
    'dateLaid': {
      'required': 'Date egg was laid is required.'
    },
    'chickenId': {
      'required': 'Chicken ID is required.'
    },
    'weight': {
      'max': 'Max value is 110.',
      'min': 'Min value is 20.',
      'pattern': 'Use number format "0.0".'
    }
  };

  constructor(
    private router: Router,
    public locationService: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private chickenService: ChickenService,
    private eggService: EggService,
    private fb: FormBuilder
  ) {
    this.location = locationService;
  }

  ngOnInit() {
    const defaultDate = this.route.snapshot.queryParamMap.get('date') || moment().format('YYYY-MM-DD');
    const defaultChickenId = this.route.snapshot.queryParamMap.get('chickenId');

    this.userService.currentUser.takeUntil(this.unsubscriber).subscribe(user => {
      if (user) {
        this.userId = user['$key'];
        this.flockId = user.currentFlockId;
        this.chickens = this.chickenService.getChickensList(user.currentFlockId).take(1).shareReplay();
      }
    });

    this.eggForm = this.fb.group({
      'dateLaid': [defaultDate, [
        Validators.required
      ]],
      'chickenId': [defaultChickenId ? defaultChickenId : '', [
        Validators.required
      ]
      ],
      'weight': ['', [
        Validators.max(110),
        Validators.min(20),
        Validators.pattern(/^\d+([.]\d{0,1})?$/)
      ]],
      'damaged': [''],
      'notes': ['']
    });

    this.eggForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  ngOnDestroy() {
    // clean up subscriptions
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  addEgg() {
    if (this.eggForm.valid) {
      this.errorMessage = null;
      this.chickens.take(1).subscribe(chickens => {
        const id = this.eggForm.value['chickenId'];
        const chick = chickens.find(chicken => chicken['$key'] === id);

        const egg = new Egg();
        egg.date = this.eggForm.value['dateLaid'];
        egg.chickenId = id;
        egg.chickenName = chick ? chick.name : 'Unknown';
        egg.weight = this.eggForm.value['weight'];
        egg.damaged = !!this.eggForm.value['damaged'];
        egg.notes = this.eggForm.value['notes'];
        egg.userId = this.userId;
        egg.modified = moment().utc().toISOString();
        this.eggService.saveEgg(this.flockId, egg)
          .then(data => {
            this.location.back();
          })
          .catch(error => {
            this.errorMessage = 'Oops, something went wrong 😩';
            console.log(error);
          });
      });
    }
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.eggForm) { return; }
    const form = this.eggForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
