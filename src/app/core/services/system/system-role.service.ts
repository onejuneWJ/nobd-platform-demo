import {Injectable} from '@angular/core';
import {BaseService} from '@services/base/base.service';
import {SysRole} from '@entity/system/SysRole';
import {PageRequest, PageResult} from '@entity/common/page';
import {Observable} from 'rxjs';
import {RequestOption} from '@entity/common/request-option';
import {ObjectUtil} from '@shared/utils/ObjectUtil';
import {baseRequestUrl} from '@shared/utils/Constants';

@Injectable({providedIn: 'root'})
export class SystemRoleService {
  requestUrl = baseRequestUrl + '/role';

  constructor(
    private baseService: BaseService
  ) {
  }

  page(where: any, pageRequest: PageRequest): Observable<PageResult<SysRole>> {
    return this.baseService.pageSelect(this.requestUrl + '/page', where, pageRequest);
  }

  list(where: any): Observable<SysRole[]> {
    const option = new RequestOption();
    option.params = ObjectUtil.filterEmpty(where);
    return this.baseService.get(this.requestUrl, option);
  }

  listByUser(id: number): Observable<SysRole[]> {
    const option = new RequestOption();
    // @ts-ignore
    option.params = {userId: id};
    return this.baseService.get(this.requestUrl + '/user', option);
  }

  insertOrUpdate(role: SysRole, method: string): Observable<any> {
    return this.baseService.insertOrUpdate(this.requestUrl, role, method);
  }

  allocationMenu(roleId: number, menuList: any[]): Observable<any> {
    const option = new RequestOption();
    option.requestJson();
    return this.baseService.post(this.requestUrl + `/allocationMenu/${roleId}`, menuList, option);
  }

  enable(roleId: any, flag: boolean): Observable<any> {
    const option = new RequestOption();
    option.setParams('flag', flag);
    return this.baseService.get(this.requestUrl + `/enable/${roleId}`, option);
  }

  delete(id: number): Observable<any> {
    return this.baseService.delete(this.requestUrl + `/${id}`);
  }
}
