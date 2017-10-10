import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { UserLoginComponent } from './user-login/user-login.component';


@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    UserLoginComponent
  ]
})

export class UsersModule { }
