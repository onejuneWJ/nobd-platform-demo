import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  @Input() title = '导出';
  @Input() url: string;
  @Input() headers: any;
  @Input() params: any;


  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }

  ngOnInit(): void {
  }

  export(): void {
    const option = {
      headers: this.headers,
      params: this.params,
      responseType: 'blob' as const,
      observe: 'response' as const,
    };
    this.http.get(this.url, option).subscribe(response => {
      if (response.ok) {
        download(response);
      }
    }, error => {
      this.message.remove();
      const reader = new FileReader();
      reader.onload = (readRes: any) => {
        this.message.error(JSON.parse(readRes.target.result).message || '导出失败');
      };
      reader.readAsText(error.error);
    });
  }

  setParam(params: any): void {
    this.params = params;
  }
}

export function download(response: HttpResponse<any>): void {
  const contentDisposition = decodeURI(response.headers.get('content-disposition'));
  const fileName = contentDisposition.substring(contentDisposition.indexOf('=') + 1);
  const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const blob = new Blob([response.body], {type: contentType});
  const objUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objUrl;
  a.download = decodeURIComponent(fileName);
  a.click();
  window.URL.revokeObjectURL(objUrl);
}
