import { request } from '@utils/request'

interface RequestParams extends baseListParams {}
/**
 * 获取超级管理员列表
 * @param {RequestParams} queryFormData
 * @returns {Promise<ResponseResult<T>>}
 */
export function getAdminUserList<T = Array<AdminUserInfoDto>>(
  queryFormData: RequestParams
): Promise<ResponseResult<T>> {
  const { pageSize, pageNum, ...otherQueryFormData } = queryFormData
  const url = `/adminUser/getAdminUserList?pageSize=${pageSize}&pageNum=${pageNum}`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: otherQueryFormData,
  })
}

/**
 * 更新管理员信息
 * @param {AdminUserInfoDto} adminUserInfo
 * @returns {Promise<ResponseResult<T>>}
 */
export function updateUser<T = boolean>(
  adminUserInfo: AdminUserInfoDto
): Promise<ResponseResult<T>> {
  const url = `/adminUser/updateUser`
  return request.post<ResponseResult<T>, ResponseResult<T>>(url, adminUserInfo)
}

/**
 * 新增管理员
 * @param {AdminUserInfoDto} adminUserInfo
 * @returns {Promise<ResponseResult<T>>}
 */
export function insertUser<T = boolean>(
  adminUserInfo: AdminUserInfoDto
): Promise<ResponseResult<T>> {
  const url = `/adminUser/insertUser`
  return request.post<ResponseResult<T>, ResponseResult<T>>(url, adminUserInfo)
}

/**
 * 删除管理员
 * @param {number} adminUserId
 * @returns {Promise<ResponseResult<T>>}
 */
export function deleteUser<T = boolean>(adminUserId: number): Promise<ResponseResult<T>> {
  const url = `/adminUser/deleteUser`
  return request.delete<ResponseResult<T>, ResponseResult<T>>(url, { data: { adminUserId } })
}
