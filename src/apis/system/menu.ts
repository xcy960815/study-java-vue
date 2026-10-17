import { request } from '@utils/request'

const baseUrl = '/studyJavaSysMenu'

/**
 * 获取菜单分页列表。
 *
 * @param queryFormData - 菜单筛选条件与分页参数
 * @returns 菜单分页结果
 */
export function getMenuList<T extends ListResponseResult<StudyJavaSysMenuVo>>(
  queryFormData: BaseListDto & Partial<StudyJavaSysMenuDto>
): Promise<T> {
  const { pageSize, pageNum, ...otherQueryFormData } = queryFormData
  const url = `${baseUrl}/getMenuList`
  return request.get<T, T>(url, {
    params: { pageNum, pageSize, ...otherQueryFormData },
  })
}

/**
 * 获取菜单树（分页）。
 *
 * @param queryFormData - 菜单筛选条件与分页参数
 * @returns 菜单树分页结果
 */
export function getMenuTree<T extends ListResponseResult<StudyJavaSysMenuVo>>(
  queryFormData: BaseListDto & Partial<StudyJavaSysMenuDto>
): Promise<T> {
  const { pageSize, pageNum, ...otherQueryFormData } = queryFormData
  const url = `${baseUrl}/getMenuTree`
  return request.get<T, T>(url, {
    params: { pageNum, pageSize, ...otherQueryFormData },
  })
}

/**
 * 获取所有菜单树。
 *
 * @returns 全部菜单树
 */
export function getAllMenuTree<T extends Array<StudyJavaSysMenuVo>>(): Promise<T> {
  const url = `${baseUrl}/getAllMenuTree`
  return request.get<T, T>(url)
}

/**
 * 更新菜单信息。
 *
 * @param menuInfo - 菜单信息
 * @returns 是否更新成功
 */
export function updateMenu(menuInfo: StudyJavaSysMenuDto): Promise<boolean> {
  const url = `${baseUrl}/updateMenu`
  return request.put<boolean, boolean>(url, menuInfo)
}

/**
 * 新增菜单。
 *
 * @param menuInfo - 菜单信息
 * @returns 是否新增成功
 */
export function insertMenu(menuInfo: StudyJavaSysMenuDto): Promise<boolean> {
  const url = `${baseUrl}/insertMenu`
  return request.post<boolean, boolean>(url, menuInfo)
}

/**
 * 删除菜单。
 *
 * @param menuInfo - 待删除的菜单信息
 * @returns 是否删除成功
 */
export function deleteMenu(menuInfo: StudyJavaSysMenuDto): Promise<boolean> {
  const url = `${baseUrl}/deleteMenu`
  return request.delete<boolean, boolean>(url, {
    data: menuInfo,
  })
}

/**
 * 获取菜单详情。
 *
 * @param id - 菜单ID
 * @returns 菜单详情
 */
export function getMenuInfo<T extends StudyJavaSysMenuVo>(id: number): Promise<T> {
  const url = `${baseUrl}/getMenuInfo`
  return request.get<T, T>(url, {
    params: {
      id,
    },
  })
}

/**
 * 获取当前登录用户所拥有的路由列表。
 *
 * @returns 用户可见的路由菜单树
 */
export const getRoutes = <T extends Array<StudyJavaSysMenuVo>>() => {
  const url = `${baseUrl}/getRoutes`
  return request.get<T, T>(url)
}
