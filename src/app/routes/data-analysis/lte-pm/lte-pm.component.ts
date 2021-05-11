import { Component, OnInit } from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {NzUploadChangeParam} from "ng-zorro-antd/upload";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-lte-pm',
  templateUrl: './lte-pm.component.html',
  styleUrls: ['./lte-pm.component.css']
})
export class LtePmComponent implements OnInit {

  tableLoading = false;
  url: string = "src/file"
  dataList: any[] = [];
  tableDataList: any[] = [];
  accessOption: any;
  keepOption: any;
  moveOption: any;
  selectForm!: FormGroup;


  constructor(private message: NzMessageService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.selectForm = this.fb.group({
      date: [new Date(), [Validators.required]],
    });

    for (let i = 0; i < 30; i++) {
      this.tableDataList = [
        ...this.tableDataList,
        {
          id: i+1,
          area: '双流A'+i+'区',
          access: i % 2 === 0 ? "优" : "差",
          keep: i % 2 === 0 ? "优" : "差",
          move: i % 2 === 0 ? "优" : "差",
        }
      ];
    }
    this.dataList = this.tableDataList;

    this.statisticsAccessOpt();
    this.statisticsKeepOpt();
    this.statisticsMoveOpt();
  }


  handleChange(info: NzUploadChangeParam): void {
    if (info.type === 'start') {
      this.message.info('正在导入数据，请耐心等待', {nzDuration: 0});
      this.tableLoading = true;
    }
    if (info.file.status === 'done') {
      this.message.remove();
      this.message.success(`导入成功`);
      this.tableLoading = false;
    } else if (info.file.status === 'error') {
      this.message.remove();
      this.message.error(`导入失败：${info.file.error.error.message}!`);
      this.tableLoading = false;
    }
  }

  statisticsAccessOpt(): void {
    this.accessOption = {
      title: {
        text: '接入性',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '个数',
          type: 'pie',
          radius: '50%',
          data: [
            {value: 348, name: '优'},
            {value: 135, name: '良'},
            {value: 30, name: '差'},
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
  statisticsKeepOpt(): void {
    this.keepOption = {
      title: {
        text: '保持性',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '个数',
          type: 'pie',
          radius: '50%',
          data: [
            {value: 320, name: '优'},
            {value: 156, name: '良'},
            {value: 13, name: '差'},
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
  statisticsMoveOpt(): void {
    this.moveOption = {
      title: {
        text: '移动性',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '个数',
          type: 'pie',
          radius: '50%',
          data: [
            {value: 312, name: '优'},
            {value: 175, name: '良'},
            {value: 20, name: '差'},
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  search() : void {

  }

}
