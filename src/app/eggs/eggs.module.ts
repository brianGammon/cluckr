import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { EggsDailyComponent } from './eggs-daily/eggs-daily.component';
import { EggsAddComponent } from './eggs-add/eggs-add.component';


@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    EggsDailyComponent,
    EggsAddComponent
  ]
})

export class EggsModule { }
