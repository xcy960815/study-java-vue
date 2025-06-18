import { CompletionsCore } from '../utils/completions-core'
import { RoleEnum } from '@enums'

const MODEL = 'deepseek-chat'

/**
 * Completions 聊天模型适配器
 * 负责与 AI 模型进行对话请求、流式处理、历史消息拼接等
 */
class Completions extends CompletionsCore {
  /**
   * 请求参数（不包含 messages、n、stream）
   */
  private readonly _requestParams: Partial<Omit<AI.Gpt.RequestParams, 'messages' | 'n' | 'stream'>>

  constructor(options: AI.Gpt.GptCoreOptions) {
    const { requestParams, ...coreOptions } = options
    super(coreOptions)
    this._requestParams = {
      model: MODEL,
      temperature: 0.8,
      top_p: 1,
      presence_penalty: 1,
      ...requestParams,
    }
  }

  /**
   * 构建 fetch 请求参数
   */
  private async buildFetchRequestInit(
    question: string,
    options: AI.Gpt.CompletionsOptions
  ): Promise<AI.FetchRequestInit> {
    const { onProgress, stream = !!onProgress, requestParams } = options
    const { messages, maxTokens } = await this.getConversationHistory(question, options)

    return {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        ...this._requestParams,
        ...requestParams,
        messages,
        stream,
        max_tokens: maxTokens,
      }),
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
    const { onProgress, stream = !!onProgress } = options

    // 构建并保存用户消息
    const userMessage = this.buildConversation(RoleEnum.User, question, options)
    await this.upsertConversation(userMessage)

    // 构建并保存助手消息
    const assistantMessage = this.buildConversation(RoleEnum.Assistant, '', {
      ...options,
      messageId: userMessage.messageId,
    })
    await this.upsertConversation(assistantMessage)

    // 处理响应
    const conversationPromise = this.handleAnswerRequest(assistantMessage, options)
      .then(async (conversation) => {
        await this.upsertConversation(conversation)
        conversation.parentMessageId = conversation.messageId
        return conversation
      })
      .catch((error) => {
        console.error('AI EventStream error:', error)
        throw error
      })

    return this.clearablePromise(conversationPromise, {
      milliseconds: this._milliseconds,
      message: '',
    })
  }

  /**
   * 处理回答请求（流式/非流式）
   */
  private async handleAnswerRequest(
    assistantMessage: AI.Gpt.AssistantConversation,
    options: AI.Gpt.CompletionsOptions
  ): Promise<AI.Gpt.AssistantConversation> {
    const { onProgress, stream = !!onProgress } = options
    const requestInit = await this.buildFetchRequestInit(assistantMessage.content, options)

    if (stream) {
      return this.handleStreamResponse(assistantMessage, requestInit, onProgress)
    }
    return this.handleNonStreamResponse(assistantMessage, requestInit)
  }

  /**
   * 处理流式响应
   */
  private async handleStreamResponse(
    assistantMessage: AI.Gpt.AssistantConversation,
    requestInit: AI.FetchRequestInit,
    onProgress?: AI.Gpt.CompletionsOptions['onProgress']
  ): Promise<AI.Gpt.AssistantConversation> {
    return new Promise<AI.Gpt.AssistantConversation>((resolve, reject) => {
      requestInit.onMessage = (data: string) => {
        this.processStreamData(assistantMessage, data, resolve, onProgress)
      }
      this._fetchSSE<AI.Gpt.Response>(this.completionsUrl, requestInit).catch(reject)
    })
  }

  /**
   * 处理流式数据
   */
  private processStreamData(
    assistantMessage: AI.Gpt.AssistantConversation,
    data: string,
    resolve: (value: AI.Gpt.AssistantConversation) => void,
    onProgress?: AI.Gpt.CompletionsOptions['onProgress']
  ): void {
    if (data.trim() === '[DONE]') {
      assistantMessage.content = assistantMessage.content.trim()
      assistantMessage.done = true
      assistantMessage.thinking = false
      resolve(assistantMessage)
      return
    }

    try {
      const response: AI.Gpt.Response = JSON.parse(data)
      this.updateConversationFromResponse(assistantMessage, response)
      onProgress?.(assistantMessage)
    } catch (error) {
      if (data.trim() !== '[DONE]') {
        console.error('Failed to parse stream data:', error, 'Raw data:', data)
      }
    }
  }

  /**
   * 处理非流式响应
   */
  private async handleNonStreamResponse(
    assistantMessage: AI.Gpt.AssistantConversation,
    requestInit: AI.FetchRequestInit
  ): Promise<AI.Gpt.AssistantConversation> {
    const response = await this._fetchSSE<AI.Gpt.Response>(this.completionsUrl, requestInit)
    const data = await response?.json()
    if (data) {
      this.updateConversationFromResponse(assistantMessage, data)
    }
    return assistantMessage
  }

  /**
   * 根据响应更新会话内容
   */
  private updateConversationFromResponse(
    assistantMessage: AI.Gpt.AssistantConversation,
    response: AI.Gpt.Response
  ): void {
    if (response?.id) {
      assistantMessage.messageId = response.id
    }
    if (response?.choices?.length) {
      const choice = response.choices[0]
      const messageOrDelta = 'message' in choice ? choice.message : choice.delta
      if (messageOrDelta?.content) {
        assistantMessage.content += messageOrDelta.content
      }
      if (messageOrDelta?.role) {
        assistantMessage.role = messageOrDelta.role
      }
    }
    assistantMessage.detail = response
    assistantMessage.thinking = false
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

      messages.splice(1, 0, {
        role: parentMessage.role,
        content: parentMessage.content,
      })
      parentMessageId = parentMessage.parentMessageId
    }

    const maxTokens = Math.max(
      1,
      Math.min(this._maxModelTokens - tokenCount, this._maxResponseTokens)
    )
    return { messages, maxTokens }
  }
}

export const useCompletions = () => {
  return {
    Completions,
  }
}
