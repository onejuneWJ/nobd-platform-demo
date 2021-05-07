import {FormGroup} from '@angular/forms';
import * as _ from 'lodash';

export class ObjectUtil {

  /**
   * 过滤掉空值，undefined or null
   * @param object object
   * @returns any any
   */
  static filterEmpty(object?: any): any {
    let newParam = {};
    if (!ObjectUtil.isNil(object)) {
      // 创建空对象
      newParam = {};
      // 过滤掉空值
      _.reduce(object, (result, value, key) => {
        if (ObjectUtil.isNotNil(value)) {
          result[key] = value;
        }
        return result;
      }, newParam);
    }
    return newParam;
  }

  /**
   * 为 null和undefined
   * @param obj obj
   * @returns boolean value is null | undefined
   */
  static isNil(obj: any): boolean {
    return _.isNil(obj);
  }

  /**
   * 不为 null和undefined
   * @param obj obj
   * @returns boolean value is null | undefined
   */
  static isNotNil(obj: any): boolean {
    return !_.isNil(obj);
  }

  /**
   * 是否不为 null和undefined
   * @param obj obj
   */
  static isAllNotNil(...obj: any[]): boolean {
    if (ObjectUtil.isNotNil(obj)) {
      for (const an of obj) {
        if (ObjectUtil.isNil(an)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * 两个对象判断是否相等，严格比较
   * 注意：数字需要使用 parseInt() 进行转换，如果不转换比较不成功
   */
  static eq(value: any, other: any): boolean {
    return _.eq(value, other);
  }

  /**
   * 对对象进行循环处理
   * @param object a
   * @param iterator a
   */
  static forOwn<T>(object: T, iterator?: ObjectIterator<T, any>): T {
    return _.forOwn(object, iterator);
  }

  static formValidity(formGroup: FormGroup): boolean {
    ObjectUtil.forOwn(formGroup.controls, (value, index) => {
      value.markAsDirty();
      value.updateValueAndValidity();
      // console.log(`${index} ,  value =  ${value.value}, validity = ${value.valid}`)
    });
    return formGroup.valid;
  }
}

export class StringUtil {

  static strEmpty(str: string): boolean {
    return (ObjectUtil.isNil(str) || str.trim() === '');
  }

  static strNotEmpty(str: string): boolean {
    return ObjectUtil.isNotNil(str) && str !== '' && str.trim() !== '';
  }

}

type ObjectIterator<TObject, TResult> = (value: TObject[keyof TObject], key: string, collection: TObject) => TResult;
