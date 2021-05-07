import {Injectable} from '@angular/core';
import {BaseService} from '@core/services/base/base.service';
import {SysMenu} from '@entity/system/SysMenu';
import {Observable} from 'rxjs';
import {PageRequest, PageResult} from '@entity/common/page';
import {RequestOption} from '@entity/common/request-option';
import {baseRequestUrl} from '@shared/utils/Constants';

@Injectable({
  providedIn: 'root'
})
export class SystemMenuService {

  requestUrl = baseRequestUrl + '/menu';

  constructor(private baseService: BaseService) {
  }

  list(menu: SysMenu, pageRequest: PageRequest): Observable<PageResult<SysMenu>> {
    return this.baseService.pageSelect<SysMenu, object>(this.requestUrl, menu, pageRequest);
  }

  create(menu: SysMenu): Observable<SysMenu> {
    return this.baseService.insert<SysMenu>(this.requestUrl, menu);
  }

  tree(): Observable<SysMenu[]> {
    return this.baseService.get<SysMenu[]>(this.requestUrl + `/tree`);
  }

  enable(menuId: number, flag: boolean): Observable<any> {
    const option = new RequestOption();
    option.setParams('flag', flag);
    return this.baseService.get(this.requestUrl + `/enable/${menuId}`, option);
  }

  delete(id: number): Observable<any> {
    return this.baseService.delete(this.requestUrl + `/${id}`);
  }

  getRoots(): Observable<SysMenu[]> {
    return this.baseService.get(this.requestUrl + `/roots`);
  }

  detail(id: number): Observable<SysMenu> {
    return this.baseService.get(this.requestUrl + `/${id}`);
  }

  update(data: SysMenu): Observable<any> {
    return this.baseService.update(this.requestUrl, data);
  }

  userMenu(): Observable<SysMenu[]> {
    return this.baseService.get<SysMenu[]>(this.requestUrl + `/userMenu`);
  }

  listByRole(roleId: number): Observable<SysMenu[]> {
    const option = new RequestOption();
    option.setParams('roleId', roleId);
    return this.baseService.get(this.requestUrl + '/listByRole', option);
  }
}
