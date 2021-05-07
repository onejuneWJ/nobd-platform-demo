import {Injectable} from '@angular/core';
import {BaseService} from '@services/base/base.service';
import {Observable} from 'rxjs';
import {baseRequestUrl} from '@shared/utils/Constants';
import {PageRequest} from '@entity/common/page';

@Injectable({providedIn: 'root'})
export class SystemResourceService {
  requestUrl = baseRequestUrl + '/resource';

  constructor(private baseService: BaseService) {
  }

  page(where: any, pageRequest: PageRequest): Observable<any> {
    return this.baseService.pageSelect(this.requestUrl, where, pageRequest);
  }

  listApis(): Observable<any> {
    return this.baseService.get(this.requestUrl + '/listApis');
  }

  refreshApis(): Observable<any> {
    return this.baseService.get(this.requestUrl + '/refreshApi');
  }
}
