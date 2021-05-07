import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {CommonModule} from '@angular/common';
import {IconsProviderModule} from '@shared/modules/icons-provider.module';
import {MainContentComponent} from '@shared/components/main-content/main-content.component';
import {ContentHeaderComponent} from '@shared/components/main-content/content-header/content-header.component';
import {ContentBodyComponent} from '@shared/components/main-content/content-body/content-body.component';
import {Error500Component} from '@shared/components/error/error-500.component';
import {Error404Component} from '@shared/components/error/error-404.component';
import {Error403Component} from '@shared/components/error/error-403.component';
import {LovComponent} from '@shared/components/lov/lov.component';
import {ExportComponent} from '@shared/components/export/export.component';
import {NumberZhPipe} from '@shared/pipes/number-zh.pipe';
import {NumberComponent} from '@shared/components/number/number.component';
import {BtnTypeDirective} from '@shared/directives/btn-type.directive';
import {InputTypeDirective} from '@shared/directives/input-type.directive';
import {NgZorroAntdModule} from '@shared/modules/ng-zorro-antd.module';
import {NgxEchartsModule} from 'ngx-echarts';

const components = [
  MainContentComponent,
  ContentHeaderComponent,
  ContentBodyComponent,
  LovComponent,
  NumberComponent,
  ExportComponent,
  Error500Component,
  Error404Component,
  Error403Component
];
const pipes = [
  NumberZhPipe,
];
const directives = [
  BtnTypeDirective,
  InputTypeDirective
];

@NgModule({
  // 指令
  declarations: [
    [...components],
    [...pipes],
    [...directives]
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IconsProviderModule,
    NgZorroAntdModule,
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
  ],
  exports: [
    [...components],
    [...pipes],
    [...directives],
    // 公共模块
    CommonModule,
    // 表单模块
    FormsModule,
    // 响应式表单
    ReactiveFormsModule,
    // 路由
    RouterModule,
    IconsProviderModule,
    NgZorroAntdModule,
    NgxEchartsModule
  ]
})
export class SharedModule {

}
