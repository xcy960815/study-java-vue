import { request } from '@utils/request'

const baseUrl = '/role'

/**
 * 获取角色列表
 * @param {BaseListDto} queryFormData
 * @returns {Promise<ResponseResult<ListResponseResult<RoleInfoVo>>>}
 */
export function getRoleList<T extends ListResponseResult<RoleInfoVo>>(
  queryFormData: BaseListDto & Partial<RoleInfoDto>
): Promise<ResponseResult<T>> {
  const { pageSize, pageNum, ...otherQueryFormData } = queryFormData
  const url = `${baseUrl}/getRoleList?pageSize=${pageSize}&pageNum=${pageNum}`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: otherQueryFormData,
  })
}

/**
 * 获取所有角色列表
 * @returns {Promise<ResponseResult<ListResponseResult<RoleInfoVo>>>}
 */
export function getAllRoleList<T extends ListResponseResult<RoleInfoVo>>(): Promise<
  ResponseResult<T>
> {
  const url = `${baseUrl}/getAllRoleList`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url)
}

/**
 * 更新角色信息
 * @param {RoleInfoDto} roleInfo
 * @returns {Promise<ResponseResult<boolean>>}
 */
export function updateRole(roleInfo: RoleInfoDto): Promise<ResponseResult<boolean>> {
  const url = `${baseUrl}/updateRole`
  return request.put<ResponseResult<boolean>, ResponseResult<boolean>>(url, roleInfo)
}

/**
 * 新增角色
 * @param {RoleInfoDto} roleInfo
 * @returns {Promise<ResponseResult<boolean>>}
 */
export function insertRole(roleInfo: RoleInfoDto): Promise<ResponseResult<boolean>> {
  const url = `${baseUrl}/insertRole`
  return request.post<ResponseResult<boolean>, ResponseResult<boolean>>(url, roleInfo)
}

/**
 * 删除角色
 * @param {number} id
 * @returns {Promise<ResponseResult<boolean>>}
 */
export function deleteRole(roleInfo: RoleInfoDto): Promise<ResponseResult<boolean>> {
  const url = `${baseUrl}/deleteRole`
  return request.delete<ResponseResult<boolean>, ResponseResult<boolean>>(url, {
    data: roleInfo,
  })
}

/**
 * 禁用角色
 * @param {number} id
 * @returns {Promise<ResponseResult<boolean>>}
 */
export function disableRole(roleInfo: RoleInfoDto): Promise<ResponseResult<boolean>> {
  const url = `${baseUrl}/disableRole`
  return request.post<ResponseResult<boolean>, ResponseResult<boolean>>(url, roleInfo)
}

/**
 * 启用角色
 * @param {number} id
 * @returns {Promise<ResponseResult<boolean>>}
 */
export function enableRole(roleInfo: RoleInfoDto): Promise<ResponseResult<boolean>> {
  const url = `${baseUrl}/enableRole`
  return request.post<ResponseResult<boolean>, ResponseResult<boolean>>(url, roleInfo)
}

/**
 * 获取角色详情
 * @param {number} id
 * @returns {Promise<ResponseResult<RoleInfoVo>>}
 */
export function getRoleDetail<T extends RoleInfoVo>(id: number): Promise<ResponseResult<T>> {
  const url = `${baseUrl}/getRoleDetail/${id}`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url)
}
