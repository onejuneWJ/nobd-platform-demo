import {Directive, ElementRef, HostListener, Input} from '@angular/core';

/**
 * 限制输入框输入内容类型
 * number：此输入框只能输入数字
 * alphabet：此输入框只能输入字母
 * lower：此输入框只能输入小写字母
 * upper：此输入框只能输入大写字母
 */
@Directive({
  selector: '[appInputType]'
})
export class InputTypeDirective {

  @Input('appInputType') type: 'number' | 'alphabet' | 'lower' | 'upper' | string;

  @HostListener('input') onInput(): void {
    switch (this.type) {
      case 'alphabet':
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^a-zA-Z]/g, '');
        break;
      case 'lower':
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^a-z]/g, '');
        break;
      case 'upper':
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Z]/g, '');
        break;
      case 'number':
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^\d]/g, '');
        break;
      default:
        break;
    }
  }

  constructor(
    private el: ElementRef
  ) {
  }

}
