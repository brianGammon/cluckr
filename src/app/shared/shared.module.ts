import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ng2ImgMaxModule } from 'ng2-img-max';

import { UserService, FlockService, ChickenService, EggService, UploadService, ImageService } from './services';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { TopNavComponent } from './top-nav/top-nav.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  providers: [
    UserService,
    FlockService,
    ChickenService,
    EggService,
    UploadService,
    ImageService
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularFireAuthModule,
    Ng2ImgMaxModule
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
