import {HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import * as _ from 'lodash';
import {ObjectUtil} from '@shared/utils/ObjectUtil';

/**
 * 请求参数
 * 上传文件需要设置 headers[]
 * <pre>
 *
 *
 *
 *
 *
 * </pre>
 */
export class RequestOption {
  /*{
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}*/
  /**
   * 上传请求头标记
   */
  private static uploadFile = 'isUpload';

  /**
   * 请求头
   */
  headers: HttpHeaders | { [header: string]: string | string[]; } = null;
  /**
   * 请求参数
   */
  params: HttpParams | { [param: string]: string | string[]; } = null;

  /**
   * 观察属性
   */
  observe?: 'body';
  /**
   *
   */
  body?: any;
  /**
   * 监控请求，想要跟踪文件上传或下载的进度，在创建请求对象时，我们需要配置 {reportProgress: true} 参数
   */
  reportProgress = false;
  /**
   * 响应类型
   */
  responseType?: 'json';
  /**
   * 表明在进行跨站 (cross-site) 的访问控制 (Access-Control) 请求时，是否使用认证信息 (例如cookie或授权的header)。默认为 false。注意：这不会影响同站 same-site 请求
   */
  withCredentials = false;

  // 请求是否是json
  isJsonRequest = false;

  /**
   * 是否是上传文件
   * @returns boolean true = 上传文件, false = 不是上传文件
   */
  static isUpload(req: HttpRequest<any>): boolean {
    const isUpload = req.headers.get(RequestOption.uploadFile);
    return ObjectUtil.isNotNil(isUpload) && isUpload === 'true';
  }

  setHeaders(key: string, value: string | string[]): RequestOption {
    if (ObjectUtil.isNil(this.headers)) {
      this.headers = {};
    }
    if (ObjectUtil.isNotNil(key) && ObjectUtil.isNotNil(value)) {
      const obj = {};
      obj[key] = value;
      this.headers = _.merge(this.headers, obj);
    }
    return this;
  }

  /**
   * 开启上传文件
   * @returns RequestOption
   */
  uploadFile(): RequestOption {
    this.setHeaders(RequestOption.uploadFile, 'true');
    return this;
  }

  setBody(body: any): RequestOption {
    this.body = body;
    return this;
  }

  setParams(key: string, value: any): RequestOption {
    if (ObjectUtil.isNil(this.params)) {
      this.params = {};
    }
    if (!(ObjectUtil.isNil(key) && ObjectUtil.isNil(value))) {
      const obj = {};
      obj[key] = value;
      this.params = _.merge(this.params, obj);
    }
    return this;
  }

  /**
   * 使用json的方式请求数据
   */
  requestJson(): RequestOption {
    this.isJsonRequest = true;
    this.setHeaders('Content-Type', 'application/json;charset=utf-8');
    return this;
  }
}
