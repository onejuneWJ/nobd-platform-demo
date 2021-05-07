import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NZ_I18N, zh_CN} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {SharedModule} from '@shared/Shared.Module';
import {LoginModule} from '@routes/login/login.module';
import {httpInterceptorProviders} from '@core/net/interceptor/http-interceptor.service';
import {RouteReuseStrategy} from '@angular/router';
import {AppRouteReuseStrategy} from '@core/app-route-reuse-strategy';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from '@core/core.module';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    LoginModule,
    FormsModule,
    HttpClientModule,
    CoreModule
  ],
  providers: [
    {provide: NZ_I18N, useValue: zh_CN},
    ...httpInterceptorProviders,
    {provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
