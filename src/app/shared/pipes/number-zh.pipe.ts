import {Pipe, PipeTransform} from '@angular/core';
import {toNumber} from 'ng-zorro-antd/core/util';
import {formatNumber} from '@angular/common';

/**
 * 将数字转换成带单位
 * 栗子:
 * 123 -> 123
 * 12345->1.2万
 * 127656->12.8万
 * 215666661->2.2亿
 *
 */
@Pipe({
  name: 'numberZh'
})
export class NumberZhPipe implements PipeTransform {

  transform(value: number | string, ...args: string[]): string | number {
    if (value < 10000) {
      return value;
    }
    // value/10000之后四舍五入小于1000 ，转换为x.xx万
    if (value < 9999949) {
      return `${formatNumber((toNumber(value) / 10000), 'zh-CN', '1.0-2')}万`;
    }
    // 999万以上的数据，转换为x.xx亿
    if (value >= 9999949) {
      return `${formatNumber((toNumber(value) / 100000000), 'zh-CN', '1.0-2')}亿`;
    }
    return null;
  }

}
