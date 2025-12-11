import { request } from '@utils/request'

/**
 * 查询操作日志列表
 * @param requestParams
 * @returns {Promise<T>}
 */
export const getOperLogList = async <T extends ListResponseResult<OperLogVo>>(
  requestParams: OperLogDto & BaseListDto
) => {
  const url = '/monitor/operlog/list'
  return request.get<T, T>(url, {
    params: requestParams,
  })
}

/**
 * 删除操作日志
 * @param operId
 * @returns {Promise<T>}
 */
export const deleteOperLog = async <T extends boolean>(operId: number | number[]) => {
  const url = '/monitor/operlog/' + operId
  return request.delete<T, T>(url)
}

/**
 * 清空操作日志
 * @returns {Promise<T>}
 */
export const cleanOperLog = async <T extends boolean>() => {
  const url = '/monitor/operlog/clean'
  return request.delete<T, T>(url)
}
