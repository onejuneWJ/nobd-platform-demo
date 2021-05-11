import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {NzUploadChangeParam} from "ng-zorro-antd/upload";
import {HttpClient} from "@angular/common/http";
import * as echarts from "echarts/";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import points from "echarts/types/src/layout/points";


@Component({
  selector: 'app-fifth-generation-mr',
  templateUrl: './fifth-generation-mr.component.html',
  styleUrls: ['./fifth-generation-mr.component.css']
})
export class FifthGenerationMrComponent implements OnInit {

  listOfColumn = [
    {
      title: '序号',
      compare: null,
      priority: false
    },
    {
      title: '区域',
      compare: null,
      priority: false
    },

    {
      title: 'MR覆盖率',
      compare: (a: any, b: any) => a.mrCoverageRate - b.mrCoverageRate,
      priority: false,
      flag: true
    },
    {
      title: '弱覆盖小区占比',
      compare: (a: any, b: any) => a.weakCoverageVillage - b.weakCoverageVillage,
      priority: false,
      flag: true
    },
    {
      title: '同频重叠覆盖度平均值',
      compare: (a: any, b: any) => a.SameFrequencyCoverageAvg - b.SameFrequencyCoverageAvg,
      priority: false,
      flag: true
    },
  ];

  tableLoading = false;
  url: string = "src/file";
  dataList: any[] = [];
  tableDataList: any[] = [];
  mrOption: any;
  weakOption: any;
  sameOption: any;
  option = 'mrCoverageRate';
  selectForm!: FormGroup;


  constructor(private message: NzMessageService, private http: HttpClient, private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.selectForm = this.fb.group({
      date: [new Date(), [Validators.required]],
    });

    for (let i = 0; i < 30; i++) {
      this.tableDataList = [
        ...this.tableDataList,
        {
          id: i + 1,
          area: '双流A' + i + '区',
          mrCoverageRate: Math.random() + 86.2,
          weakCoverageVillage: Math.random() + 15.6,
          SameFrequencyCoverageAvg: Math.random() + 12.2,
        }
      ];
    }
    this.dataList = this.tableDataList;
    this.mapChart(this.option);
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

  mapChart(select: string): void {
    let datas: any[] = [];
    for (let i = 0; i < 15000; i++) {

      datas = [...datas, [Math.random() * 0.1 + 104, Math.random() * 0.1 + 30.7, 1]];
    }
    for (let i = 0; i < 15000; i++) {

      datas = [...datas, [Math.random() * 0.1 + 104, Math.random() * 0.1 + 30.6, 1]];
    }
    for (let i = 0; i < 15000; i++) {

      datas = [...datas, [Math.random() * 0.1 + 103.9, Math.random() * 0.1 + 30.6, 1]];
    }
    for (let i = 0; i < 15000; i++) {

      datas = [...datas, [Math.random() * 0.1 + 104.1, Math.random() * 0.1 + 30.6, 1]];
    }
    for (let i = 0; i < 15000; i++) {

      datas = [...datas, [Math.random() * 0.1 + 104.1, Math.random() * 0.1 + 30.7, 1]];
    }
    if (select === 'mrCoverageRate') {
      this.mrOption = {
        animation: false,
        bmap: {
          center: [104.065735, 30.659462],
          zoom: 14,
          roam: true
        },
        visualMap: {
          show: false,
          top: 'top',
          min: 0,
          max: 5,
          seriesIndex: 0,
          calculable: true,
          inRange: {
            color: ['blue', 'blue', 'green', 'yellow', 'red']
          }
        },
        series: [{
          type: 'heatmap',
          coordinateSystem: 'bmap',
          data: datas,
          pointSize: 7,
          blurSize: 6
        }]
      }
    } else if (select === 'weakCoverageVillage') {
      this.weakOption = {
        animation: false,
        bmap: {
          center: [104.065735, 30.659462],
          zoom: 14,
          roam: true
        },
        visualMap: {
          show: false,
          top: 'top',
          min: 0,
          max: 5,
          seriesIndex: 0,
          calculable: true,
          inRange: {
            color: ['blue', 'blue', 'green', 'yellow', 'red']
          }
        },
        series: [{
          type: 'heatmap',
          coordinateSystem: 'bmap',
          data: datas,
          pointSize: 7,
          blurSize: 6
        }]
      }
    }

  }

  optionChange(): void {
    this.mapChart(this.option);
  }

  search(): void {

  }

}
