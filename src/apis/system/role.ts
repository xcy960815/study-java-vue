import { request } from '@utils/request'

const baseUrl = '/role'

/**
 * 获取角色分页列表。
 *
 * @param queryFormData - 角色筛选条件与分页参数
 * @returns 角色分页结果
 */
export function getRoleList<T extends ListResponseResult<RoleInfoVo>>(
  queryFormData: BaseListDto & Partial<RoleInfoDto>
): Promise<T> {
  const { pageSize, pageNum, ...otherQueryFormData } = queryFormData
  const url = `${baseUrl}/getRoleList`
  return request.get<T, T>(url, {
    params: { pageNum, pageSize, ...otherQueryFormData },
  })
}

/**
 * 获取所有角色列表。
 *
 * @returns 全部角色列表
 */
export function getAllRoleList<T extends Array<RoleInfoVo>>(): Promise<T> {
  const url = `${baseUrl}/getAllRoleList`
  return request.get<T, T>(url)
}

/**
 * 更新角色信息。
 *
 * @param roleInfo - 角色信息
 * @returns 是否更新成功
 */
export function updateRole(roleInfo: RoleInfoDto): Promise<boolean> {
  const url = `${baseUrl}/updateRole`
  return request.put<boolean, boolean>(url, roleInfo)
}

/**
 * 新增角色。
 *
 * @param roleInfo - 角色信息
 * @returns 是否新增成功
 */
export function insertRole(roleInfo: RoleInfoDto): Promise<boolean> {
  const url = `${baseUrl}/insertRole`
  return request.post<boolean, boolean>(url, roleInfo)
}

/**
 * 删除角色。
 *
 * @param roleInfo - 待删除的角色信息
 * @returns 是否删除成功
 */
export function deleteRole(roleInfo: RoleInfoDto): Promise<boolean> {
  const url = `${baseUrl}/deleteRole`
  return request.delete<boolean, boolean>(url, {
    data: roleInfo,
  })
}

/**
 * 禁用角色。
 *
 * @param roleInfo - 待禁用的角色信息
 * @returns 是否禁用成功
 */
export function disableRole(roleInfo: RoleInfoDto): Promise<boolean> {
  const url = `${baseUrl}/disableRole`
  return request.post<boolean, boolean>(url, roleInfo)
}

/**
 * 启用角色。
 *
 * @param roleInfo - 待启用的角色信息
 * @returns 是否启用成功
 */
export function enableRole(roleInfo: RoleInfoDto): Promise<boolean> {
  const url = `${baseUrl}/enableRole`
  return request.post<boolean, boolean>(url, roleInfo)
}

/**
 * 获取角色详情。
 *
 * @param id - 角色ID
 * @returns 角色详情
 */
export function getRoleDetail<T extends RoleInfoVo>(id: number): Promise<T> {
  const url = `${baseUrl}/getRoleDetail/${id}`
  return request.get<T, T>(url)
}
