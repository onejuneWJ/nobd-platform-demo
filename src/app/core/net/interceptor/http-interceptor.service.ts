import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {SimpleHttpClientInterceptorService} from './simple-http-client-interceptor.service';

/**
 * httpClient 拦截器汇总 <br>
 * 再创建新的拦截器时，就同样把它们添加到 httpInterceptorProviders 数组中，而不用再修改 AppModule。
 * @author wj
 * @create 2020-7-3
 */
export const httpInterceptorProviders = [{provide: HTTP_INTERCEPTORS, useClass: SimpleHttpClientInterceptorService, multi: true}];
