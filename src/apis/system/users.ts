import { request } from '@utils/request'

/**
 * 获取当前登录用户信息
 * @returns {T}
 */
export const getUserInfo = <T extends UserInfoVo>() => {
  const url = `/user/getUserInfo`
  return request.get<T, T>(url)
}

interface UserListRequestParams extends BaseListDto, UserInfoDto {}

/**
 * 获取用户列表请求参数类型
 * @param queryFormData
 * @returns {Promise<T>}
 */
export const getUserList = <T extends ListResponseResult<UserInfoVo>>(
  queryFormData: Partial<UserListRequestParams>
): Promise<T> => {
  const { pageSize, pageNum, ...otherQueryFormData } = queryFormData
  const url = `/user/getUserList?pageSize=${pageSize}&pageNum=${pageNum}`
  return request.post<T, T>(url, otherQueryFormData)
}

/**
 * 更新用户请求参数类型
 * @param {UserInfoVo} params
 * @returns {Promise<boolean>}
 */
export const updateUser = <T extends boolean>(params: UserInfoDto): Promise<T> => {
  const url = `/user/updateUser`
  return request.post<T, T>(url, params)
}

/**
 * 上传用户头像
 * @param params {FormData}
 * @returns {Promise<string>}
 */
export const updateUserAvatar = <T extends string>(params: FormData) => {
  const url = `/user/updateUserAvatar`
  return request.post<T, T>(url, params)
}

/**
 * 创建用户信息
 * @param params {UserInfoDto}
 * @returns {Promise<T>}
 */
export const insertUser = <T extends boolean>(params: UserInfoDto): Promise<T> => {
  const url = `/user/insertUser`
  return request.post<T, T>(url, params)
}

/**
 * 删除用户信息
 * @param params {Partial<UserInfoDto>}
 * @returns {Promise<boolean>}
 */
export const deleteUser = <T extends boolean>(params: UserInfoDto): Promise<T> => {
  const url = `/user/deleteUser`
  return request.delete<T, T>(url, {
    data: params,
  })
}

/**
 * 修改用户密码
 * @param requestParams {UserInfoDto}
 * @returns {Promise<T>}
 */
export const updateUserPassword = async <T extends boolean>(requestParams: UserInfoDto) => {
  const url = `/user/updateUserPassword`
  return request.post<T, T>(url, requestParams)
}
