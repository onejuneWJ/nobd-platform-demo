import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {SystemLoginService} from '../system/system-login.service';
import {Constants} from '@shared/utils/Constants';
import {MainService} from '../main/main.service';
import {SysMenu} from '@entity/system/SysMenu';
import {Observable} from 'rxjs';
import {SystemMenuService} from '../system/system-menu.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private loginService: SystemLoginService,
    public mainService: MainService,
    public menuService: SystemMenuService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = `/${route.url}`;
    if (url.indexOf('login') >= 0) {
      return true;
    }
    return this.checkLogin();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url = `${state.url}`;
    return this.checkPermission(url);
  }

  checkLogin(): boolean {
    if (this.loginService.isLogin()) {
      return true;
    } else {
      this.loginService.redirectLogin();
      sessionStorage.clear();
    }
    return false;
  }

  checkPermission(url: string): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      if (url === '/') {
        subscriber.next(true);
        subscriber.complete();
        return;
      }
      let flag = this.checkLogin();
      // 获取当前登录用户的菜单
      const menus = JSON.parse(sessionStorage.getItem(Constants.currentUserMenuKey));
      flag = this.checkUrl(menus, url, flag);

      if (!flag) {
        this.router.navigateByUrl('403').then(() => {
        });
      }
      subscriber.next(flag);
      subscriber.complete();
    });
  }

  checkUrl(menus: SysMenu[], url: string, flag: boolean): boolean {
    for (const value of menus) {
      if (!flag) {
        if (value.path === url) {
          flag = true;
          return flag;
        } else {
          flag = this.checkUrl(value.childrenList, url, flag);
        }
      }else {
        return flag;
      }
    }
    return flag;
  }


}
