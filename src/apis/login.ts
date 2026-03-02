import { request } from '@utils/request'

/**
 * 登入接口
 * @returns {Promise<T>} 直接返回业务数据
 */
export interface RegisterRequestDto {
  username?: string
  password?: string
  confirmPassword?: string
  captcha?: string
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
 * @returns {Promise<string>} 返回验证码字符串
 */
export function getCaptcha() {
  const url = `/captcha`
  return request.get<string, string>(url)
}
