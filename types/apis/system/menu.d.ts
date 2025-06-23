// import { svgIcons } from '@assets/svg-icons/index'

// import * as ElIcons from '@element-plus/icons-vue'

// import * as IconParkIcons from "@icon-park/vue-next"

// type ElIconNames = keyof typeof ElIcons

// type IconParkNames = keyof typeof IconParkIcons

// type LocalIconNames = keyof typeof svgIcons

/**
 * 后端返回的菜单信息
 */
declare interface StudyJavaSysMenuVo {
  /**
   * 菜单ID
   */
  id: number

  /**
   * 父菜单ID
   */
  parentId: number | null

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
  icon: string //Exclude<IconParkNames, "IconProvider" | "DEFAULT_ICON_CONFIGS"> | LocalIconNames

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

  /**
   * 子菜单
   */
  children?: StudyJavaSysMenuVo[]
}

/**
 * 前端请求的菜单信息
 */
declare interface StudyJavaSysMenuDto
  extends Omit<StudyJavaSysMenuVo, 'createTime' | 'updateTime' | 'children'> {
  /**
   * 菜单ID
   */
  id?: number | null
}
