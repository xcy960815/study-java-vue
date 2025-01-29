import { request } from '@utils/request'

/**
 * 登入接口
 * @param {LoginRequestVo} requestParams
 * @returns {Promise<ResponseResult<T>>}
 */
export function login<T extends LoginResponseDto>(
  requestParams: LoginRequestVo
) {
  const url = `/login`
  return request.post<ResponseResult<T>, ResponseResult<T>>(
    url,
    requestParams
  )
}

/**
 * 登出接口
 * @returns {Promise<ResponseResult<T>>}
 */
export function logout<T extends null>() {
  const url = `/logout`
  return request.post<ResponseResult<T>, ResponseResult<T>>(
    url
  )
}

/**
 * 获取验证码
 */
export function getCaptcha<T extends string>() {
  const url = `/captcha`
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url
  )
}
