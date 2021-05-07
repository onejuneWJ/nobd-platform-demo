import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-error-403',
  template: `
    <nz-result nzStatus="403" nzTitle="403" nzSubTitle="抱歉，你没有权限访问！">
      <div nz-result-extra>
        <button nz-button nzType="primary">Back Home</button>
      </div>
    </nz-result>
  `
})

export class Error403Component implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
