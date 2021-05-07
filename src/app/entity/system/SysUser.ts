import {SysRole} from './SysRole';

export class SysUser {
  // 用户系统属性开始 =============================================

  id: number = null;
  /**
   * 用户名
   */
  username: string = null;
  /**
   * 密码
   */
  password: string = null;

  realName: string = null;
  /**
   * 图标
   */
  icon: string = null;
  /**
   * 可用状态 ： 0 - 不可用, 1 - 可用
   *  null
   */
  status: boolean = null;

  /**
   * 创建时间
   */
  createTime: Date = null;

  /**
   * 登录时间
   */
  loginTime: Date = null;

  /**
   * 电话号码
   */
  telephone: string = null;

  /**
   * 邮箱地址
   */
  email: string = null;
  /**
   * 备注
   */
  note: string = null;
  /**
   * 角色列表
   */
  roles: SysRole[] = null;
}

