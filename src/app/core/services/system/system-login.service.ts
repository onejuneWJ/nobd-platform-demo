import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {SysUser} from '@entity/system/SysUser';
import {BaseService} from '@services/base/base.service';
import {differenceInMilliseconds, format} from 'date-fns';
import {baseRequestUrl, Constants} from '@shared/utils/Constants';
import {SystemUserService} from './system-user.service';
import {SystemMenuService} from './system-menu.service';
import {MainService} from '../main/main.service';
import {NzMessageService} from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class SystemLoginService {
  requestUrl = baseRequestUrl + '/user';

  constructor(
    private router: Router,
    private baseService: BaseService,
    private message: NzMessageService,
    public userService: SystemUserService,
    private mainService: MainService,
    private menuService: SystemMenuService,
  ) {
  }

  login(user: SysUser): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.baseService.post(this.requestUrl + '/login', user)
        .subscribe((res: any) => {
          if (res) {
            sessionStorage.setItem(Constants.tokenKey, res.token);
            sessionStorage.setItem(Constants.tokenExpiredKey, format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
            this.getLoginUser();
            this.getUserMenu().then(() => {
              resolve();
              this.router.navigateByUrl('/index').then(() => {
                this.message.success('登陆成功');
              });
            });
          }
          reject();
        }, () => reject());
    });
  }

  getLoginUser(): void {
    this.userService.getLoginUser().subscribe(res => {
      if (res) {
        sessionStorage.setItem(Constants.currentUserKey, JSON.stringify(res));
      }
    });
  }

  getToken(): string {
    return sessionStorage.getItem(Constants.tokenKey);
  }

  redirectLogin(): void {
    this.router.navigateByUrl('/login').then(() => {
    });
  }

  isLogin(): boolean {
    const authToken = sessionStorage.getItem(Constants.tokenKey);
    const loginTime = sessionStorage.getItem(Constants.tokenExpiredKey);
    const date = new Date(loginTime);
    // 当前时间减'登录时间'
    const df = differenceInMilliseconds(new Date(), date);
    const expired = df > (30 * 60 * 1000); // 过期时间30分钟
    return (authToken !== '' && !expired);
  }

  logout(): void {
    sessionStorage.clear();
    this.redirectLogin();
  }

  getUserMenu(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.menuService.userMenu().subscribe(data => {
        this.mainService.changeMenus(data);
        resolve(true);
      });
    });
  }
}
