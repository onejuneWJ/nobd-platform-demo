/* tslint:disable:forin */
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, first, map, switchMap} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {MainService} from '../../../core/services/main/main.service';
import {SystemUserService} from '../../../core/services/system/system-user.service';
import {SystemRoleService} from '../../../core/services/system/system-role.service';
import {SystemMenuService} from '../../../core/services/system/system-menu.service';
import {SysUser} from '../../../entity/system/SysUser';
import {PageRequest} from '../../../entity/common/page';
import {SysRole} from '../../../entity/system/SysRole';
import {Constants} from '../../../shared/utils/Constants';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private mainService: MainService,
              private service: SystemUserService,
              private roleService: SystemRoleService,
              private menuService: SystemMenuService,
              private message: NzMessageService,
              private modal: NzModalService
  ) {
  }

  currentUser: SysUser = null;
  searchForm!: FormGroup;
  dataForm!: FormGroup;
  modalTitle: string;
  cuVisible = false; // 新增或者修改模态框
  roleVisible = false; // 分配角色模态框
  nzLoading = true;
  dataList: SysUser[] = [];
  pageRequest: PageRequest = new PageRequest(1, 10, null, null);
  total: number;
  listOfSelectedValue: SysRole[] = []; // 角色下拉框选中的值
  listOfOption: SysRole[] = []; // 角色下拉框选项列表
  roleModalUserId: number = null;
  passwordVisible = false;
  cuOkLoading = false; // 新建用户modal点击确定按钮加载状态
  isAdd = true; // 是否是新增用户
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  // 用户名异步校验
  userNameAsyncValidator = (control: FormControl) => {
    return control.valueChanges.pipe(
      debounceTime(400),
      switchMap(() => this.service.validateUsername(control.value, control.parent.get('id')?.value || '')),
      map(({code, desc}) => code === 200 && desc === '操作成功' ? null : {error: true, duplicated: true}),
      first()
    );
  }
  // 验证确认密码
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {error: true, required: true};
    } else if (control.value !== this.dataForm.controls.password.value) {
      return {confirm: true, error: true};
    }
    return {};
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      username: []
    });
    this.dataForm = this.fb.group({
      id: [''],
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9]{4,20}')], [this.userNameAsyncValidator]],
      password: ['', [Validators.required, Validators.pattern('^(?![0-9]+$)(?![a-zA-Z]+$)(?![a-z]+$)(?![!@#$%^&*=]+$)[0-9A-Za-z!@#$%^&*=._-]{6,30}$')]],
      confirmPassword: ['', [this.confirmValidator]],
      icon: [''],
      email: ['', [Validators.required, Validators.email]],
      status: [''],
      note: ['']
    });
    this.search();
    this.loadUserInfo();
  }

  search(param?: NzTableQueryParams): void {
    this.nzLoading = true;
    if (param) {
      this.pageRequest.page = param.pageIndex;
      this.pageRequest.size = param.pageSize;
      this.pageRequest.sort = param.sort[0]?.key;
      this.pageRequest.order = param.sort[0]?.value;
    }
    const where = this.searchForm.getRawValue();
    this.service.page(this.pageRequest, where).subscribe(data => {
      if (data) {
        console.log(data);
        this.dataList = data.data;
        this.total = data.total;
        this.nzLoading = false;
      }
    });
  }

  /**
   * 打开新增或修改模态框
   * @param title 模态框标题
   * @param isAdd 是否是新增
   * @param user 如果是修改, 修改的用户
   */
  showCUModal(title: string, isAdd: boolean, user?: SysUser): void {
    // 如果是修改
    if (!isAdd) {
      this.dataForm.removeControl('password');
      this.dataForm.removeControl('confirmPassword');
      this.dataForm.reset({
        id: user.id,
        username: {value: user.username, disabled: user.id === this.currentUser.id},
        icon: user.icon,
        email: user.email,
        status: user.status,
        note: user.note,
      });
    } else {
      this.dataForm.reset({
        id: null,
        username: {value: null, disabled: false},
        icon: null,
        email: null,
        status: null,
        note: null,
      });
      this.dataForm.addControl('password',
        new FormControl('',
          [Validators.required,
            Validators.pattern('^(?![0-9]+$)(?![a-zA-Z]+$)(?![a-z]+$)(?![!@#$%^&*=]+$)[0-9A-Za-z!@#$%^&*=._-]{6,30}$')]));
      this.dataForm.addControl('confirmPassword', new FormControl('', [this.confirmValidator]));
    }
    this.isAdd = isAdd;
    this.modalTitle = title;
    this.cuVisible = true;
  }

  hideCUModal(): void {
    this.cuVisible = false;
    this.passwordVisible = false;
    this.dataForm.reset();
    this.cuOkLoading = false;
  }

  onCUOk(): void {
    this.cuOkLoading = true;
    if (this.dataForm.valid) {
      const data = this.dataForm.getRawValue();
      const method = this.isAdd ? Constants.POST : Constants.PUT;
      this.service.insertOrUpdate(data, method).subscribe(res => {
        if (res) {
          this.hideCUModal();
          this.search();
        }
      });
    }
    this.cuOkLoading = false;
  }

  onCUCancel(): void {
    this.dataForm.reset();
    this.hideCUModal();
  }

  delete(id: number): void {
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
      nzCancelText: '取消'
    }, 'error');
  }

  enable(userId: number, flag: boolean): void {
    if (userId === this.currentUser.id) {
      return;
    }
    this.service.enable(userId, flag).subscribe(({code, desc}) => {
      if (code === 200) {
        this.message.success(desc);
        this.search();
      }
    });
  }

  /**
   * 打开分配角色modal
   * @param id 用户id
   */
  showRoleModal(id: number): void {
    this.loadRoleOptions().then(r => {
      this.loadRole(id);
    });
    this.roleModalUserId = id;
    this.roleVisible = true;
  }


  onRoleOk(): void {
    this.service.allocationRole(this.roleModalUserId, this.listOfSelectedValue).subscribe(({code, desc}) => {
      if (code === 200) {
        this.message.success(desc);
        this.hideRoleModal();
        this.search();
        // 刷新登录用户信息
        this.service.getLoginUser().subscribe(data => {
          sessionStorage.setItem(Constants.currentUserKey, '');
          sessionStorage.setItem(Constants.currentUserKey, JSON.stringify(data));
        });
        // 刷新菜单
        this.menuService.userMenu().subscribe(data => {
          this.mainService.changeMenus(data);
        });
      }
    });
  }

  onRoleCancel(): void {
    this.hideRoleModal();
  }

  hideRoleModal(): void {
    this.listOfSelectedValue = [];
    this.roleVisible = false;
  }

  /**
   * 加载用户拥有的角色列表
   * @param userId 用户id
   */
  loadRole(userId: number): void {
    this.roleService.listByUser(userId).subscribe(data => {
      if (data) {
        this.listOfSelectedValue = [...data];
      }
    });
  }

  /**
   * 加载角色列表
   * @private
   */
  loadRoleOptions(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.roleService.list(null).subscribe(data => {
        if (data) {
          this.listOfOption = data;
          resolve(true);
        }
      });
    });
  }

  /**
   * 加载当前登录用户
   */
  loadUserInfo(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem(Constants.currentUserKey));
  }
}
