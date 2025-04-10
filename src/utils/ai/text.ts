import { Core } from './core'
import { RoleEnum } from '@enums'
const MODEL = 'text-davinci-003'

const USER_PROMPT_PREFIX = 'User'

const SYSTEM_PROMPT_PREFIX_DEFAULT = 'ChatGPT'

export class Text extends Core {
  /** 默认请求参数 */
  private _requestParams: Omit<AI.Text.RequestParams, 'prompt'>
  /** 用户提示前缀 */
  private _userPromptPrefix: string
  /** 系统提示前缀 */
  private _systemPromptPrefix: string
  /** 会话接口标识符 */
  private _endToken: string

  // private _sepToken: string;

  constructor(options: AI.Text.TextCoreOptions) {
    const { requestParams, userPromptPrefix, systemPromptPrefix, ...coreOption } = options

    super(coreOption)

    this._requestParams = {
      model: MODEL, // 默认的 model
      temperature: 0.8, // 默认的 temperature
      top_p: 1, // 默认的 top_
      presence_penalty: 1, // 默认的 presence_penalty
      ...requestParams
    }

    this._endToken = '<|endoftext|>'

    // this._sepToken = this._endToken;

    if (!this._requestParams.stop) {
      this._requestParams.stop = [this._endToken]
    }
    /** 用户前缀 */
    this._userPromptPrefix = userPromptPrefix || USER_PROMPT_PREFIX

    /** 系统前缀 */
    this._systemPromptPrefix = systemPromptPrefix || SYSTEM_PROMPT_PREFIX_DEFAULT
  }

  /**
   * 构建fetch公共请求参数
   * @param {string} question
   * @param {AI.Gpt.CompletionsOptions} options
   * @returns {Promise<AI.FetchRequestInit>}
   */
  private async _getFetchRequestInit(
    question: string,
    options: AI.Text.CompletionsOptions
  ): Promise<AI.FetchRequestInit> {
    const { onProgress, stream = onProgress ? true : false, requestParams } = options
    // 获取用户和gpt历史对话记录
    const { prompt, maxTokens } = await this._getConversationHistory(question, options)
    const body = {
      ...this._requestParams,
      ...requestParams,
      prompt,
      stream,
      max_tokens: maxTokens
    }
    const requestInit: AI.FetchRequestInit = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
      signal: this._abortController.signal
    }
    return requestInit
  }

  /**
   * 发送请求到OpenAI
   * @param {string} text
   * @param {AI.Text.CompletionsOptions} options
   * @returns {Promise<AI.Text.AssistantConversation>}
   */
  public async completions(text: string, options: AI.Text.CompletionsOptions): Promise<AI.Text.AssistantConversation> {
    const { onProgress, stream = onProgress ? true : false, requestParams } = options
    // 构建用户消息
    const userMessage = this.buildConversation(RoleEnum.User, text, options)
    await this.upsertConversation(userMessage)

    /* 构建助手消息 */
    const assistantMessage = this.buildConversation(RoleEnum.Assistant, '', {
      ...options,
      messageId: userMessage.messageId
    })
    const responseP = new Promise<AI.Text.AssistantConversation>(async (resolve, reject) => {
      const requestInit = await this._getFetchRequestInit(text, options)

      if (stream) {
        requestInit.onMessage = (data: string) => {
          if (data === '[DONE]') {
            assistantMessage.content = assistantMessage.content.trim()
            resolve(assistantMessage)
            return
          }
          try {
            const response: AI.Text.Response = JSON.parse(data)
            if (response.id) {
              assistantMessage.messageId = response.id
            }
            if (response?.choices?.length) {
              // 这个模型返回的数据是一个字一个字返回的 需要累加操作
              assistantMessage.content += response.choices[0].text
              assistantMessage.detail = response
              onProgress?.(assistantMessage)
            }
          } catch (error) {
            console.warn('ChatGPT stream SEE event unexpected error', error)
            reject(error)
            return
          }
        }
        await this._fetchSSE(this.completionsUrl, requestInit).catch(reject)
      } else {
        try {
          const response = await this._fetchSSE<AI.Text.Response>(this.completionsUrl, requestInit)
          const data = await response?.json()
          if (data?.id) {
            assistantMessage.messageId = data.id
          }
          if (data?.choices?.length) {
            assistantMessage.content = data?.choices[0]?.text?.trim() || ''
          }
          assistantMessage.detail = data

          resolve(assistantMessage)

          return
        } catch (error) {
          return reject(error)
        }
      }
    }).then((Conversation) => {
      return this.upsertConversation(Conversation).then(() => {
        Conversation.parentMessageId = Conversation.messageId
        return Conversation
      })
    })
    return this.clearablePromise(responseP, {
      milliseconds: this._milliseconds,
      message: ``
    })
  }
  /**
   * 构建 prompt 获取 maxTokens
   * @param {string} message
   * @param {AI.Text.SendMessageOptions} options
   * @returns {Promise<{prompt: string, maxTokens: number}>
   */
  private async _getConversationHistory(
    message: string,
    options: AI.Text.CompletionsOptions
  ): Promise<{
    prompt: string
    maxTokens: number
  }> {
    const systemMessage = `System:${options.systemMessage || this._systemMessage}${this._endToken}`
    // 系统提示符前缀
    const systemPromptPrefix = options.systemPromptPrefix || `${this._systemPromptPrefix}:`
    const maxTokenCount = this._maxModelTokens - this._maxResponseTokens
    let parentMessageId = options.parentMessageId
    // 当前用户消息
    const currentUserPrompt = `${this._userPromptPrefix}:${message}${this._endToken}`
    // 历史消息
    let historyPrompt = ''

    let tokenCount = 0

    while (this._withContent) {
      const prompt = `${systemMessage}${historyPrompt}${currentUserPrompt}${systemPromptPrefix}`
      tokenCount = await this.getTokenCount(prompt)
      // 当前 prompt token 数量大于最大 token 数量时，不再向上查找
      if (prompt && tokenCount > maxTokenCount) {
        break
      }
      if (!parentMessageId) {
        break
      }
      const parentMessage = await this.getConversation(parentMessageId)
      if (!parentMessage) {
        break
      }
      const parentMessageRole = parentMessage.role
      const parentMessagePromptPrefix = parentMessageRole === 'user' ? this._userPromptPrefix : this._systemPromptPrefix
      // 历史消息
      const parentMessagePrompt = `${parentMessagePromptPrefix}:${parentMessage.content}${this._endToken}`
      historyPrompt = `${parentMessagePrompt}${historyPrompt}`
      parentMessageId = parentMessage.parentMessageId
    }

    const prompt = `${systemMessage}${historyPrompt}${currentUserPrompt}${systemPromptPrefix}`

    const maxTokens = Math.max(1, Math.min(this._maxModelTokens - tokenCount, this._maxResponseTokens))

    return { prompt, maxTokens }
  }
}
