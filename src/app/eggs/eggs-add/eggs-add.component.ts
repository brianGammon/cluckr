import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import * as moment from 'moment';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './eggs-add.component.html',
  styleUrls: ['./eggs-add.component.scss']
})
export class EggsAddComponent implements OnInit {
  flockId: any;
  chickens: FirebaseListObservable<any> = null;
  // flock: FirebaseObjectObservable<any> = null;
  eggForm: FormGroup;
  location: Location;
  private userId: string;

  formErrors = {
    'dateLaid': '',
    'chickenId': ''
  };

  validationMessages = {
    'dateLaid': {
      'required': 'Date egg was laid is required.'
    },
    'chickenId': {
      'required': 'Chicken ID is required.'
    }
  };

  constructor(
    private router: Router,
    public locationService: Location,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private db: AngularFireDatabase
  ) {
    this.location = locationService
  }

  ngOnInit() {
    const defaultDate = this.route.snapshot.queryParamMap.get('date') || moment().format('YYYY-MM-DD');
    const defaultChickenId = this.route.snapshot.queryParamMap.get('chickenId');
    console.log(defaultDate);

    this.authService.currentUserObservable.subscribe(authState => {
      if (authState) {
        this.db.object('/users/' + authState['uid']).subscribe(user => {
          this.userId = user.$key;
          this.flockId = user.currentFlockId;
          console.log(this.flockId);

          const chickensPath = 'chickens/' + this.flockId;
          this.chickens = this.db.list(chickensPath);
        });
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
      'weight': [''],
      'damaged': [''],
      'notes': ['']
    });

    this.eggForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages

  }

  addEgg() {
    const itemPath = 'eggs/' + this.flockId;
    const items = this.db.list(itemPath);
    const newEgg = {
      'date': this.eggForm.value['dateLaid'],
      'chicken': this.eggForm.value['chickenId'],
      'weight': this.eggForm.value['weight'],
      'damaged': !!this.eggForm.value['damaged'],
      'notes': this.eggForm.value['notes'],
      'userId': this.userId,
      'modified': moment().utc().toISOString()
    }
    items.push(newEgg)
      .then(data => {
        console.log(data);
        this.router.navigateByUrl('/eggs/day/' + this.eggForm.value['dateLaid']);
      })
      .catch(error => console.log(error))
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

  // getKeys(flock: string) {
  //   return Object.keys(eggs);
  // }

}
