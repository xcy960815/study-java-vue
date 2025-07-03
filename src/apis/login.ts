import { request } from '@utils/request'

/**
 * 登入接口
 * @param {LoginRequestDto} requestParams
 * @returns {Promise<ResponseResult<T>>}
 */
export function login<T extends LoginResponseVo>(requestParams: LoginRequestDto) {
  const url = `/login`
  return request.post<ResponseResult<T>, LoginRequestDto>(url, requestParams)
}

/**
 * 登出接口
 * @returns {Promise<ResponseResult<T>>}
 */
export function logout<T extends null>() {
  const url = `/logout`
  return request.post<ResponseResult<T>, null>(url)
}

/**
 * 获取验证码
 */
export function getCaptcha<T extends string>() {
  const url = `/captcha`
  return request.get<ResponseResult<T>>(url)
}
