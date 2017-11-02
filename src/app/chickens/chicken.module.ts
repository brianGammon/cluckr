import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { ChickenEditorComponent } from './chicken-editor/chicken-editor.component';
import { ChickenProfileComponent } from './chicken-profile/chicken-profile.component';


@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    ChickenEditorComponent,
    ChickenProfileComponent
  ]
})

export class ChickensModule { }
