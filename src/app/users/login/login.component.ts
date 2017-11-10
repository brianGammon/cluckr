import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forOwn } from 'lodash';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  loginForm: FormGroup;
  formErrors = {
    'email': '',
    'password': ''
  };
  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email'
    },
    'password': {
      'required': 'Password is required.'
    }
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  login(): void {
    if (this.loginForm.valid) {
      this.errorMessage = null;
      this.userService.signIn(this.loginForm.value['email'], this.loginForm.value['password'])
        .then(data => {
          this.router.navigateByUrl('/flock');
        })
        .catch(error => {
          console.log(error);
          this.errorMessage = error.message ? error.message : 'Sign in failed, An error has occurred';
        });
    }
  }

  buildForm(): void {
    this.loginForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.required
      ]
      ],
    });

    this.loginForm.valueChanges.subscribe(data => this.onValueChanged());
  }

  // Updates validation state on form changes.
  private onValueChanged() {
    // Loop over the pre-defined form error fields
    forOwn(this.formErrors, (fieldValue, fieldKey) => {
      // clear previous error message (if any)
      this.formErrors[fieldKey] = '';
      // if the control that matches that field name is dirty and invalid...
      const control = this.loginForm.get(fieldKey);
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
