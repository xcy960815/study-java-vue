import { request } from '@utils/request'
const baseUrl = '/studyJavaSysMenu'
/**
 * 获取菜单列表
 * @param {BaseListDto} queryFormData
 * @returns {Promise<ResponseResult<ListResponseResult<StudyJavaSysMenuVo>>>}
 */
export function getMenuList<T extends ListResponseResult<StudyJavaSysMenuVo>>(
  queryFormData: BaseListDto & Partial<StudyJavaSysMenuDto>
): Promise<ResponseResult<T>> {
  const { pageSize, pageNum, ...otherQueryFormData } = queryFormData
  const url = `${baseUrl}/getMenuList?pageSize=${pageSize}&pageNum=${pageNum}`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: otherQueryFormData,
  })
}

/**
 * 获取菜单树
 * @returns {Promise<ResponseResult<StudyJavaSysMenuVo[]>>}
 */
export function getMenuTree<T extends ListResponseResult<StudyJavaSysMenuVo>>(
  queryFormData: BaseListDto & Partial<StudyJavaSysMenuDto>
): Promise<ResponseResult<T>> {
  const { pageSize, pageNum, ...otherQueryFormData } = queryFormData
  const url = `${baseUrl}/getMenuTree?pageSize=${pageSize}&pageNum=${pageNum}`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: otherQueryFormData,
  })
}

/**
 * 获取所有菜单树
 * @returns {Promise<ResponseResult<StudyJavaSysMenuVo[]>>}
 */
export function getAllMenuTree<T extends Array<StudyJavaSysMenuVo>>(): Promise<ResponseResult<T>> {
  const url = `${baseUrl}/getAllMenuTree`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url)
}

/**
 * 更新菜单信息
 * @param {StudyJavaSysMenuDto} menuInfo
 * @returns {Promise<ResponseResult<boolean>>}
 */
export function updateMenu(menuInfo: StudyJavaSysMenuDto): Promise<ResponseResult<boolean>> {
  const url = `${baseUrl}/updateMenu`
  return request.put<ResponseResult<boolean>, ResponseResult<boolean>>(url, menuInfo)
}

/**
 * 新增菜单
 * @param {StudyJavaSysMenuDto} menuInfo
 * @returns {Promise<ResponseResult<boolean>>}
 */
export function insertMenu(menuInfo: StudyJavaSysMenuDto): Promise<ResponseResult<boolean>> {
  const url = `${baseUrl}/insertMenu`
  return request.post<ResponseResult<boolean>, ResponseResult<boolean>>(url, menuInfo)
}

/**
 * 删除菜单
 * @param {StudyJavaSysMenuVo} menuInfo
 * @returns {Promise<ResponseResult<boolean>>}
 */
export function deleteMenu(menuInfo: StudyJavaSysMenuDto): Promise<ResponseResult<boolean>> {
  const url = `${baseUrl}/deleteMenu`
  return request.delete<ResponseResult<boolean>, ResponseResult<boolean>>(url, {
    data: menuInfo,
  })
}

/**
 * 获取菜单详情
 * @param {number} menuId
 * @returns {Promise<ResponseResult<StudyJavaSysMenuVo>>}
 */
export function getMenuInfo<T extends StudyJavaSysMenuVo>(id: number): Promise<ResponseResult<T>> {
  const url = `${baseUrl}/getMenuInfo`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: {
      id,
    },
  })
}

/**
 * 获取当前登录用户所拥有的路由列表
 * @returns {Promise<ResponseResult<Array<StudyJavaSysMenuVo>>>>}
 */
export const getRoutes = <T extends Array<StudyJavaSysMenuVo>>() => {
  const url = `${baseUrl}/getRoutes`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url)
}
