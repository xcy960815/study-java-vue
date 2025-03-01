import { request } from '@utils/request'
import { Gpt } from '@/utils/ai'

/**
 * 获取路径中的参数
 * @param {string} name
 * @returns {sting}
 */
// 假设URL为 http://example.com/?foo=1&bar=2

function getUrlParam(name: string) {
  const regExp = new RegExp(
    '(^|&)' + name + '=([^&]*)(&|$)',
    'i'
  )
  const match = window.location.search
    .substr(1)
    .match(regExp)
  console.log('match', match)

  if (match) {
    return decodeURI(match[2])
  }
  throw new Error(`未在路径中匹配到该参数【${name}】`)
}

const gpt = new Gpt({
  completionsUrl: '/deepseek/completions',
  apiKey: '',
  apiBaseUrl: import.meta.env.VITE_API_DOMAIN_PREFIX,
  markdown2Html: true,
  requestParams: {
    model: 'deepseek-chat'
  }
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

export {}
