import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {LoginComponent} from './login.component';
import {AuthGuardService} from '@core/services/guard/auth-guard.service';
import {SharedModule} from '@shared/Shared.Module';

const loginRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canLoad: [AuthGuardService]
  }];

/**
 * 登陆模块
 */
@NgModule({
  imports: [
    RouterModule.forChild(loginRoutes),
    SharedModule
  ],
  // 声明模块中组件、指令、管道
  declarations: [LoginComponent]
})
export class LoginModule {

}
