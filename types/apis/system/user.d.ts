/**
 * 后端返回的用户信息
 */
declare interface UserInfoVo {
  /**
   * 用户主键id
   */
  id: number | null

  /**
   * 角色id
   */
  roleIds: Array<number> | undefined

  /**
   * 角色名称
   */
  roleNames: Array<string> | undefined

  /**
   * 角色编码
   */
  roleCodes: Array<string> | undefined

  /**
   * 用户昵称
   */
  nickName: string

  /**
   * 登陆账号(默认为手机号)
   */
  loginName: string

  /**
   * 个性签名
   */
  introduceSign: string

  /**
   * 收货地址
   */
  address: string

  /**
   * 注册时间
   */
  createTime: string

  /**
   * 头像 （base64）
   */
  avatar: string

  /**
   * 权限列表
   */
  permissions: Array<string> | undefined
}

/**
 * 前端请求的用户信息
 */
declare type UserInfoDto = Partial<Omit<UserInfoVo, 'createTime'>> & {
  passwordMd5?: string
  newPasswordMd5?: string
  confirmNewPassword?: string
}
