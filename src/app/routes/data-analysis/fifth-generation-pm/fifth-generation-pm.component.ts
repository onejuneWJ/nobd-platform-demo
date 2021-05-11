import { Component, OnInit } from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {NzUploadChangeParam} from "ng-zorro-antd/upload";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-fifth-generation-pm',
  templateUrl: './fifth-generation-pm.component.html',
  styleUrls: ['./fifth-generation-pm.component.css']
})
export class FifthGenerationPmComponent implements OnInit {

  tableLoading = false;
  url: string = "src/file";
  dataList: any[] =[];
  tableDataList: any[] = [];
  barOption: any;
  pieOption: any;
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
          nsaCu: Math.random() + 86.2,
          nsaDu: Math.random() + 86.2,
          saCu: Math.random() + 86.2,
          saDu: Math.random() + 80.2,
        }
      ];
    }
    this.dataList = this.tableDataList;

    this.statisticsBarOpt();
    this.statisticsPieOpt();
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

  statisticsBarOpt(): void {
    this.barOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['CU', 'DU']
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore: {show: true},
          saveAsImage: {show: true}
        }
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {show: false},
          data: ['NSA', 'SA']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'CU',
          type: 'bar',
          barGap: 0,
          emphasis: {
            focus: 'series'
          },
          data: [320, 332]
        },
        {
          name: 'DU',
          type: 'bar',
          emphasis: {
            focus: 'series'
          },
          data: [220, 182]
        },

      ]
    };
  }

  statisticsPieOpt(): void {
    this.pieOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: '5G PM',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {value: 1048, name: 'NSA CU'},
            {value: 735, name: 'NSA DU'},
            {value: 580, name: 'SA CU'},
            {value: 484, name: 'SA DU'}
            ]
        }
      ]
    };
  }

  search() : void {

  }

}
