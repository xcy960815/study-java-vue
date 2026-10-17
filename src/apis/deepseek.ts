import { request } from '@utils/request'

/**
 * 获取 DeepSeek 可用模型列表。
 *
 * @returns DeepSeek 模型列表
 */
export const getModels = <T extends DeepSeekVo.Models>() => {
  return request.get<T, T>('/deepseek/models')
}

/**
 * 获取当前 API Key 的余额。
 *
 * @returns 账户余额信息
 */
export const getBalance = <T extends DeepSeekVo.Balance>() => {
  return request.get<T, T>('/deepseek/balance')
}
