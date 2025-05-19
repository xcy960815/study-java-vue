/**
 * 后端返回的菜单信息
 */
declare interface StudyJavaSysMenuVo {
  /**
   * 菜单ID
   */
  menuId: number

  /**
   * 父菜单ID
   */
  parentId: number

  /**
   * 菜单名称
   */
  menuName: string

  /**
   * 菜单路径
   */
  path: string

  /**
   * 组件路径
   */
  component: string

  /**
   * 菜单图标
   */
  icon: string

  /**
   * 菜单类型（0目录 1菜单 2按钮）
   */
  menuType: number

  /**
   * 权限标识
   */
  perms: string

  /**
   * 排序
   */
  orderNum: number

  /**
   * 创建时间
   */
  createTime: string

  /**
   * 更新时间
   */
  updateTime: string
}

/**
 * 前端请求的菜单信息
 */
declare interface StudyJavaSysMenuDto
  extends Omit<StudyJavaSysMenuVo, 'createTime' | 'updateTime'> {
  /**
   * 菜单ID
   */
  menuId?: number
}
