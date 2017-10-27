import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ng2ImgMaxModule } from 'ng2-img-max';

import { UserService, FlockService, ChickenService, EggService, UploadService, ImageService } from './services';
import { SwRegistrationService } from './services/sw-registration.service';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { TopNavComponent } from './top-nav/top-nav.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';

@NgModule({
  providers: [
    UserService,
    FlockService,
    ChickenService,
    EggService,
    UploadService,
    ImageService,
    SwRegistrationService
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularFireAuthModule,
    Ng2ImgMaxModule
  ],
  declarations: [
    LoadingSpinnerComponent,
    TopNavComponent,
    PageNotFoundComponent,
    ImageViewerComponent
  ],
  exports: [
    LoadingSpinnerComponent,
    TopNavComponent,
    PageNotFoundComponent,
    ImageViewerComponent
  ]
})
export class SharedModule { }
