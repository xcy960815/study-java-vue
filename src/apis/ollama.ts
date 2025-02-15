import { request } from '@utils/request'

const buildRequestUrl = (url: string) => `/ollama${url}`

/**
 * generate 接口
 * @returns {Promise<ResponseResult<T>>}
 */
export const generate = <T extends OllamaDto.Generate>(
  generateVo: OllamaVo.Generate
) => {
  const url = buildRequestUrl('/generate')
  return request.post<ResponseResult<T>, ResponseResult<T>>(
    url,
    generateVo
  )
}

/**
 * generateStream 接口
 * @returns {Promise<ResponseResult<T>>}
 */
export const generateStream = async <T extends void>(
  generateStreamVo: OllamaVo.Generate
) => {
  const url =
    'http://localhost:8082/dev-api/ollama/generateStream' //buildRequestUrl('/generateStream')
  const response = await fetch(url, {
    method: 'POST',
    // headers: this.headers,
    body: JSON.stringify(generateStreamVo)
  })
  console.log('response', response)
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
