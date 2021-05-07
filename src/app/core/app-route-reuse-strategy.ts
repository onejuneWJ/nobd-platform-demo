import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class AppRouteReuseStrategy implements RouteReuseStrategy {
  public static handlers: { [key: string]: DetachedRouteHandle } = {};
  public static waitDelete: string;

  public static clearRouteSnapshot(): void {
    AppRouteReuseStrategy.handlers = {};
  }

  /** 删除缓存路由快照的方法 */
  public static deleteRouteSnapshot(path: string, hash): void {
    const name = path.replace(/\//g, '_') + '_' + hash;
    if (AppRouteReuseStrategy.handlers[name]) {
      delete AppRouteReuseStrategy.handlers[name];
    } else {
      AppRouteReuseStrategy.waitDelete = name;
    }
  }

  /** 使用route的path作为快照的key */
  private static getRouteUrl(route: ActivatedRouteSnapshot): string {
    // @ts-ignore
    return route._routerState.url.replace(/\//g, '_') + '_' + (route.data.hash);
  }

  /** 表示对所有路由允许复用 如果你有路由不想利用可以在这加一些业务逻辑判断 */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // console.log('shouldDetach======>', route);
    return route.data.reload;
    // if (!route.routeConfig || route.routeConfig.loadChildren) {
    //   return false;
    // }
    // return true;
  }

  /** 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象 */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (AppRouteReuseStrategy.waitDelete && AppRouteReuseStrategy.waitDelete === AppRouteReuseStrategy.getRouteUrl(route)) {
      // 如果待删除是当前路由则不存储快照
      AppRouteReuseStrategy.waitDelete = null;
      return;
    }
    AppRouteReuseStrategy.handlers[AppRouteReuseStrategy.getRouteUrl(route)] = handle;
  }

  /** 若 path 在缓存中有的都认为允许还原路由 */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // console.log('shouldAttach======>', route);
    return !!AppRouteReuseStrategy.handlers[AppRouteReuseStrategy.getRouteUrl(route)];
  }

  /** 从缓存中获取快照，若无则返回nul */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    // console.log('retrieve======>', route);
    if (!AppRouteReuseStrategy.handlers[AppRouteReuseStrategy.getRouteUrl(route)]) {
      return null;
    }

    return AppRouteReuseStrategy.handlers[AppRouteReuseStrategy.getRouteUrl(route)];
  }

  /** 进入路由触发，判断是否同一路由 */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // console.log('shouldReuseRoute======>', future, curr);
    return future.routeConfig === curr.routeConfig &&
      JSON.stringify(future.params) === JSON.stringify(curr.params);
  }

}
