import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-error-404',
  template: `
    <nz-result nzStatus="404" nzTitle="404" nzSubTitle="页面未找到">
      <div nz-result-extra>
        <button nz-button nzType="primary" routerLink="/index">返回首页</button>
      </div>
    </nz-result>
  `
})

export class Error404Component implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
