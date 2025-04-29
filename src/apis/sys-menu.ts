import { request } from '@utils/request'
/**
 * 获取菜单列表
 * @param {baseListParams} queryFormData
 * @returns {Promise<ResponseResult<Array<StudyJavaSysMenuVo>>>}
 */
export function getMenuList(
  queryFormData: baseListParams & {
    menuName?: string
    menuType?: number
    parentId?: number
  }
): Promise<ResponseResult<Array<StudyJavaSysMenuVo>>> {
  const { pageSize, pageNum, ...otherQueryFormData } = queryFormData
  const url = `/studyJavaSysMenu/list?pageSize=${pageSize}&pageNum=${pageNum}`
  return request.get<
    ResponseResult<Array<StudyJavaSysMenuVo>>,
    ResponseResult<Array<StudyJavaSysMenuVo>>
  >(url, {
    params: otherQueryFormData,
  })
}

/**
 * 更新菜单信息
 * @param {StudyJavaSysMenuDto} menuInfo
 * @returns {Promise<ResponseResult<boolean>>}
 */
export function updateMenu(menuInfo: StudyJavaSysMenuDto): Promise<ResponseResult<boolean>> {
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
