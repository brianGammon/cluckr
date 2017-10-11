import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserService, FlockService, ChickenService, EggService } from './services';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { TopNavComponent } from './top-nav/top-nav.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  providers: [
    UserService,
    FlockService,
    ChickenService,
    EggService
  ],
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
