import { request } from '@utils/request'

const buildRequestUrl = (url: string) => `/ollama${url}`

/**
 * generate 接口
 * @returns {Promise<T>}
 */
export const generate = <T extends OllamaVo.Generate>(generateDto: OllamaDto.Generate) => {
  const url = buildRequestUrl('/generate')
  return request.post<T, T>(url, generateDto)
}

/**
 * generateStream 接口
 * @returns {Promise<ResponseResult<T>>}
 */
export const generateStream = async (generateStreamDto: OllamaDto.Generate) => {
  const url = 'http://localhost:8082/dev-api/ollama/generateStream'
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(generateStreamDto),
  })
}

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
