import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';

import { UserLoginComponent } from './users/user-login/user-login.component';
import { EggsDailyComponent } from './eggs/eggs-daily/eggs-daily.component';
import { EggsMonthlyComponent } from './eggs/eggs-monthly/eggs-monthly.component';
import { EggsAddComponent } from './eggs/eggs-add/eggs-add.component';
import { ChickenProfileComponent } from './chickens/chicken-profile/chicken-profile.component';
import { FlocksComponent } from './flocks/flocks/flocks.component';
import { FlockComponent } from './flocks/flock/flock.component';
import { ChickenAddComponent } from './chickens/chicken-add/chicken-add.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/flock', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent, },
  { path: 'eggs/day/:date', component: EggsDailyComponent, canActivate: [AuthGuard]},
  { path: 'eggs/month/:date', component: EggsMonthlyComponent, canActivate: [AuthGuard]},
  { path: 'chicken/add', component: ChickenAddComponent, canActivate: [AuthGuard] },
  { path: 'chicken/edit/:chickenId', component: ChickenAddComponent, canActivate: [AuthGuard] },
  { path: 'chicken/:chickenId', component: ChickenProfileComponent, canActivate: [AuthGuard] },
  { path: 'flocks', component: FlocksComponent, canActivate: [AuthGuard] },
  { path: 'flock', component: FlockComponent, canActivate: [AuthGuard] },
  { path: 'add', component: EggsAddComponent, canActivate: [AuthGuard]},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
