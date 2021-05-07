import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {StatusCode} from '@entity/common/StatusCode';
import {SystemLoginService} from '@services/system/system-login.service';
import {Router} from '@angular/router';
import {Constants} from '@shared/utils/Constants';
import {format} from 'date-fns';
import {NzMessageService} from 'ng-zorro-antd/message';

/**
 * 请求拦截器
 */
@Injectable()
export class SimpleHttpClientInterceptorService implements HttpInterceptor {

  constructor(private nzMessage: NzMessageService,
              private loginService: SystemLoginService,
              private router: Router) {
  }

  /**
   *
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    console.log('拦截');
    const authToken = this.loginService.getToken();
    if (authToken !== '') {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + authToken
        },
      });
    }

    return next.handle(req)
      .pipe(
        tap(res => {
          if (res instanceof HttpResponse) {
            if (res.status === StatusCode.NO_CONTENT) {
              this.nzMessage.warning('服务器未返回任何信息');
            }
            return res.body;
          }
          sessionStorage.setItem(Constants.tokenExpiredKey, format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        }, error => {
          this.handleError(error);
          return {};
        })
      );
  }

  /**
   * 处理请求错误信息
   * @returns Observable<never>
   * @param error error
   */
  private handleError(error: HttpErrorResponse): void {
    console.log(error);
    if (error instanceof HttpErrorResponse) {
      if (error.status === StatusCode.UNAUTHORIZED) {
        this.nzMessage.error('未登录或者token已失效！');
        sessionStorage.clear();
        this.loginService.redirectLogin();
      } else if (error.status === StatusCode.FORBIDDEN) {
        this.nzMessage.error('抱歉，你没有权限访问！');
      } else if (error.status === StatusCode.FAILED) {
        this.nzMessage.error(error.error.message || error.message);
      } else if (error.status === StatusCode.NOTFOUND) {
        this.nzMessage.error('接口调用失败，404');
      } else if (error.status === StatusCode.GATEWAY_TIMEOUT) {
        this.nzMessage.error('与服务器连接超时！');
        sessionStorage.clear();
        this.router.navigateByUrl('/error').then(() => {
        });
      } else {
        this.nzMessage.error(error.error.message ? error.error.message : error.message);
      }
    }
  }
}
