import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {NzUploadChangeParam} from "ng-zorro-antd/upload";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
// import {BMap} from "angular2-baidu-map/lib/types/BMap";
declare var BMap: any;

import * as echarts from 'echarts/core';


@Component({
  selector: 'app-lte-mr',
  templateUrl: './lte-mr.component.html',
  styleUrls: ['./lte-mr.component.css']
})
export class LteMrComponent implements OnInit {

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
      title: '重叠覆盖',
      compare: (a: any, b: any) => a.overlapCoverage - b.overlapCoverage,
      priority: false,
      flag: true
    },
    {
      title: '过覆盖',
      compare: null,
      priority: false
    },
    {
      title: '竟对覆盖率',
      compare: (a: any, b: any) => a.competitorCoverage - b.competitorCoverage,
      priority: false,
      flag: true
    },
  ];

  tableLoading = false;
  url: string = "src/file"
  dataList: any[] = [];
  tableDataList: any[] = [];
  mrOption: any;
  competitorOption: any;
  overlapOption: any;
  option = 'mrCoverageRate';
  selectForm!: FormGroup;
  myChart: any;


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
          overlapCoverage: Math.random() * 10 + 2,
          tooCoverage: '否',
          competitorCoverageRate: Math.random() + 80.2,
        }
      ];
    }
    this.dataList = this.tableDataList;
    this.mapChart(this.option);

    // this.test();

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
    } else if (select === 'competitorCoverageRate') {
      this.competitorOption = {
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
      // 添加百度地图插件
      // const bmap = this.myChart.getModel().getComponent('bmap').getBMap();
      // bmap.addControl(new BMap.MapTypeControl());
    } else {
      this.overlapOption = {
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
          pointSize: 5,
          blurSize: 6
        }]
      }

      // 添加百度地图插件
      // const bmap = this.myChart.getModel().getComponent('bmap').getBMap();
      // bmap.addControl(new BMap.MapTypeControl());
    }
  }

  optionChange(): void {
    this.mapChart(this.option);
  }

  search(): void {

  }

  test() {
    let chartDom = document.getElementById('overlapCoverage');
    let option;
    this.myChart = echarts.init(chartDom);

    this.http.get(`assets/hangzhou-tracks.json`).subscribe((data: any) => {

      let points = [].concat.apply([], data.map(function (track) {
        return track.map(function (seg) {
          return seg.coord.concat([1]);
        });
      }));
      this.myChart.setOption(option = {
        animation: false,
        bmap: {
          center: [104.14322240845, 30.236064370321],
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
          data: points,
          pointSize: 5,
          blurSize: 6
        }]
      });

      // 添加百度地图插件
      const bmap = this.myChart.getModel().getComponent('bmap').getBMap();
      bmap.addControl(new BMap.MapTypeControl());
    });
    // option && this.myChart.setOption(option);

  }

}
