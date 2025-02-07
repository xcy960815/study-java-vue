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

/**
 *
 * @returns
 */
export const getModelDetail = <T extends string>() => {
  const url = '/ollama/getModelDetail'
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url
  )
}

export const getGenerate = <T extends string>() => {
  const url = '/ollama/generate'
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url
  )
}
