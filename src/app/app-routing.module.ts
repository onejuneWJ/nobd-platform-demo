import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from '@routes/main/main.component';
import {AuthGuardService} from '@core/services/guard/auth-guard.service';
import {Error500Component} from '@shared/components/error/error-500.component';
import {Error403Component} from '@shared/components/error/error-403.component';
import {Error404Component} from '@shared/components/error/error-404.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    // canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        loadChildren: () => import('@routes/routes.module').then(m => m.RoutesModule),
        canActivateChild: [AuthGuardService],
      }
    ]
  },
  {
    path: 'login',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./routes/login/login.module').then(m => m.LoginModule),
  },
  {path: 'error', component: Error500Component},
  {path: '403', component: Error403Component},
  {path: '**', component: Error404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
