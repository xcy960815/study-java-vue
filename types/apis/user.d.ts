declare interface UserInfoDto {
  /**
   * 用户主键id
   */
  userId: number | null

  /**
   * 用户昵称
   */
  nickName: string

  /**
   * 登陆名称(默认为手机号)
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
}

declare type UserInfoVo = Partial<
  Omit<UserInfoDto, 'avatar' | 'createTime'>
> & {
  passwordMd5?: string
  newPasswordMd5?: string
  confirmNewPassword?: string
}
