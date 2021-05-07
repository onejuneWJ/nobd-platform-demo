/**
 * 角色
 */
export class SysRole {
  /**
   * ID
   */
  id: number = null;
  /**
   * 角色名称
   */
  name: string = null;
  /**
   * 角色描述
   */
  description: string = null;
  /**
   * 创建时间
   */
  createTime: Date = null;
  /**
   * 状态 禁用：0，启用：1
   */
  status: boolean = null;
  /**
   * 排序
   */
  sort: number = null;
}
