import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'user-form',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  userForm: FormGroup;
  newUser = false; // to toggle login or signup form
  passReset = false; // set to true when password reset is triggered
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
      'required': 'Password is required.',
      'pattern': 'Password must be include at one letter and one number.',
      'minlength': 'Password must be at least 4 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    }
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  toggleForm() {
    this.newUser = !this.newUser;
  }

  signup(): void {
    this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password'])
  }

  login(): void {
    this.auth.emailLogin(this.userForm.value['email'], this.userForm.value['password']).then(data => {
      this.router.navigateByUrl('/flock');
    });
  }

  resetPassword() {
    this.auth.resetPassword(this.userForm.value['email'])
      .then(() => this.passReset = true)
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
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
