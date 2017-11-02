import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { CalendarModule } from 'angular-calendar';

import { EggsDailyComponent } from './eggs-daily/eggs-daily.component';
import { EggsMonthlyComponent } from './eggs-monthly/eggs-monthly.component';
import { EggEditorComponent } from './egg-editor/egg-editor.component';


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
    EggsMonthlyComponent,
    EggEditorComponent
  ]
})

export class EggsModule { }
