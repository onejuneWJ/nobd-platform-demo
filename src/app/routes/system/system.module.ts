import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from './menu/menu.component';
import {RoleComponent} from './role/role.component';
import {UserComponent} from './user/user.component';
import {UserDetailComponent} from './user/user-detail/user-detail.component';
import {ResourceComponent} from './resource/resource.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '@shared/Shared.Module';
import {CoreModule} from '@core/core.module';

const routes: Routes = [
  {
    path: '', redirectTo: 'menu', pathMatch: 'full'
  },
  {
    path: 'menu', component: MenuComponent,
    data: {
      reload: true,
      hash: 'xtgl-cdgl'
    }
  },
  {
    path: 'role',
    component: RoleComponent,
    data: {
      reload: true,
      hash: 'xtgl-jsgl'
    }
  },
  {
    path: 'user',
    children: [
      {
        path: '',
        component: UserComponent,
        data: {
          reload: true,
          hash: 'xtgl-yhgl'
        },
      },
      {
        path: 'detail/:id',
        component: UserDetailComponent,
        data: {
          reload: false,
          hash: 'xtgl-yhgl-detail'
        },
      },
    ]
  },
  {
    path: 'resource',
    component: ResourceComponent,
    data: {
      reload: true,
      hash: 'xtgl-sjqx'
    }
  },
];

@NgModule({
  declarations: [
    UserComponent,
    UserDetailComponent,
    RoleComponent,
    ResourceComponent,
    MenuComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    CoreModule
  ]
})

export class SystemModule {
}
