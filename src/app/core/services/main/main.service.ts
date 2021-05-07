import {Injectable} from '@angular/core';
import {SysMenu} from '../../../entity/system/SysMenu';
import {Subject} from 'rxjs';
import {Constants} from '../../../shared/utils/Constants';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  constructor() {
  }

  // 菜单订阅
  public sMenus = new Subject<SysMenu[]>();
  public menus = this.sMenus.asObservable();

  /**
   * 当用户分配角色时、角色被分配菜单时，需要刷新导航菜单，调用此方法
   * 改变菜单
   * @param menus 菜单
   */
  changeMenus(menus: SysMenu[]): void {
    this.sMenus.next(menus);
    sessionStorage.setItem(Constants.currentUserMenuKey, '');
    sessionStorage.setItem(Constants.currentUserMenuKey, JSON.stringify(menus));
  }

}
