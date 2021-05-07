import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appBtnType]'
})
export class BtnTypeDirective implements OnInit {

  @Input('appBtnType') btnType: 'create' | 'export';

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    if (this.btnType === 'create') {
      this.el.nativeElement.innerHTML = '<i nz-icon nzType="plus"></i>新建';
    } else if (this.btnType === 'export') {
      this.el.nativeElement.nzType = 'default';
      this.el.nativeElement.innerHTML = `<i nz-icon nzType="download"></i>导出`;
    }
  }
}
