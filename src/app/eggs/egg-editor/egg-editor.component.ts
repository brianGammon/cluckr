import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService, ChickenService, EggService } from '../../shared/services';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/shareReplay';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Chicken, Egg } from '../../shared/models';
import { forOwn } from 'lodash';

@Component({
  templateUrl: './egg-editor.component.html',
  styleUrls: ['./egg-editor.component.scss']
})
export class EggEditorComponent implements OnInit, OnDestroy {
  flockId: string;
  chickens: Observable<Chicken[]> = null;
  eggForm: FormGroup;
  location: Location;
  errorMessage: string = null;

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

  private userId: string;
  private unsubscriber: Subject<void> = new Subject<void>();
  private egg: Egg;

  constructor(
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
    const eggId = this.route.snapshot.paramMap.get('eggId');

    this.eggForm = this.fb.group({
      'dateLaid': [defaultDate, [
        Validators.required
      ]],
      'chickenId': [defaultChickenId ? defaultChickenId : '', [
        Validators.required
      ]],
      'weight': ['', [
        Validators.max(110),
        Validators.min(20),
        Validators.pattern(/^\d+([.]\d{0,1})?$/)
      ]],
      'damaged': [''],
      'notes': ['']
    });
    this.eggForm.valueChanges.subscribe(data => this.onValueChanged());

    this.userService.currentUser.takeUntil(this.unsubscriber).subscribe(user => {
      if (user) {
        this.userId = user['$key'];
        this.flockId = user.currentFlockId;
        this.chickens = this.chickenService.getChickensList(user.currentFlockId).take(1).shareReplay();

        if (eggId) {
          this.eggService.getEgg(this.flockId, eggId).take(1).subscribe(egg => {
            this.egg = egg;
            this.eggForm.reset({
              dateLaid: egg.date,
              chickenId: egg.chickenId,
              weight: egg.weight,
              notes: egg.notes,
              damaged: egg.damaged
            });
          });
        }
      }
    });
  }

  ngOnDestroy() {
    // clean up subscriptions
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  addEgg() {
    if (this.eggForm.valid) {
      let eggPromise;
      this.errorMessage = null;
      this.chickens.take(1).subscribe(chickens => {
        const id = this.eggForm.value['chickenId'];
        const chick = chickens.find(chicken => chicken['$key'] === id);

        if (!this.egg) {
          this.egg = new Egg();
        }
        this.egg.date = this.eggForm.value['dateLaid'];
        this.egg.chickenId = id;
        this.egg.chickenName = chick ? chick.name : 'Unknown';
        this.egg.weight = this.eggForm.value['weight'];
        this.egg.damaged = !!this.eggForm.value['damaged'];
        this.egg.notes = this.eggForm.value['notes'];
        this.egg.userId = this.userId;
        this.egg.modified = moment().utc().toISOString();

        if (this.egg['$key']) {
          eggPromise = this.eggService.updateEgg(this.flockId, this.egg);
        } else {
          eggPromise = this.eggService.addEgg(this.flockId, this.egg);
        }
        eggPromise.then(() => this.location.back())
          .catch(error => {
            this.errorMessage = 'Oops, something went wrong 😩';
            console.log(error);
          });
      });
    }
  }

  // Updates validation state on form changes.
  private onValueChanged() {
    // Loop over the pre-defined form error fields
    forOwn(this.formErrors, (fieldValue, fieldKey) => {
      // clear previous error message (if any)
      this.formErrors[fieldKey] = '';
      // if the control that matches that field name is dirty and invalid...
      const control = this.eggForm.get(fieldKey);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[fieldKey];
        // for each error in the control, display the matching error message
        forOwn(control.errors, (msgValue, msgKey) => {
          this.formErrors[fieldKey] += messages[msgKey] + ' ';
        });
      }
    });
  }
}
