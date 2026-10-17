import { request } from '@/utils/request'

const baseUrl = '/dataDict'

/**
 * 获取数据字典分页列表。
 *
 * @param dataDictionaryDto - 字典筛选条件与分页参数
 * @returns 字典分页结果
 */
export function getDataDictList<T extends ListResponseResult<DataDictionaryVo>>(
  dataDictionaryDto: Partial<DataDictionaryDto> & BaseListDto
): Promise<T> {
  return request.get<T, T>(`${baseUrl}/getDataDictList`, {
    params: dataDictionaryDto,
  })
}

/**
 * 获取数据字典详情。
 *
 * @param id - 字典ID
 * @returns 字典详情
 */
export function getDataDictDetail<T extends DataDictionaryVo>(id: number): Promise<T> {
  return request.get<T, T>(`${baseUrl}/getDataDictDetail`, {
    params: { id },
  })
}

/**
 * 新增数据字典。
 *
 * @param data - 待新增的字典信息
 * @returns 是否新增成功
 */
export function insertDataDict<T extends boolean>(data: DataDictionaryDto): Promise<T> {
  return request.post<T, T>(`${baseUrl}/insertDataDict`, data)
}

/**
 * 修改数据字典。
 *
 * @param data - 待修改的字典信息
 * @returns 是否修改成功
 */
export function updateDataDict<T extends boolean>(data: DataDictionaryDto): Promise<T> {
  return request.put<T, T>(`${baseUrl}/updateDataDict`, data)
}

/**
 * 删除数据字典。
 *
 * @param id - 字典ID
 * @returns 是否删除成功
 */
export function deleteDataDict<T extends boolean>(id: number): Promise<T> {
  return request.delete<T, T>(`${baseUrl}/deleteDataDict/${id}`)
}
