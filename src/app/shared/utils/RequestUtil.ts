import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {PageRequest, PageResult} from '@entity/common/page';
import {ObjectUtil} from './ObjectUtil';
import * as _ from 'lodash';
import {RequestOption} from '@entity/common/request-option';
import {Constants} from './Constants';

@Injectable({providedIn: 'root'})
export class RequestUtil {

  constructor(
    protected httpClient: HttpClient
  ) {

  }

  /**
   * 使用post方法分页查询
   * @param  url 查询路劲
   * @param  where 查询条件
   * @param  pageRequest 分页参数
   * @returns Observable<R> 返回 Observable<PageResult<R>> 分页信息
   */
  pagePost<R>(url: string, where: object, pageRequest: PageRequest): Observable<PageResult<R>> {
    return this.page<R>(url, where, pageRequest, Constants.POST);
  }

  /**
   * 使用get方法分页查询
   * @param  url 查询路劲
   * @param  where 查询条件
   * @param  pageRequest 分页参数
   * @returns Observable<T> 返回 Observable<PageResult<T>> 分页信息
   */
  pageGet<R>(url: string, where: object, pageRequest: PageRequest): Observable<PageResult<R>> {
    return this.page<R>(url, where, pageRequest, Constants.GET);
  }

  /**
   * 分页查询
   * @param  url 查询路劲
   * @param  where 查询条件
   * @param  pageRequest 分页信息
   * @param  method http请求方法
   * @returns Observable<T> 返回 Observable<PageResult<T>> 分页信息
   */
  page<R>(url: string, where: object, pageRequest: PageRequest, method: string = Constants.GET): Observable<PageResult<R>> {
    // 分页结果
    const getPageResult = (data: any) => {
      return ObjectUtil.isNil(data) ? {} : data;
    };
    const requestOptions = new RequestOption();
    requestOptions.params = _.merge(ObjectUtil.filterEmpty(where), ObjectUtil.filterEmpty(pageRequest));
    if (_.eq(method, Constants.GET)) {
      return this.get<R>(url, requestOptions).pipe(map(getPageResult));
    } else if (_.eq(method, Constants.POST)) {
      return this.post<R>(url, requestOptions).pipe(map(getPageResult));
    }
  }

  insertOrUpdate<R>(url: string, param: any, method: string, options?: RequestOption): Observable<R> {
    param = ObjectUtil.filterEmpty(param);

    if (ObjectUtil.isNil(method) || _.eq(method, Constants.POST)) {
      return this.post<R>(url, param, options);
    } else {
      return this.put<R>(url, param, options);
    }
  }


  /**
   * 使用 http post方法请求
   * @param url 路径
   * @param body 请求体
   * @param options RequestOption
   * @returns Observable<T> 返回 Observable<T> 类型的数据
   */
  post<T>(url: string, body?: any, options?: RequestOption): Observable<T> {
    if (ObjectUtil.isNil(body)) {
      body = null;
    }
    if (options == null || !options.uploadFile()) {
      const isJson = options != null && options.isJsonRequest;
      return this.httpClient.post<T>(url, isJson ? body : ObjectUtil.filterEmpty(body), options);
    } else {
      return this.httpClient.post<T>(url, body, options);
    }
  }

  /**
   * 使用 http get方法请求
   * @param url 请求地址
   * @param options RequestOption
   * @returns Observable<ResponseData<T>> 返回 Observable<ResponseData<T>> 类型的数据
   */
  get<T>(url: string, options?: RequestOption): Observable<any> {

    return this.httpClient.get<T>(url, ObjectUtil.filterEmpty(options));
  }

  put<T>(url: string, body?: any, options?: RequestOption): Observable<T> {
    return this.httpClient.put<T>(url, body, options);
  }

  delete<T>(url: string, options?: RequestOption): Observable<T> {
    return this.httpClient.delete<T>(url, options);
  }
}
