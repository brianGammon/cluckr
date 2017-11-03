import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';

import { UserLoginComponent } from './users/user-login/user-login.component';
import { EggsDailyComponent } from './eggs/eggs-daily/eggs-daily.component';
import { EggsMonthlyComponent } from './eggs/eggs-monthly/eggs-monthly.component';
import { EggEditorComponent } from './eggs/egg-editor/egg-editor.component';
import { ChickenProfileComponent } from './chickens/chicken-profile/chicken-profile.component';
import { FlocksComponent } from './flocks/flocks/flocks.component';
import { FlockComponent } from './flocks/flock/flock.component';
import { ChickenEditorComponent } from './chickens/chicken-editor/chicken-editor.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/flock', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent, },
  { path: 'egg/add', component: EggEditorComponent, canActivate: [AuthGuard]},
  { path: 'egg/edit/:eggId', component: EggEditorComponent, canActivate: [AuthGuard]},
  { path: 'eggs/day/:date', component: EggsDailyComponent, canActivate: [AuthGuard]},
  { path: 'eggs/month/:date', component: EggsMonthlyComponent, canActivate: [AuthGuard]},
  { path: 'chicken/add', component: ChickenEditorComponent, canActivate: [AuthGuard] },
  { path: 'chicken/edit/:chickenId', component: ChickenEditorComponent, canActivate: [AuthGuard] },
  { path: 'chicken/:chickenId', component: ChickenProfileComponent, canActivate: [AuthGuard] },
  { path: 'flocks', component: FlocksComponent, canActivate: [AuthGuard] },
  { path: 'flock', component: FlockComponent, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
