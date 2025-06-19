/**
 * 后端返回的角色信息
 */
declare interface RoleInfoVo {
  /**
   * 角色ID
   */
  id: number

  /**
   * 角色名称
   */
  roleName: string

  /**
   * 角色编码
   */
  roleCode: string

  /**
   * 菜单名称
   */
  menuNames: string[]

  /**
   * 菜单编码
   */
  menuIds: number[]

  /**
   * 显示顺序
   */
  roleSort: number

  /**
   * 角色状态（1正常 0停用）
   */
  status: number

  /**
   * 菜单树选择项是否关联显示（ 0：父子不互相关联显示 1：父子互相关联显示）
   */
  menuCheckStrictly: number

  /**
   * 备注
   */
  remark: string

  /**
   * 创建者
   */
  createBy: string

  /**
   * 创建时间
   */
  createTime: string

  /**
   * 更新者
   */
  updateBy: string

  /**
   * 更新时间
   */
  updateTime: string

  /**
   * 删除标志（0代表存在 1代表删除）
   */
  delFlag: number
}

/**
 * 前端请求的角色信息
 */
declare interface RoleInfoDto
  extends Partial<
    Omit<RoleInfoVo, 'createTime' | 'updateTime' | 'createBy' | 'updateBy' | 'delFlag'>
  > {}
