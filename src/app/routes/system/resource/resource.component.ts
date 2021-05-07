import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {SysResource} from '../../../entity/system/SysResource';
import {SystemResourceService} from '../../../core/services/system/system-resource.service';
import {PageRequest} from '../../../entity/common/page';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit {
  searchForm: FormGroup;
  tableLoading = false;
  dataList: SysResource[] = [];
  total = 0;
  addModalVisible = false;
  apiList: any[] = [];
  addLoading: boolean;
  currentApiList: any[] = [];
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  constructor(
    private service: SystemResourceService,
    private fb: FormBuilder,
    private messageService: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      name: [''],
    });
    this.search();
  }

  search(params?: NzTableQueryParams): void {
    this.tableLoading = true;
    const where = this.searchForm.getRawValue();
    const pageRequest = new PageRequest(params?.pageIndex || 1, params?.pageSize, params?.sort[0]?.key, params?.sort[0]?.value);
    console.log(pageRequest);
    this.service.page(where, pageRequest).subscribe(({total, data}) => {
      this.total = total;
      this.dataList = data;
      this.tableLoading = false;
    });
  }

  delete(id: any): void {

  }

  showAddModal(): void {
    this.addModalVisible = true;
    this.addLoading = true;
    this.service.listApis().subscribe(res => {
      if (res) {
        this.apiList = res;
        this.addLoading = false;
      }
    });
  }

  hideAddModal(): void {
    this.addModalVisible = false;
  }

  onAddOk(): void {

  }

  onAddCancel(): void {
    this.hideAddModal();
  }

  refreshApis(): void {
    this.service.refreshApis().subscribe(({code, desc}) => {
      if (code === 200) {
        this.messageService.success(desc);
        this.search();
      }
    });
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: any[]): void {
    this.currentApiList = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.currentApiList.filter(({disabled}) => !disabled);
    this.checked = listOfEnabledData.every(({id}) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({id}) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.currentApiList.filter(({disabled}) => !disabled).forEach(({id}) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

}
