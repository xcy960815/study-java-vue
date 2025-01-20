import { request } from '@utils/request'
import type { BindingOrAssignmentElementRestIndicator } from 'typescript'

interface RequestParams extends baseListParams {}
/**
 * 获取超级管理员列表
 * @param {RequestParams} queryFormData
 * @returns {Promise<ResponseResult<T>>}
 */
export function getAdminUserList<
  T = Array<AdminUserInfoDto>
>(
  queryFormData: RequestParams
): Promise<ResponseResult<T>> {
  const { pageSize, pageNum, ...otherQueryFormData } =
    queryFormData
  const url = `/adminUser/getAdminUserList?pageSize=${pageSize}&pageNum=${pageNum}`
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url,
    {
      params: otherQueryFormData
    }
  )
}
