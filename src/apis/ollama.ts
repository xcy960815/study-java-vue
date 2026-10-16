import { request } from '@utils/request'

const buildRequestUrl = (url: string) => `/ollama${url}`

/**
 * version 接口
 * @returns {Promise<T>}
 */
export const version = <T extends OllamaVo.Version>() => {
  const url = buildRequestUrl('/version')
  return request.get<T, T>(url)
}

/**
 * models 接口
 * @returns {Promise<T>}
 */
export const models = <T extends OllamaVo.Models>() => {
  const url = buildRequestUrl('/models')
  return request.get<T, T>(url)
}

/**
 * ps 接口
 * @returns {Promise<T>}
 */
export const ps = <T extends OllamaVo.Ps>() => {
  const url = buildRequestUrl('/ps')
  return request.get<T, T>(url)
}

/**
 * tags 接口
 * @returns {Promise<T>}
 */
export const tags = <T extends OllamaVo.Tags>() => {
  const url = buildRequestUrl('/tags')
  return request.get<T, T>(url)
}

/**
 * delete 接口
 * @returns {Promise<T>}
 */
export const deleteModel = <T extends boolean>(deleteModelDto: OllamaDto.DeleteModelVo) => {
  const url = buildRequestUrl('/delete')
  return request.delete<T, T>(url, {
    data: deleteModelDto,
  })
}
