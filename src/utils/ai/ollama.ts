import { Core } from './core'
import { RoleEnum } from '@enums'

const MODEL = 'deepseek-chat'

/**
 * Ollama 聊天模型适配器
 * 负责与后端模型进行对话请求、流式处理、历史消息拼接等
 */
export class Ollama extends Core {
  /**
   * 请求参数（不包含 messages、n、stream）
   */
  private readonly _requestParams: Partial<Omit<AI.Gpt.RequestParams, 'messages' | 'n' | 'stream'>>

  constructor(options: AI.Gpt.GptCoreOptions) {
    const { requestParams, ...coreOptions } = options
    super(coreOptions)
    // 合并默认参数和用户参数
    this._requestParams = {
      model: MODEL,
      temperature: 0.8,
      top_p: 1,
      presence_penalty: 1,
      ...requestParams,
    }
  }

  /**
   * 构建 fetch 公共请求参数
   */
  private async buildFetchRequestInit(
    question: string,
    options: AI.Gpt.CompletionsOptions
  ): Promise<AI.FetchRequestInit> {
    const { onProgress, stream = !!onProgress, requestParams } = options
    const { messages, maxTokens } = await this.getConversationHistory(question, options)
    const body = {
      ...this._requestParams,
      ...requestParams,
      messages,
      stream,
      max_tokens: maxTokens,
    }
    return {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
      signal: this._abortController.signal,
    }
  }

  /**
   * 主对话入口
   */
  public async completions(
    question: string,
    options: AI.Gpt.CompletionsOptions
  ): Promise<AI.Gpt.AssistantConversation> {
    const userConversation = this.buildConversation(RoleEnum.User, question, options)
    await this.upsertConversation(userConversation)
    this._currentConversation = this.buildConversation(RoleEnum.Assistant, '', {
      ...options,
      messageId: userConversation.messageId,
    })
    const conversationPromise = this.handleAnswerRequest(question, options)
      .then(async (conversation) => {
        await this.upsertConversation(conversation)
        conversation.parentMessageId = conversation.messageId
        return conversation
      })
      .catch((error) => {
        this._currentConversation = null
        throw error
      })
    return this.clearablePromise<AI.Gpt.AssistantConversation>(conversationPromise, {
      milliseconds: this._milliseconds,
      message: '',
    })
  }

  /**
   * 处理回答请求（流式/非流式）
   */
  private async handleAnswerRequest(
    question: string,
    options: AI.Gpt.CompletionsOptions
  ): Promise<AI.Gpt.AssistantConversation> {
    const { stream = !!options.onProgress } = options
    const requestInit = await this.buildFetchRequestInit(question, options)
    return stream
      ? this.handleStreamResponse(requestInit, options.onProgress)
      : this.handleNonStreamResponse(requestInit)
  }

  /**
   * 处理流式响应
   */
  private async handleStreamResponse(
    requestInit: AI.FetchRequestInit,
    onProgress?: AI.Gpt.CompletionsOptions['onProgress']
  ): Promise<AI.Gpt.AssistantConversation> {
    return new Promise<AI.Gpt.AssistantConversation>((resolve, reject) => {
      requestInit.onMessage = (data: string) => {
        this.processStreamData(data, resolve, onProgress)
      }
      this._fetchSSE<AI.Gpt.Response>(this.completionsUrl, requestInit).catch(reject)
    })
  }

  /**
   * 处理流式数据
   */
  private processStreamData(
    data: string,
    resolve: (value: AI.Gpt.AssistantConversation) => void,
    onProgress?: AI.Gpt.CompletionsOptions['onProgress']
  ): void {
    // 处理 [DONE] 标记
    if (data.trim() === '[DONE]') {
      if (this._currentConversation) {
        this._currentConversation.content = this._currentConversation.content.trim()
        this._currentConversation.done = true
        this._currentConversation.thinking = false
        resolve(this._currentConversation)
      }
      return
    }

    // 尝试解析 JSON 数据
    try {
      const response: AI.Gpt.Response = JSON.parse(data)
      if (this._currentConversation) {
        this.updateConversationFromResponse(response)
        onProgress?.(this._currentConversation)
      }
    } catch (error) {
      // 忽略非 JSON 数据的解析错误
      if (data.trim() !== '[DONE]') {
        console.error('Failed to parse stream data:', error, 'Raw data:', data)
      }
    }
  }

  /**
   * 处理非流式响应
   */
  private async handleNonStreamResponse(
    requestInit: AI.FetchRequestInit
  ): Promise<AI.Gpt.AssistantConversation> {
    const response = await this._fetchSSE<AI.Gpt.Response>(this.completionsUrl, requestInit)
    const data = await response?.json()
    if (data) {
      this.updateConversationFromResponse(data)
    }
    return this._currentConversation!
  }

  /**
   * 根据响应更新当前会话内容
   */
  private updateConversationFromResponse(response: AI.Gpt.Response): void {
    if (!this._currentConversation) return
    if (response?.id) {
      this._currentConversation.messageId = response.id
    }
    if (response?.choices?.length) {
      const choice = response.choices[0]
      const messageOrDelta = 'message' in choice ? choice.message : choice.delta
      if (messageOrDelta?.content) {
        this._currentConversation.content += messageOrDelta.content || ''
      }
      if (messageOrDelta?.role) {
        this._currentConversation.role = messageOrDelta.role
      }
    }
    this._currentConversation.detail = response
    this._currentConversation.thinking = false
  }

  /**
   * 获取会话消息历史
   */
  private async getConversationHistory(
    text: string,
    options: AI.Gpt.CompletionsOptions
  ): Promise<{
    messages: Array<AI.Gpt.RequestMessage>
    maxTokens: number
  }> {
    const { systemMessage } = options
    const maxTokenCount = this._maxModelTokens - this._maxResponseTokens
    let parentMessageId = options.parentMessageId
    // 当前系统和用户消息
    const messages: Array<AI.Gpt.RequestMessage> = [
      {
        role: RoleEnum.System,
        content: systemMessage || this._systemMessage,
      },
      {
        role: RoleEnum.User,
        content: text,
      },
    ]
    let tokenCount = 0
    let prompt = ''
    while (this._withContent) {
      messages.forEach((item) => {
        prompt += item.role
        prompt += item.content
      })
      tokenCount = this.getTokenCount(prompt)
      if (prompt && tokenCount > maxTokenCount) break
      if (!parentMessageId) break
      const parentMessage = await this.getConversation(parentMessageId)
      if (!parentMessage) break
      const historyConversation = {
        role: parentMessage.role,
        content: parentMessage.content,
      }
      messages.splice(1, 0, historyConversation)
      parentMessageId = parentMessage.parentMessageId
    }
    const maxTokens = Math.max(
      1,
      Math.min(this._maxModelTokens - tokenCount, this._maxResponseTokens)
    )
    return { messages, maxTokens }
  }
}
