import { Component, OnInit, ViewChildren, AfterViewInit } from '@angular/core';
import { UserService } from '../../shared/services';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forOwn } from 'lodash';

@Component({
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {
  errorMessage: string;
  success: boolean;
  form: FormGroup;

  formErrors = {
    'email': ''
  };
  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email'
    }
  };

  @ViewChildren('setFocus') vc;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit() {
    this.vc.first.nativeElement.focus();
  }

  resetPassword() {
    this.errorMessage = null;
    this.userService.resetPassword(this.form.value['email'])
      .then(() => {
        this.form.reset();
        this.success = true;
      })
      .catch(error => {
        console.log(error);
        this.errorMessage = error.message ? error.message : 'Sign in failed, An error has occurred';
      });
  }

  buildForm(): void {
    this.form = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]]
    });

    this.form.valueChanges.subscribe(data => this.onValueChanged());
  }

  // Updates validation state on form changes.
  private onValueChanged() {
    // clear previous error message (if any)
    this.formErrors['email'] = '';
    // if the control that matches that field name is dirty and invalid...
    const control = this.form.get('email');
    if (control && control.dirty && !control.valid) {
      const messages = this.validationMessages['email'];
      // for each error in the control, display the matching error message
      forOwn(control.errors, (msgValue, msgKey) => {
        this.formErrors['email'] += messages[msgKey] + ' ';
      });
    }
  }
}
