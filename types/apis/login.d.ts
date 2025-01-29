/**
 * 登录接口参数
 */
declare interface LoginRequestVo {
  username: string
  password: string
  rememberMe: boolean
  captcha: string
}

/**
 * 登录接口返回值
 */
declare interface LoginResponseDto {
  address: string
  createTime: string
  id: number
  introduceSign: string
  loginName: string
  nickName: string
  token: string
}
