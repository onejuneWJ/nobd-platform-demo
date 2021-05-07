import {Component, OnDestroy, OnInit} from '@angular/core';
import {SysMenu} from '@entity/system/SysMenu';
import {SystemMenuService} from '@core/services/system/system-menu.service';
import {Router} from '@angular/router';
import {AppRouteReuseStrategy} from '@core/app-route-reuse-strategy';
import {SysUser} from '@entity/system/SysUser';
import {SystemUserService} from '@core/services/system/system-user.service';
import {SystemLoginService} from '@core/services/system/system-login.service';
import {MainService} from '@core/services/main/main.service';
import {Constants} from '@shared/utils/Constants';

import * as _ from 'lodash';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  allMenu: SysMenu[] = [];
  selectedIndex: number; // tab激活的下标
  tabs: any[] = [];
  nowDate: Date = new Date();
  user: SysUser = null;

  constructor(
    private mainService: MainService,
    private menuService: SystemMenuService,
    private userService: SystemUserService,
    private router: Router,
    private loginService: SystemLoginService
  ) {
    setInterval(() => {
      this.refreshTime();
    }, 1000);
  }

  ngOnInit(): void {
    // 加载菜单
    this.loadMenu();
    // 加载用户信息
    this.loadUserInfo();
    AppRouteReuseStrategy.clearRouteSnapshot();
    this.mainService.menus.subscribe(data => {
      this.allMenu = data;
      // 初始化tab标签
      this.initTabs();
    });
  }

  ngOnDestroy(): void {
    this.tabs = [];
  }

  refreshTime(): void {
    this.nowDate = new Date();
  }

  /**
   * 加载菜单
   */
  loadMenu(): void {
    this.menuService.userMenu().subscribe(data => {
      if (data) {
        this.allMenu = data;
        // 初始化tab标签
        this.initTabs();
      }
    });
  }

  addTab(tab: any): void {
    if (!tab) {
      return;
    }
    // 如果tabs列表中没有这个tab就将其添加进去
    if (!this.tabs.some(value => value.path === tab.path)) {
      this.tabs.push({
        title: tab.title,
        path: tab.path,
        hash: tab.hash
      });
    }
    // 当前选中的tab为这个tab，这里没用array.indexOf()，因为indexOf返回永远是-1
    this.tabs.forEach((value, index) => {
      if (value.path === tab.path) {
        this.selectedIndex = index;
      }
    });
    this.refreshSessionStorageTabs();
  }

  selectTab(tab: any): void {
    this.router.navigateByUrl(tab.path).then(() => {
    });
    this.tabs.forEach((value, index) => {
      if (value.path === tab.path) {
        this.selectedIndex = index;
        return;
      }
    });
  }

  closeTab(param: any): void {
    const index = param.index;
    // 在tab数组中找到该下标的tab
    const tab = this.tabs[index];
    // 将此tab从tabs数组中删除
    this.tabs = this.tabs.filter(value => value.path !== tab.path);
    // 删除路由复用
    AppRouteReuseStrategy.deleteRouteSnapshot(tab.path, tab.hash);
    // 如果关闭的tab是当前激活的tab，导航至tabs数组最后一个
    if (index === this.selectedIndex) {
      // 如果tab数组长度>0，
      if (this.tabs.length > 0) {
        const lastTab = this.tabs[this.tabs.length - 1];
        this.router.navigateByUrl(lastTab.path).then(() => {
        });
        this.selectedIndex = this.tabs.length - 1;
      } else {
        // 如果没有tab了导航至首页
        this.router.navigateByUrl('/index').then(() => {
        });
        const indexTab = {title: '首页', path: '/index', hash: 'sy-sy'};
        this.tabs.push(indexTab);
        this.selectedIndex = this.tabs.length - 1;
      }
    }
    this.refreshSessionStorageTabs();
  }

  /**
   * 初始化tab列表，刷新页面时，登录成功时，刷新菜单时
   */
  initTabs(): void {
    // 浏览器地址栏显示的路由
    const route = this.router.routerState.snapshot.url;
    // 存储在sessionStorage中的tabs
    const existTabs: any[] = JSON.parse(sessionStorage.getItem(Constants.tabs));
    // 如果缓存中有tab列表（刷新页面，刷新菜单）
    if (existTabs != null && existTabs.length > 0) {
      this.tabs = [...existTabs];
      const nowTab = existTabs.find(value => value.path === route);
      this.addTab(nowTab);
    } else {
      // 如果缓存中没用tab列表，加载首页信息
      const indexTab = {title: '首页', path: '/index', hash: 'sy-sy'};
      this.addTab(indexTab);
    }
  }

  refreshSessionStorageTabs(): void {
    sessionStorage.removeItem(Constants.tabs);
    sessionStorage.setItem(Constants.tabs, JSON.stringify(this.tabs));
  }

  loadUserInfo(): void {
    this.user = JSON.parse(sessionStorage.getItem(Constants.currentUserKey));
  }

  logout(): void {
    this.loginService.logout();
  }

  collapsedChange(): void {
    const h1 = document.getElementsByClassName('sidebar-logo')[0]?.children[0].children[1];
    const header = document.getElementsByClassName('app-header')[0];
    if (!this.isCollapsed) {
      h1.className = 'sidebar-title-hidden';
      header.className = 'app-header app-header-collapsed';
    } else {
      h1.className = 'sidebar-title-show';
      header.className = 'app-header app-header-no-collapsed';
    }
    this.isCollapsed = !this.isCollapsed;
  }
}
