import { request } from '@/utils/request'

const baseUrl = '/dataDict' /**
 * 获取数据字典列表
 * @param { DataDictionaryDto } dataDictionaryDto
 * @returns { Promise<T> }
 */
export function getDataDictList<T extends ListResponseResult<DataDictionaryVo>>(
  dataDictionaryDto: Partial<DataDictionaryDto> & BaseListDto
): Promise<T> {
  return request.get<T, T>(`${baseUrl}/getDataDictList`, {
    params: dataDictionaryDto,
  })
}

/**
 * 获取数据字典详情
 * @param { number } id
 * @returns { Promise<T> }
 */
export function getDataDictDetail<T extends DataDictionaryVo>(id: number): Promise<T> {
  return request.get<T, T>(`${baseUrl}/getDataDictDetail`, {
    params: { id },
  })
}

/**
 * 新增数据字典
 * @param { DataDictionaryDto } data
 * @returns { Promise<T> }
 */
export function insertDataDict<T extends boolean>(data: DataDictionaryDto): Promise<T> {
  return request.post<T, T>(`${baseUrl}/insertDataDict`, data)
}

/**
 * 修改数据字典
 * @param { DataDictionaryDto } data
 * @returns { Promise<T> }
 */
export function updateDataDict<T extends boolean>(data: DataDictionaryDto): Promise<T> {
  return request.put<T, T>(`${baseUrl}/updateDataDict`, data)
}

/**
 * 删除数据字典
 * @param { number } id
 * @returns { Promise<T> }
 */
export function deleteDataDict<T extends boolean>(id: number): Promise<T> {
  return request.delete<T, T>(`${baseUrl}/deleteDataDict/${id}`)
}
