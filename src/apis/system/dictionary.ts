import { request } from '@/utils/request'

const baseUrl = '/dataDictionary' /**
 * 获取数据字典列表
 * @param { DataDictionaryDto } dataDictionaryDto
 * @returns { Promise<ResponseResult<T>> }
 */

export function getDataDictionaryList<T extends ListResponseResult<DataDictionaryVo>>(
  dataDictionaryDto: Partial<DataDictionaryDto> & BaseListDto
): Promise<ResponseResult<T>> {
  return request.get<ResponseResult<T>, ResponseResult<T>>(`${baseUrl}/list`, {
    params: dataDictionaryDto,
  })
}

/**
 * 获取数据字典详情
 * @param { number } id
 * @returns { Promise<ResponseResult<T>> }
 */
export function getDataDictionaryDetail<T extends DataDictionaryVo>(
  id: number
): Promise<ResponseResult<T>> {
  return request.get<ResponseResult<T>, ResponseResult<T>>(`${baseUrl}/detail`, {
    params: { id },
  })
}

/**
 * 新增数据字典
 * @param { DataDictionaryDto } data
 * @returns { Promise<ResponseResult<T>> }
 */
export function addDataDictionary<T extends boolean>(
  data: DataDictionaryDto
): Promise<ResponseResult<T>> {
  return request.post<ResponseResult<T>, ResponseResult<T>>(`${baseUrl}/add`, data)
}

/**
 * 修改数据字典
 * @param { DataDictionaryDto } data
 * @returns { Promise<ResponseResult<T>> }
 */
export function updateDataDictionary<T extends boolean>(
  data: DataDictionaryDto
): Promise<ResponseResult<T>> {
  return request.put<ResponseResult<T>, ResponseResult<T>>(`${baseUrl}/update`, data)
}

/**
 * 删除数据字典
 * @param { number } id
 * @returns { Promise<ResponseResult<T>> }
 */
export function deleteDataDictionary<T extends boolean>(id: number): Promise<ResponseResult<T>> {
  return request.delete<ResponseResult<T>, ResponseResult<T>>(`${baseUrl}/delete/${id}`)
}
