import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './chicken-add.component.html',
  styleUrls: ['./chicken-add.component.scss']
})
export class ChickenAddComponent implements OnInit {
  // eggs: FirebaseListObservable<any> = null;
  // flock: FirebaseObjectObservable<any> = null;
  chickenForm: FormGroup;
  location: Location;

  formErrors = {
    'name': ''
  };

  validationMessages = {
    'name': {
      'required': 'Chicken name is required.'
    }
  };

  constructor(
    private router: Router,
    private locationService: Location,
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {
    this.location = locationService;
  }

  ngOnInit() {
    this.chickenForm = this.fb.group({
      'name': ['', [
        Validators.required
      ]
      ],
      'breed': ['', []],
      'hatched': ['', []],
      'photo': ['']
    });

    this.chickenForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages

  }

  addChicken() {
    this.authService.currentUserObservable.take(1).subscribe(authState => {
      if (authState) {
        this.db.object(`users/${authState['uid']}`).take(1).subscribe(user => {
          const flockId = user.currentFlockId;
          const itemPath = 'chickens/' + flockId;
          const items = this.db.list(itemPath);

          items.push(this.chickenForm.value)
            .then(data => {
              console.log(data);
              this.router.navigateByUrl('/flock');
            })
            .catch(error => console.log(error))
        });
      } else {
        console.log('Not logged in, cannot add chicken');
      }
    });
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.chickenForm) { return; }
    const form = this.chickenForm;
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
