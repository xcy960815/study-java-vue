import { request } from '@utils/request'

/**
 * 登入接口
 * @returns {Promise<T>} 直接返回业务数据
 */
export interface RegisterRequestDto {
  username?: string
  password?: string
  confirmPassword?: string
  captchaId?: string
  captcha?: string
}

export interface CaptchaResponseVo {
  captchaId: string
  captchaImage: string
}

export function login<
  T extends LoginResponseVo = LoginResponseVo,
  D extends LoginRequestDto = LoginRequestDto,
>(requestParams: D): Promise<T> {
  const url = `/login`
  return request.post<T, T>(url, requestParams)
}

/**
 * 登出接口
 * @returns {Promise<void>}
 */
export function logout(): Promise<void> {
  const url = `/logout`
  return request.post<void, void>(url)
}

/**
 * 注册接口
 * @param {RegisterRequestDto} requestParams
 * @returns {Promise<boolean>}
 */
export function register(requestParams: RegisterRequestDto): Promise<boolean> {
  const url = `/register`
  return request.post<boolean, boolean>(url, requestParams)
}

/**
 * 获取验证码
 * @returns {Promise<CaptchaResponseVo>} 返回验证码ID和图片
 */
export function getCaptcha(): Promise<CaptchaResponseVo> {
  const url = `/captcha`
  return request.get<CaptchaResponseVo, CaptchaResponseVo>(url)
}
