import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from './auth.service';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { TopNavComponent } from './top-nav/top-nav.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';


@NgModule({
  providers: [AuthService],
  imports: [
    CommonModule,
    RouterModule,
    AngularFireAuthModule
  ],
  declarations: [
    LoadingSpinnerComponent,
    TopNavComponent
  ],
  exports: [
    LoadingSpinnerComponent,
    TopNavComponent
  ]
})
export class SharedModule { }
