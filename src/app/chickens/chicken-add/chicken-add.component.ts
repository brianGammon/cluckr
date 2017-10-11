import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, ChickenService } from '../../shared/services';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Chicken } from '../../shared/models';

@Component({
  templateUrl: './chicken-add.component.html',
  styleUrls: ['./chicken-add.component.scss']
})
export class ChickenAddComponent implements OnInit {
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
    private userService: UserService,
    private chickenService: ChickenService
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
    this.userService.currentUser.take(1).subscribe(user => {
      if (user) {
        const chicken = new Chicken();
        chicken.name = this.chickenForm.get('name').value;
        chicken.breed = this.chickenForm.get('breed').value;
        chicken.hatched = this.chickenForm.get('hatched').value;
        chicken.photo = this.chickenForm.get('photo').value;

        this.chickenService.addChicken(user.currentFlockId, chicken)
          .then(data => {
            console.log(data);
            this.router.navigateByUrl('/flock');
          })
          .catch(error => console.log(error));
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
}
