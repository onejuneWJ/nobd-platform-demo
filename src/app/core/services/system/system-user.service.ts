import {Injectable} from '@angular/core';
import {PageRequest, PageResult} from '@entity/common/page';
import {Observable} from 'rxjs';
import {SysUser} from '@entity/system/SysUser';
import {BaseService} from '../base/base.service';
import {SysRole} from '@entity/system/SysRole';
import {RequestOption} from '@entity/common/request-option';
import {baseRequestUrl} from '@shared/utils/Constants';

@Injectable({providedIn: 'root'})
export class SystemUserService {
  requestUrl = baseRequestUrl + '/user';

  constructor(
    private baseService: BaseService
  ) {
  }

  page(pageRequest: PageRequest, where: any): Observable<PageResult<SysUser>> {
    return this.baseService.pageSelect(this.requestUrl, where, pageRequest);
  }

  allocationRole(userId: number, roleList: SysRole[]): Observable<any> {
    const option = new RequestOption();
    option.isJsonRequest = true;
    return this.baseService.post(this.requestUrl + `/allocationRole/${userId}`, roleList, option);
  }

  insertOrUpdate(data: SysUser, method: string): Observable<any> {
    return this.baseService.insertOrUpdate(this.requestUrl, data, method);
  }

  delete(id: number): Observable<any> {
    return this.baseService.delete(this.requestUrl + `/${id}`);
  }

  validateUsername(value: any, userId?: number): Observable<any> {
    const option = new RequestOption();
    option.setParams('username', value)
      .setParams('userId', userId);
    return this.baseService.get(this.requestUrl + '/validateUsername', option);
  }

  getLoginUser(): Observable<SysUser> {
    return this.baseService.get(this.requestUrl + '/loginUser');
  }

  enable(userId: number, flag: boolean): Observable<any> {
    const option = new RequestOption();
    option.setParams('flag', flag);
    return this.baseService.get(this.requestUrl + `/enable/${userId}`, option);
  }

  detail(userId: string): Observable<any> {
    return this.baseService.get(this.requestUrl + `/${userId}`);
  }
}
