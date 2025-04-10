import { request } from '@utils/request'
import { Gpt } from '@utils/ai'

const gpt = new Gpt({
  completionsUrl: '/deepseek/completions',
  //   apiKey: '',
  apiBaseUrl: import.meta.env.VITE_API_DOMAIN_PREFIX
  // markdown2Html: true
})

/**
 * 构建deepseek 请求地址
 * @param {string} url 请求地址
 * @returns {string}
 */
const buildRequestUrl = (url: string) => `/deepseek${url}`

/**
 * models 接口
 * @returns {Promise<ResponseResult<T>>}
 */
export const models = <T extends DeepSeekDto.Models>() => {
  const url = buildRequestUrl('/models')
  return request.get<ResponseResult<T>, ResponseResult<T>>(url)
}

/**
 * balance 接口
 * @returns {Promise<ResponseResult<T>>}
 */
export const balance = <T extends DeepSeekDto.Balance>() => {
  const url = buildRequestUrl('/balance')
  return request.get<ResponseResult<T>, ResponseResult<T>>(url)
}

/**
 *
 * @param question
 * @param questionOption
 * @returns
 */
export const completions = async (question: string, questionOption: AI.Gpt.CompletionsOptions) => {
  const response = await gpt.completions(question, questionOption)
  return response
}
/**
 * 终止回答
 */
export const cancelConversation = () => {
  gpt.cancelConversation('手动停止回答')
}

/**
 * 获取会话列表
 * @returns {Promise<AI.Conversation[]>}
 */
export const getAllConversations = async () => {
  return await gpt.getAllConversations()
}
