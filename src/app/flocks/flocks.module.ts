import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { FlocksComponent } from './flocks/flocks.component';
import { FlockComponent } from './flock/flock.component';


@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule
  ],
  declarations: [
    FlocksComponent,
    FlockComponent
  ]
})
export class FlocksModule { }
