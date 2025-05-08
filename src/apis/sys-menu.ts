import { request } from '@utils/request'
/**
 * 获取菜单列表
 * @param {baseListParams} queryFormData
 * @returns {Promise<ResponseResult<ListResponseResult<StudyJavaSysMenuDto>>>}
 */
export function getMenuList<T extends ListResponseResult<StudyJavaSysMenuDto>>(
  queryFormData: baseListParams
): Promise<ResponseResult<T>> {
  const url = `/studyJavaSysMenu/list`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: queryFormData,
  })
}

/**
 * 更新菜单信息
 * @param {StudyJavaSysMenuVo} menuInfo
 * @returns {Promise<ResponseResult<boolean>>}
 */
export function updateMenu(menuInfo: StudyJavaSysMenuVo): Promise<ResponseResult<boolean>> {
  const url = `/studyJavaSysMenu`
  return request.put<ResponseResult<boolean>, ResponseResult<boolean>>(url, menuInfo)
}

/**
 * 新增菜单
 * @param {StudyJavaSysMenuDto} menuInfo
 * @returns {Promise<ResponseResult<boolean>>}
 */
export function addMenu(
  menuInfo: Omit<StudyJavaSysMenuDto, 'menuId' | 'createTime' | 'updateTime'>
): Promise<ResponseResult<boolean>> {
  const url = `/studyJavaSysMenu`
  return request.post<ResponseResult<boolean>, ResponseResult<boolean>>(url, menuInfo)
}

/**
 * 删除菜单
 * @param {number} menuId
 * @returns {Promise<ResponseResult<boolean>>}
 */
export function deleteMenu(menuId: number): Promise<ResponseResult<boolean>> {
  const url = `/studyJavaSysMenu/${menuId}`
  return request.delete<ResponseResult<boolean>, ResponseResult<boolean>>(url)
}

/**
 * 获取菜单详情
 * @param {number} menuId
 * @returns {Promise<ResponseResult<StudyJavaSysMenuVo>>}
 */
export function getMenuDetail(menuId: number): Promise<ResponseResult<StudyJavaSysMenuVo>> {
  const url = `/studyJavaSysMenu/${menuId}`
  return request.get<ResponseResult<StudyJavaSysMenuVo>, ResponseResult<StudyJavaSysMenuVo>>(url)
}
