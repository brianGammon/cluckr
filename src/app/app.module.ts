import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireDatabaseModule } from 'angularfire2/database';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = environment.firebaseConfig;


import { SharedModule } from './shared/shared.module';
import { SwRegistrationService } from './shared/services/sw-registration.service';
import { FlocksModule } from './flocks/flocks.module';
import { EggsModule } from './eggs/eggs.module';
import { ChickensModule } from './chickens/chicken.module';
import { UsersModule } from './users/users.module';

export function init(swRegistrationService: SwRegistrationService) {
  return () => swRegistrationService.init();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    SharedModule,
    FlocksModule,
    EggsModule,
    ChickensModule,
    UsersModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [
    {
      'provide': APP_INITIALIZER,
      'useFactory': init,
      'deps': [SwRegistrationService],
      'multi': true
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
