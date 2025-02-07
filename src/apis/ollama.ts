import { request } from '@utils/request'

/**
 * 获取本地Ollama模型列表
 * @returns ResponseResult
 */
export const getModels = <T extends string>() => {
  const url = '/ollama/getModels'
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url
  )
}
