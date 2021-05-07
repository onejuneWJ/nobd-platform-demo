import {Injectable} from '@angular/core';
import {RequestUtil} from '@shared/utils/RequestUtil';
import {PageRequest, PageResult} from '@entity/common/page';
import {Observable} from 'rxjs';
import {ObjectUtil} from '@shared/utils/ObjectUtil';
import {RequestOption} from '@entity/common/request-option';
import {map} from 'rxjs/operators';
import {Constants} from '@shared/utils/Constants';
import {NzMessageService} from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(private requestUtil: RequestUtil,
              private message: NzMessageService) {
  }

  /**
   * 分页基本方法
   * @param   pageUrl 分页路径
   * @param  where 条件
   * @param  pageRequest 分页参数
   *
   * @return Observable<PageResult<R>>
   */
  pageSelect<R, W extends object>(pageUrl: string, where: W, pageRequest: PageRequest): Observable<PageResult<R>> {
    if (ObjectUtil.isNil(pageUrl)) {
      this.message.warning('查询接口未填写');
      return;
    }
    return this.requestUtil.pageGet<R>(pageUrl, where, pageRequest);
  }

  /**
   * 下载文件，必须是get方法
   * @param url 路径
   * @param where 查询条件
   */
  downLoadFile(url, where: object): void {
    const s = url.substr(url.length - 1, 1);
    if (s !== '?') {
      url = url + '?';
    }
    ObjectUtil.forOwn(where, (value, key) => {
      if (ObjectUtil.isNotNil(value)) {
        url += `&${key}=${value}`;
      }
    });
    url = url.replace('?&', '?');
    window.open(url);
  }

  /**
   * 添加
   * @param apiUrl 添加路径
   * @param param 参数
   * @param options 请求头
   */
  insert<T>(apiUrl: string, param: any, options: RequestOption = new RequestOption()): Observable<T> {
    if (ObjectUtil.isNil(apiUrl)) {
      this.message.warning('添加接口未填写');
    }

    const getPageResult = (data) => {
      const resultMessage = data;
      // 返回结果为空
      if (ObjectUtil.isNil(resultMessage)) {
        return {};
      }
      // 数据必须存在
      if (ObjectUtil.isNotNil(param)) {
        if (resultMessage) {
          this.message.success('添加成功!');
        } else {
          this.message.error('添加失败!');
        }
      }
      return resultMessage;
    };
    return this.requestUtil.insertOrUpdate<T>(apiUrl, param, Constants.POST, options).pipe(map(getPageResult));
  }

  /**
   * 修改
   * @param apiUrl 修改路径
   * @param param 参数
   * @param options 请求头
   */
  update<T>(apiUrl: string, param: any, options: RequestOption = new RequestOption()): Observable<T> {
    if (ObjectUtil.isNil(apiUrl)) {
      this.message.warning('修改接口未填写');
      return;
    }

    const getPageResult = (data) => {
      const resultMessage = data;
      // 返回结果为空
      if (ObjectUtil.isNil(resultMessage)) {
        return {};
      }
      // 数据必须存在
      if (ObjectUtil.isNotNil(param)) {
        if (!resultMessage) {
          this.message.error('修改失败!');
        } else if (resultMessage) {
          this.message.success('修改成功!');
        }
      }
      return resultMessage;
    };
    return this.requestUtil.insertOrUpdate<T>(apiUrl, param, Constants.PUT, options).pipe(map(getPageResult));
  }

  insertOrUpdate<T>(apiUrl: string, param: any, method: string, options: RequestOption = new RequestOption()): Observable<T> {
    if (method === Constants.POST) {
      return this.insert<T>(apiUrl, param, options);
    } else if (method === Constants.PUT) {
      return this.update<T>(apiUrl, param, options);
    } else {
      this.message.warning(`请求方法不支持'${method}'`);
      return;
    }
  }

  /**
   * 删除方法
   */
  delete(deleteUrl: string, options?: RequestOption): Observable<any> {
    if (ObjectUtil.isNil(deleteUrl)) {
      this.message.warning('删除接口未填写');
      return;
    }
    return this.requestUtil.delete<any>(deleteUrl, options)
      .pipe(map((resultMessage) => {
        if (resultMessage.code === 200) {
          this.message.success('删除成功！');
        } else {
          this.message.error(resultMessage.desc || '删除失败');
        }
        return resultMessage;
      }));
  }

  /**
   * post请求方法
   * @param  url 请求url
   * @param  body 参数
   * @param  options 请求头参数
   * @returns Observable<T>
   */
  post<T>(url: string, body?: any, options?: RequestOption): Observable<T> {
    return this.requestUtil.post<T>(url, body, options);
  }

  /**
   * get请求方法
   * @param  url 请求url
   * @param  options 请求头参数，包括查询参数
   * @returns Observable<T>
   */
  get<R>(url: string, options?: RequestOption): Observable<R> {
    return this.requestUtil.get<R>(url, options);
  }

  /**
   * put请求方法
   * @param url 请求url
   * @param body 请求体
   * @param options 请求参数
   */
  put<T>(url: string, body?: any, options?: RequestOption): Observable<T> {
    return this.requestUtil.put<T>(url, body, options);
  }
}

