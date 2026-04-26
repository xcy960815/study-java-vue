/**
 * 登录接口返回值
 */
declare interface LoginResponseVo {
  address: string
  createTime: string
  id: number
  introduceSign: string
  loginName: string
  nickName: string
  token: string
  refreshToken: string
}

/**
 * 登录接口请求值
 */
declare interface LoginRequestDto {
  username: string
  password: string
  rememberMe: boolean
  captchaId: string
  captcha: string
}

declare interface CaptchaResponseVo {
  captchaId: string
  captchaImage: string
}
