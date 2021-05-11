import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {NzUploadChangeParam} from "ng-zorro-antd/upload";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-problem-area',
  templateUrl: './problem-area.component.html',
  styleUrls: ['./problem-area.component.css']
})
export class ProblemAreaComponent implements OnInit {



  tableLoading = false;
  url: string = "src/file"
  dataList: any[] = [];
  tableDataList: any[] = [];
  pieOption: any;
  barOption: any;
  selectForm!: FormGroup;


  constructor(private message: NzMessageService, private fb: FormBuilder) {
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
          highLoad: Math.random() + i,
          highOffLine: Math.random() + i,
          lowConnect: Math.random() + i,
          volteProblem: Math.random() + i,
          highDisturb: Math.random() + i,
        }
      ];
    }
    this.dataList = this.tableDataList;

    this.statisticsPieOpt();
    this.statisticsBarOpt();
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

  statisticsPieOpt(): void {
    this.pieOption = {
      title: {
        text: '问题小区（次数）',
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
            {value: 248, name: '高负荷小区'},
            {value: 235, name: '高掉线小区'},
            {value: 280, name: '低接通小区'},
            {value: 284, name: 'VOLTE问题小区'},
            {value: 250, name: '高干扰小区'},
            {value: 900, name: '正常小区'},
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

  statisticsBarOpt(): void {
    this.barOption = {
      title: {
        text: '问题小区Top10',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: ['A5小区', 'A2小区', 'B3小区', 'B7小区', 'A5小区', 'B6小区', 'A9小区', 'A5小区', 'C2小区', 'B3小区']
      },
      series: [
        {
          type: 'bar',
          data: [223, 349, 404, 570, 644, 730, 820, 930, 1200, 1507]
        }
      ]
    };
  }

  search() : void {

  }

}
