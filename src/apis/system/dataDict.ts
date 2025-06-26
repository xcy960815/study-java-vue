import { request } from '@/utils/request'

const baseUrl = '/dataDict' /**
 * 获取数据字典列表
 * @param { DataDictionaryDto } dataDictionaryDto
 * @returns { Promise<ResponseResult<T>> }
 */
export function getDataDictList<T extends ListResponseResult<DataDictionaryVo>>(
  dataDictionaryDto: Partial<DataDictionaryDto> & BaseListDto
): Promise<ResponseResult<T>> {
  return request.get<ResponseResult<T>, ResponseResult<T>>(`${baseUrl}/getDataDictList`, {
    params: dataDictionaryDto,
  })
}

/**
 * 获取数据字典详情
 * @param { number } id
 * @returns { Promise<ResponseResult<T>> }
 */
export function getDataDictDetail<T extends DataDictionaryVo>(
  id: number
): Promise<ResponseResult<T>> {
  return request.get<ResponseResult<T>, ResponseResult<T>>(`${baseUrl}/getDataDictDetail`, {
    params: { id },
  })
}

/**
 * 新增数据字典
 * @param { DataDictionaryDto } data
 * @returns { Promise<ResponseResult<T>> }
 */
export function insertDataDict<T extends boolean>(
  data: DataDictionaryDto
): Promise<ResponseResult<T>> {
  return request.post<ResponseResult<T>, ResponseResult<T>>(`${baseUrl}/insertDataDict`, data)
}

/**
 * 修改数据字典
 * @param { DataDictionaryDto } data
 * @returns { Promise<ResponseResult<T>> }
 */
export function updateDataDict<T extends boolean>(
  data: DataDictionaryDto
): Promise<ResponseResult<T>> {
  return request.put<ResponseResult<T>, ResponseResult<T>>(`${baseUrl}/updateDataDict`, data)
}

/**
 * 删除数据字典
 * @param { number } id
 * @returns { Promise<ResponseResult<T>> }
 */
export function deleteDataDict<T extends boolean>(id: number): Promise<ResponseResult<T>> {
  return request.delete<ResponseResult<T>, ResponseResult<T>>(`${baseUrl}/deleteDataDict/${id}`)
}
