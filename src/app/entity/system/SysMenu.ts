export class SysMenu {
  id: number = null;
  /**
   * 父节点oid
   */
  parentId: number = null;
  /**
   * 菜单名称
   */
  title: string = null;
  /**
   * 菜单排序
   */
  sort: number = null;
  /**
   * 菜单层级
   */
  level: number = null;
  /**
   * 路径
   */
  path: string = null;
  /**
   * 排序
   */
  order: number = null;
  /**
   * 图标
   */
  icon: string = null;
  /**
   * 子菜单
   */
  childrenList: SysMenu[] = null;
  /**
   * 创建时间
   */
  createTime: Date = null;
  /**
   * 是否展开
   */
  expand: boolean;
  /**
   * 父级菜单
   */
  parent: SysMenu = null;
  /**
   * 是否是目录
   */
  directory: boolean;
  /**
   * 是否禁用
   */
  disabled: boolean;
  /**
   * hash，用于路由复用
   */
  hash: string = null;
}
