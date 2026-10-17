import { request } from '@utils/request'

interface UserListRequestParams extends BaseListDto, UserInfoDto {}

/**
 * 获取当前登录用户信息。
 *
 * @returns 当前用户信息（含角色与权限）
 */
export const getUserInfo = <T extends UserInfoVo>() => {
  const url = `/user/getUserInfo`
  return request.get<T, T>(url)
}

/**
 * 获取用户列表。
 * 分页参数走 URL 查询串，其他搜索条件放在 POST body 中。
 *
 * @param queryFormData - 用户筛选条件与分页参数
 * @returns 用户分页结果
 */
export const getUserList = <T extends ListResponseResult<UserInfoVo>>(
  queryFormData: Partial<UserListRequestParams>
): Promise<T> => {
  const { pageSize, pageNum, ...otherQueryFormData } = queryFormData
  const url = `/user/getUserList`
  return request.post<T, T>(url, otherQueryFormData, {
    params: { pageNum, pageSize },
  })
}

/**
 * 更新用户信息。
 *
 * @param params - 待更新的用户信息
 * @returns 是否更新成功
 */
export const updateUser = <T extends boolean>(params: UserInfoDto): Promise<T> => {
  const url = `/user/updateUser`
  return request.post<T, T>(url, params)
}

/**
 * 上传用户头像（multipart）。
 *
 * @param params - 包含 userId 与头像文件的表单
 * @returns 头像访问地址
 */
export const updateUserAvatar = <T extends string>(params: FormData) => {
  const url = `/user/updateUserAvatar`
  return request.post<T, T>(url, params)
}

/**
 * 创建用户信息。
 *
 * @param params - 待新增的用户信息
 * @returns 是否新增成功
 */
export const insertUser = <T extends boolean>(params: UserInfoDto): Promise<T> => {
  const url = `/user/insertUser`
  return request.post<T, T>(url, params)
}

/**
 * 删除用户信息。
 *
 * @param params - 待删除的用户信息
 * @returns 是否删除成功
 */
export const deleteUser = <T extends boolean>(params: UserInfoDto): Promise<T> => {
  const url = `/user/deleteUser`
  return request.delete<T, T>(url, {
    data: params,
  })
}

/**
 * 修改用户密码，成功后需重新登录。
 *
 * @param requestParams - 原密码、新密码与确认密码（MD5 后的值）
 * @returns 是否修改成功
 */
export const updateUserPassword = async <T extends boolean>(requestParams: UserInfoDto) => {
  const url = `/user/updateUserPassword`
  return request.post<T, T>(url, requestParams)
}
