import { request } from '@utils/request'

interface GetUserListParams extends baseListParams {}

/**
 * 获取当前登录用户信息
 * @returns {ResponseResult<UserInfoOption>}
 */
export const getUserInfo = <T extends UserInfoOption>() => {
  const url = `/user/getUserInfo`
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url
  )
}
/**
 * 获取用户列表请求参数类型
 * @param queryFormData
 * @returns {Promise<ResponseResult<T>>}
 */
export const getUserList = <T = any>(
  queryFormData: GetUserListParams
): Promise<ResponseResult<T>> => {
  const { pageSize, pageNum, ...otherQueryFormData } =
    queryFormData
  const url = `/user/getUserList?pageSize=${pageSize}&pageNum=${pageNum}`
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url,
    {
      params: otherQueryFormData
    }
  )
}

/**
 * 更新用户请求参数类型
 * @param params
 * @returns {Promise<ResponseResult<boolean>>}
 */
export const updateUserInfo = <T extends boolean>(
  params: Partial<UserInfoOption>
): Promise<ResponseResult<T>> => {
  const url = `/user/updateUserInfo`
  return request.post<ResponseResult<T>, ResponseResult<T>>(
    url,
    params
  )
}

/**
 * 上传用户头像
 * @param params {FormData}
 * @returns {Promise<ResponseResult<string>>}
 */
export const updateUserAvatar = <T extends string>(
  params: FormData
) => {
  const url = `/user/updateUserAvatar`
  return request.post<ResponseResult<T>, ResponseResult<T>>(
    url,
    params
  )
}

/**
 * 创建用户信息
 * @param params {Partial<UserInfoOption>}
 * @returns {Promise<ResponseResult<T>>}
 */
export const insertUserInfo = <T extends boolean>(
  params: Partial<UserInfoOption>
): Promise<ResponseResult<T>> => {
  const url = `/user/insertUserInfo`
  return request.post<ResponseResult<T>, ResponseResult<T>>(
    url,
    params
  )
}

/**
 * 删除用户信息
 * @param params {Partial<UserInfoOption>}
 * @returns {Promise<ResponseResult<boolean>>}
 */
export const deleteUserInfo = <T extends boolean>(
  params: Partial<UserInfoOption>
): Promise<ResponseResult<T>> => {
  const url = `/user/deleteUserInfoInfo`
  return request.delete<
    ResponseResult<T>,
    ResponseResult<T>
  >(url, {
    data: params
  })
}
