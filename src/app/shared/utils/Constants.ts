export class Constants {
  /**
   * sessionStorage 中存储token的key
   */
  public static tokenKey = 'access_token';
  /**
   * sessionStorage 中存储token失效时间的key
   */
  public static tokenExpiredKey = 'token_expired';
  /**
   * sessionStorage中存储当前用户的key
   */
  public static currentUserKey = 'current_user';
  /**
   * sessionStorage中存储当前用户拥有的菜单的key
   */
  public static currentUserMenuKey = 'user_menu';
  /**
   * 当前登录用户的所有tab标签。
   * 用于用户点击刷新之后重新回显当前页面
   */
  public static tabs = 'tabs';

  // 请求方法
  public static POST = 'POST';
  public static GET = 'GET';
  public static PUT = 'PUT';
  public static DELETE = 'DELETE';
}
/**
 * 请求路径开头
 */
export const baseRequestUrl = '/api/v1';
