import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { CalendarModule } from 'angular-calendar';

import { EggsDailyComponent } from './eggs-daily/eggs-daily.component';
import { EggsMonthlyComponent } from './eggs-monthly/eggs-monthly.component';
import { EggsAddComponent } from './eggs-add/eggs-add.component';


@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CalendarModule.forRoot()
  ],
  declarations: [
    EggsDailyComponent,
    EggsAddComponent,
    EggsMonthlyComponent
  ]
})

export class EggsModule { }
