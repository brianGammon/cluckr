import { Component, OnInit, ViewChildren, AfterViewInit } from '@angular/core';
import { UserService } from '../../shared/services';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { forOwn } from 'lodash';

export class PasswordValidation {
  static MatchPassword(control: AbstractControl) {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ matchPassword: true });
    } else {
      return null;
    }
  }
}

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit {
  errorMessage: string;
  signupForm: FormGroup;
  passReset = false; // set to true when password reset is triggered
  formErrors = {
    'email': '',
    'password': '',
    'confirmPassword': ''
  };
  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must be include at one letter and one number.',
      'minlength': 'Password must be at least 4 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    },
    'confirmPassword': {
      'required': 'Confirm Password is required.',
      'matchPassword': 'Must match Password field.'
    }
  };

  @ViewChildren('setFocus') vc;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit() {
    this.vc.first.nativeElement.focus();
  }

  signup(): void {
    if (this.signupForm.valid) {
      this.errorMessage = null;
      this.userService.signUp(this.signupForm.value['email'], this.signupForm.value['password'])
        .then(() => {
          this.router.navigateByUrl('/flocks');
        })
        .catch(error => {
          console.log(error);
          this.errorMessage = error.message ? error.message : 'Sign up failed, An error has occurred';
        });
    }
  }

  buildForm(): void {
    this.signupForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
      'confirmPassword': ['', [
        Validators.required
      ]]
    }, {
        validator: PasswordValidation.MatchPassword
      });

    this.signupForm.valueChanges.subscribe(data => this.onValueChanged());
  }

  // Updates validation state on form changes.
  private onValueChanged() {
    // Loop over the pre-defined form error fields
    forOwn(this.formErrors, (fieldValue, fieldKey) => {
      // clear previous error message (if any)
      this.formErrors[fieldKey] = '';
      // if the control that matches that field name is dirty and invalid...
      const control = this.signupForm.get(fieldKey);
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
