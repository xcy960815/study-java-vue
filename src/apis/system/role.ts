import { request } from '@utils/request'

const baseUrl = '/role'

/**
 * 获取角色列表
 * @param {BaseListDto} queryFormData
 * @returns {Promise<T>}
 */
export function getRoleList<T extends ListResponseResult<RoleInfoVo>>(
  queryFormData: BaseListDto & Partial<RoleInfoDto>
): Promise<T> {
  const { pageSize, pageNum, ...otherQueryFormData } = queryFormData
  const url = `${baseUrl}/getRoleList?pageSize=${pageSize}&pageNum=${pageNum}`
  return request.get<T, T>(url, {
    params: otherQueryFormData,
  })
}

/**
 * 获取所有角色列表
 * @returns {Promise<T>}
 */
export function getAllRoleList<T extends Array<RoleInfoVo>>(): Promise<T> {
  const url = `${baseUrl}/getAllRoleList`
  return request.get<T, T>(url)
}

/**
 * 更新角色信息
 * @param {RoleInfoDto} roleInfo
 * @returns {Promise<boolean>}
 */
export function updateRole(roleInfo: RoleInfoDto): Promise<boolean> {
  const url = `${baseUrl}/updateRole`
  return request.put<boolean, boolean>(url, roleInfo)
}

/**
 * 新增角色
 * @param {RoleInfoDto} roleInfo
 * @returns {Promise<boolean>}
 */
export function insertRole(roleInfo: RoleInfoDto): Promise<boolean> {
  const url = `${baseUrl}/insertRole`
  return request.post<boolean, boolean>(url, roleInfo)
}

/**
 * 删除角色
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export function deleteRole(roleInfo: RoleInfoDto): Promise<boolean> {
  const url = `${baseUrl}/deleteRole`
  return request.delete<boolean, boolean>(url, {
    data: roleInfo,
  })
}

/**
 * 禁用角色
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export function disableRole(roleInfo: RoleInfoDto): Promise<boolean> {
  const url = `${baseUrl}/disableRole`
  return request.post<boolean, boolean>(url, roleInfo)
}

/**
 * 启用角色
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export function enableRole(roleInfo: RoleInfoDto): Promise<boolean> {
  const url = `${baseUrl}/enableRole`
  return request.post<boolean, boolean>(url, roleInfo)
}

/**
 * 获取角色详情
 * @param {number} id
 * @returns {Promise<T>}
 */
export function getRoleDetail<T extends RoleInfoVo>(id: number): Promise<T> {
  const url = `${baseUrl}/getRoleDetail/${id}`
  return request.get<T, T>(url)
}
