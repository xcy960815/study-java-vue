import { request } from '@utils/request'

const buildRequestUrl = (url: string) => `/ollama${url}`

/**
 * models 接口
 * @returns {Promise<ResponseResult<T>>}
 */
export const models = <T extends DeepSeekDto.Models>() => {
  const url = buildRequestUrl('/models')
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url
  )
}

export {}
