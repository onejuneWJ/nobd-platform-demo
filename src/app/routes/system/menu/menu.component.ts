/* tslint:disable:forin */
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SystemMenuService} from '@core/services/system/system-menu.service';
import {SysMenu} from '@entity/system/SysMenu';
import {MainService} from '@core/services/main/main.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  dataForm!: FormGroup;
  updateForm!: FormGroup;
  dataList: SysMenu[] = [];
  parentMenus: SysMenu[] = [];
  expandData: { [key: number]: SysMenu[] } = {};
  modalVisible = false;
  modalTitle: string;
  drawerVisible = false;
  nzLoading = true;


  constructor(private fb: FormBuilder,
              private service: SystemMenuService,
              private message: NzMessageService,
              private modal: NzModalService,
              private mainService: MainService,
  ) {
  }

  submitDataForm(): boolean {
    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }
    return this.dataForm.valid;
  }

  submitUpdateForm(): boolean {
    for (const i in this.updateForm.controls) {
      this.updateForm.controls[i].markAsDirty();
      this.updateForm.controls[i].updateValueAndValidity();
    }
    return this.updateForm.valid;
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      title: ['', [Validators.required]],
      path: ['', [Validators.required]],
      parentId: [0, [Validators.required]],
      level: ['', [Validators.required]],
      sort: [''],
      icon: [''],
      hash: ['', [Validators.required]],
      directory: [false],
    });
    this.updateForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required]],
      path: ['', [Validators.required]],
      parentId: [0, [Validators.required]],
      level: ['', [Validators.required]],
      sort: [''],
      icon: [''],
      hash: ['', [Validators.required]],
      directory: [false],
    });
    this.search();
    this.getRoots();
  }

  search(): void {
    this.nzLoading = true;
    this.service.tree().subscribe((res) => {
      if (res) {
        this.dataList = res;
        this.changeData();
        this.nzLoading = false;
      }
    });
  }

  handleCancel(): void {
    this.hideModal();
  }

  /**
   * 模态框确认点击
   */
  handleOk(): void {
    if (this.submitDataForm()) {
      const menu: SysMenu = this.dataForm.getRawValue();
      // 发送请求
      this.service.create(menu).subscribe((res) => {
        // 如果成功
        if (res) {
          // 关闭模态框
          this.hideModal();
          // 刷新表格
          this.search();
          this.getRoots();
          // 刷新菜单
          this.service.userMenu().subscribe((r) => {
            this.mainService.changeMenus(r);
          });
        }
      });
    }
  }

  showModal(title: string): void {
    this.modalTitle = title;
    this.modalVisible = true;
  }

  hideModal(): void {
    this.dataForm.reset({
      title: '',
      path: '',
      parentId: 0,
      level: '',
      sort: '',
      icon: '',
      hash: '',
      directory: false,
    });
    this.modalVisible = false;
  }

  showDrawer(id: number): void {
    this.drawerVisible = true;
    this.service.detail(id).subscribe((res: SysMenu) => {
      if (res) {
        this.updateForm.reset({
          id: res.id,
          title: res.title,
          path: res.path,
          parentId: res.parentId,
          level: res.level,
          sort: res.sort,
          icon: res.icon,
          hash: res.hash,
          directory: res.directory,
        });
      }
    });
  }

  hideDrawer(): void {
    this.drawerVisible = false;
  }

  drawerClose(): void {
    this.updateForm.reset({
      id: '',
      title: '',
      path: '',
      parentId: 0,
      level: '',
      sort: '',
      icon: '',
      hash: '',
      directory: false,
    });
    this.hideDrawer();
  }

  drawerOk(): void {
    const data = this.updateForm.getRawValue();
    this.service.update(data).subscribe((res) => {
      if (res) {
        this.hideDrawer();
        this.search();
        // 刷新菜单
        this.service.userMenu().subscribe((r) => {
          this.mainService.changeMenus(r);
        });
      }
    });
  }

  collapse(array: SysMenu[], data: SysMenu, $event: boolean): void {
    if (!$event) {
      if (data.childrenList) {
        data.childrenList.forEach(d => {
          // 找到当前的菜单
          // tslint:disable-next-line:no-non-null-assertion
          const target = array.find(a => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  changeData(): void {
    this.dataList.forEach((root) => {
      this.expandData[root.id] = this.appendToChild(root);
    });
  }

  appendToChild(parent: SysMenu): SysMenu[] {
    const stack: SysMenu[] = [];
    const array: SysMenu[] = [];
    const hashMap = {};
    stack.push({...parent, level: 0, expand: false});
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.childrenList) {
        for (let i = node.childrenList.length - 1; i >= 0; i--) {
          stack.push({...node.childrenList[i], level: node.level + 1, expand: false, parent: node});
        }
      }
    }
    return array;
  }

  visitNode(node: SysMenu, hashMap: { [key: string]: boolean }, array: SysMenu[]): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  /**
   * 禁用，启用菜单
   */
  enable(itemId: number, flag: boolean): void {
    this.service.enable(itemId, !flag).subscribe((data) => {
      if (data) {
        this.message.success(data.desc);
        this.search();
        // 刷新菜单
        this.service.userMenu().subscribe((res) => {
          this.mainService.changeMenus(res);
        });
      }
    });
  }

  /**
   * 删除菜单
   * @param id id
   */
  delete(id: number): void {
    this.modal.confirm({
      nzTitle: '确定删除？',
      nzContent: '',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.service.delete(id).subscribe(data => {
          if (data) {
            this.search();
          }
        });
      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });

  }

  /**
   * 获取根菜单
   * @private
   */
  getRoots(): void {
    this.service.getRoots().subscribe(res => {
      if (res) {
        this.parentMenus = res;
      }
    });
  }
}
