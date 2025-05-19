import { request } from '@utils/request'
const baseUrl = '/studyJavaSysMenu'
/**
 * 获取菜单列表
 * @param {baseListDto} queryFormData
 * @returns {Promise<ResponseResult<ListResponseResult<StudyJavaSysMenuVo>>>}
 */
export function getMenuList<T extends ListResponseResult<StudyJavaSysMenuVo>>(
  queryFormData: baseListDto & Partial<StudyJavaSysMenuVo>
): Promise<ResponseResult<T>> {
  const { pageSize, pageNum, ...otherQueryFormData } = queryFormData
  const url = `${baseUrl}/getMenuList?pageSize=${pageSize}&pageNum=${pageNum}`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: otherQueryFormData,
  })
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
export function addMenu(menuInfo: StudyJavaSysMenuDto): Promise<ResponseResult<boolean>> {
  const url = `${baseUrl}/addMenu`
  return request.post<ResponseResult<boolean>, ResponseResult<boolean>>(url, menuInfo)
}

/**
 * 删除菜单
 * @param {number} menuId
 * @returns {Promise<ResponseResult<boolean>>}
 */
export function deleteMenu(menuId: number): Promise<ResponseResult<boolean>> {
  const url = `${baseUrl}/deleteMenu/${menuId}`
  return request.delete<ResponseResult<boolean>, ResponseResult<boolean>>(url)
}

/**
 * 获取菜单详情
 * @param {number} menuId
 * @returns {Promise<ResponseResult<StudyJavaSysMenuVo>>}
 */
export function getMenuDetail<T extends StudyJavaSysMenuVo>(
  menuId: number
): Promise<ResponseResult<T>> {
  const url = `${baseUrl}/getMenuDetail/${menuId}`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url)
}
