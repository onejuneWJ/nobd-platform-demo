import {Component, OnInit, ViewChild} from '@angular/core';
import {SystemRoleService} from '@core/services/system/system-role.service';
import {SysRole} from '@entity/system/SysRole';
import {PageRequest} from '@entity/common/page';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SystemMenuService} from '@core/services/system/system-menu.service';
import {SystemResourceService} from '@core/services/system/system-resource.service';
import {SysMenu} from '@entity/system/SysMenu';
import * as _ from 'lodash';
import {MainService} from '@core/services/main/main.service';
import {SysUser} from '@entity/system/SysUser';
import {Constants} from '@shared/utils/Constants';
import {NzTreeComponent} from 'ng-zorro-antd/tree';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  @ViewChild('nzTreeComponent', {static: false}) nzTreeComponent!: NzTreeComponent;

  searchForm!: FormGroup;
  dataForm!: FormGroup;
  tableLoading = true;
  cuModalTitle = '';
  cuModalVisible: boolean;
  dataList: SysRole[] = [];
  pageRequest: PageRequest = new PageRequest(1, 10, null, null);
  total: number;
  menuModalVisible = false;
  // 菜单树
  menuTree: any[] = [];
  // 选中的菜单
  selectedMenuId: any[];
  menuModalRoleId: number = null;
  // 当前用户
  currentUser: SysUser;
  isAdd = true;
  sourceModalVisible: boolean;
  sourceTotal: number;
  sourceLoading: boolean;
  sourceList: any[];
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  menuOkLoading = false;

  constructor(
    private fb: FormBuilder,
    private mainService: MainService,
    private service: SystemRoleService,
    private menuService: SystemMenuService,
    private sourceService: SystemResourceService,
    private message: NzMessageService,
    private modal: NzModalService,
  ) {

  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      name: []
    });
    this.dataForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      description: [],
      status: [true],
      sort: [0]
    });
    this.search();
    this.currentUser = JSON.parse(sessionStorage.getItem(Constants.currentUserKey));
  }


  search(params?: NzTableQueryParams): void {
    this.tableLoading = true;
    if (params) {
      // 分页
      this.pageRequest.page = params.pageIndex;
      this.pageRequest.size = params.pageSize;
    }
    // 查询条件
    const where = this.searchForm.getRawValue();
    // 查询
    this.service.page(where, this.pageRequest).subscribe(data => {
      if (data) {
        this.dataList = data.data;
        this.total = data.total;
        this.tableLoading = false;
      }
    });
  }

  submitDataForm(): boolean {
    // tslint:disable-next-line:forin
    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }
    return this.dataForm.valid;
  }

  showCUModal(title: string, isAdd: boolean, role?: SysRole): void {
    if (!isAdd) {
      this.dataForm.reset({
        id: role.id,
        name: role.name,
        description: role.description,
        status: role.status,
        sort: role.sort
      });
    }
    this.isAdd = isAdd;
    this.cuModalTitle = title;
    this.cuModalVisible = true;
  }

  hideCUModal(): void {
    this.cuModalVisible = false;
  }

  onCUOk(): void {
    if (this.submitDataForm()) {
      const data = this.dataForm.getRawValue();
      const method = this.isAdd ? Constants.POST : Constants.PUT;
      this.service.insertOrUpdate(data, method).subscribe(({code}) => {
        if (code === 200) {
          this.search();
          this.hideCUModal();
        }
      });
    }
  }

  onCUCancel(): void {
    this.dataForm.reset();
    this.hideCUModal();
  }

  enable(roleId: number, flag: any): void {
    this.service.enable(roleId, flag).subscribe((data) => {
      if (data) {
        this.message.success(data.desc);
        this.search();
      }
    });
  }

  delete(id: any): void {
    this.modal.confirm({
      nzTitle: '确定删除此用户?',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.service.delete(id).subscribe(({code}) => {
          if (code === 200) {
            this.search();
          }
        });
      },
      nzCancelText: '取消',
    }, 'error');
  }

  showMenuModal(roleId: number): void {
    this.menuModalVisible = true;
    this.menuModalRoleId = roleId;
    this.loadMenuTree().then(() => {
      this.loadRoleMenu(roleId).then(() => {
      });
    });
  }

  /**
   * 点击确定分配菜单
   */
  onMenuOk(): void {
    this.menuOkLoading = true;
    const selectedList = this.nzTreeComponent.getCheckedNodeList(); // 选中的菜单
    const halfCheckedList = this.nzTreeComponent.getHalfCheckedNodeList(); // 半选中的菜单（子菜单被选中）
    let menuList = [];
    selectedList.forEach(value => {
      this.treeToList(value.origin.children, menuList);
      menuList.push(_.omit(value.origin, ['children', 'childrenList']));
    });
    menuList = [...menuList, ...halfCheckedList.map(value => _.omit(value.origin, ['children', 'childrenList']))];
    this.service.allocationMenu(this.menuModalRoleId, menuList).subscribe(({code, desc}) => {
      if (code === 200) {
        this.message.success(desc);
        this.hideMenuModal();
        this.search();
        // 如果分配菜单的角色是当前登录用户所拥有的
        if (this.currentUser.roles.some(value => value.id === this.menuModalRoleId)) {
          // 刷新菜单
          this.menuService.userMenu().subscribe(data => {
            this.mainService.changeMenus(data);
          });
        }
      }
    }, () => {
      this.menuOkLoading = false;
    });
  }

  onMenuCancel(): void {
    this.hideMenuModal();
  }

  hideMenuModal(): void {
    this.selectedMenuId = [];
    this.menuModalVisible = false;
    this.menuOkLoading = false;
  }

  loadMenuTree(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.menuService.tree().subscribe(res => {
        if (res) {
          this.menuTree = res.map(value => {
            return this.transfer(value);
          });
          console.log(this.menuTree);
          resolve(true);
        }
      }, () => {
        resolve(false);
      });
    });
  }

  /**
   * 将菜单转换为节点
   * @param menu 菜单
   */
  transfer(menu?: SysMenu): any {
    menu.childrenList.forEach(value => value.parent = _.omit(menu, ['childrenList']));

    return {
      id: menu.id,
      expand: menu.expand,
      title: menu.title,
      disabled: menu.disabled || menu.parent?.disabled, // 如果父级菜单被禁用，子菜单也禁用
      key: menu.id,
      isLeaf: menu.level !== 0,
      children: menu.childrenList.map(value => this.transfer(value))
    };

  }


  loadRoleMenu(roleId: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.menuService.listByRole(roleId).subscribe(res => {
        if (res) {
          this.selectedMenuId = res.filter(value => !value.directory).map(value => value.id);
          resolve(true);
        }
      }, () => {
        resolve(false);
      });
    });
  }

  treeToList(selectedList: any[], menuList: any[]): void {
    selectedList.forEach(value => {
      this.treeToList(value.children, menuList);
      menuList.push(_.omit(value, ['children']));
    });
  }

  canDisable(role: any): boolean {
    return this.currentUser.roles.some(value => {
      return value.id === role.id;
    });
  }

  showSourceModal(id: number): void {
    this.sourceModalVisible = true;
    this.searchSource();
  }

  searchSource(params?: NzTableQueryParams): void {
    this.sourceLoading = true;
    const page = new PageRequest(params?.pageIndex || 1, params?.pageSize || 10, null, null);
    this.sourceService.page({}, null).subscribe(data => {
      if (data) {
        this.sourceList = data.data;
        this.sourceTotal = data.total;
        this.sourceLoading = false;
      }
    });
  }

  onSourceOk(): void {
    console.log(this.setOfCheckedId);
  }

  onSourceCancel(): void {
    this.hideSourceModal();
  }

  hideSourceModal(): void {
    this.sourceModalVisible = false;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.sourceList.filter(({disabled}) => !disabled);
    this.checked = listOfEnabledData.every(({id}) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({id}) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.sourceList.filter(({disabled}) => !disabled).forEach(({id}) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }
}
