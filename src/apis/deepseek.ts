import { request } from '@utils/request'
import { Gpt } from '@/utils/ai'

const gpt = new Gpt({
  completionsUrl: '/deepseek/completions',
  apiKey: '',
  apiBaseUrl: import.meta.env.VITE_API_DOMAIN_PREFIX,
  markdown2Html: true
})
const buildRequestUrl = (url: string) => `/deepseek${url}`

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

/**
 *
 * @param question
 * @param questionOption
 * @returns
 */
export const completions = async (
  question: string,
  questionOption: AI.Gpt.GetAnswerOptions
) => {
  const response = await gpt.getAnswer(
    question,
    questionOption
  )
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
