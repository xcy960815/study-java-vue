import { request } from '@utils/request'

const buildRequestUrl = (url: string) => `/ollama${url}`

/**
 * generate 接口
 * @returns {Promise<ResponseResult<T>>}
 */
export const generate = <
  T extends OllamaDto.Generate
>() => {
  const url = buildRequestUrl('/generate')
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url
  )
}

/**
 * version 接口
 * @returns {Promise<ResponseResult<T>>}
 */
export const version = <T extends OllamaDto.Version>() => {
  const url = buildRequestUrl('/version')
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url
  )
}

/**
 * models 接口
 * @returns {Promise<ResponseResult<T>>}
 */
export const models = <T extends OllamaDto.Models>() => {
  const url = buildRequestUrl('/models')
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url
  )
}

/**
 * ps 接口
 * @returns {Promise<ResponseResult<T>>}
 */
export const ps = <T extends OllamaDto.Ps>() => {
  const url = buildRequestUrl('/ps')
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url
  )
}

/**
 * tags 接口
 * @returns {Promise<ResponseResult<T>>}
 */
export const tags = <T extends OllamaDto.Tags>() => {
  const url = buildRequestUrl('/tags')
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url
  )
}
