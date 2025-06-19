import { createParser, type EventSourceParser } from 'eventsource-parser'
import { v4 as uuidv4 } from 'uuid'
import { encode } from 'gpt-tokenizer'
import { RoleEnum } from '@enums'

const KEEPALIVE_FLAG = ' : keep-alive'
const DATA_PREFIX = 'data:'
const DEFAULT_API_BASE_URL = 'https://api.AI.com'
const DEFAULT_MAX_MODEL_TOKENS = 4096
const DEFAULT_MAX_RESPONSE_TOKENS = 1000
const DEFAULT_TIMEOUT = 1000 * 60

/**
 * AI 聊天核心类
 * 提供基础的对话管理、请求处理、流式响应等功能
 */
export class CompletionsCore {
  /** API 密钥 */
  protected readonly _apiKey: string
  /** API 基础 URL */
  protected readonly _apiBaseUrl: string
  /** 组织 ID */
  protected readonly _organization?: string
  /** 是否开启调试模式 */
  protected readonly _debug: boolean
  /** 是否携带上下文 */
  protected readonly _withContent: boolean
  /** 消息存储 */
  protected readonly _messageStore: Map<string, AI.Conversation>
  /** 最大模型 token 数 */
  protected readonly _maxModelTokens: number
  /** 最大响应 token 数 */
  protected readonly _maxResponseTokens: number
  /** 系统消息 */
  protected readonly _systemMessage: string
  /** 请求超时时间 */
  protected readonly _milliseconds: number
  /** 当前模型的请求地址 */
  private readonly _completionsUrl?: string
  /** 请求取消控制器 */
  protected _abortController: AbortController
  /** 当前正在处理的会话 */
  protected _currentConversation: AI.Gpt.AssistantConversation | null = null

  constructor(options: AI.CoreOptions) {
    const {
      apiKey = '',
      apiBaseUrl = DEFAULT_API_BASE_URL,
      organization,
      debug = false,
      withContent = true,
      maxModelTokens = DEFAULT_MAX_MODEL_TOKENS,
      maxResponseTokens = DEFAULT_MAX_RESPONSE_TOKENS,
      systemMessage = `你是Ai助手,帮助用户使用代码。您聪明、乐于助人、专业的开发人员，总是给出正确的答案，并且只按照指示执行。你的回答始终如实，不会造假,返回结果用markdown显示`,
      milliseconds = DEFAULT_TIMEOUT,
      completionsUrl,
    } = options

    this._apiKey = apiKey
    this._apiBaseUrl = apiBaseUrl
    this._organization = organization
    this._debug = debug
    this._withContent = withContent
    this._maxModelTokens = maxModelTokens
    this._maxResponseTokens = maxResponseTokens
    this._systemMessage = systemMessage
    this._milliseconds = milliseconds
    this._completionsUrl = completionsUrl
    this._messageStore = new Map()
    this._abortController = new AbortController()
  }

  /**
   * 获取模型列表 URL
   */
  private get _modelsUrl(): string {
    return `${this._apiBaseUrl}/v1/models`
  }

  /**
   * 获取对话请求 URL
   */
  protected get completionsUrl(): string {
    return `${this._apiBaseUrl}${this._completionsUrl ?? '/v1/chat/completions'}`
  }

  /**
   * 生成唯一 ID
   */
  protected get uuid(): string {
    return uuidv4()
  }

  /**
   * 获取请求头
   */
  protected get headers(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this._apiKey}`,
    }

    if (this._organization) {
      headers['AI-Organization'] = this._organization
    }

    return headers
  }

  /**
   * 计算文本的 token 数量
   */
  protected getTokenCount(text: string): number {
    return encode(text).length
  }

  /**
   * 构建用户会话消息
   */
  public buildConversation(
    role: RoleEnum.User,
    content: string,
    option: AI.CompletionsOptions
  ): AI.Conversation
  /**
   * 构建助手会话消息
   */
  public buildConversation(
    role: RoleEnum.Assistant,
    content: string,
    option: AI.CompletionsOptions
  ): AI.Gpt.AssistantConversation
  /**
   * 构建会话消息
   */
  public buildConversation(
    role: RoleEnum.User | RoleEnum.Assistant,
    content: string,
    option: AI.CompletionsOptions
  ): AI.Conversation | AI.Gpt.AssistantConversation {
    const messageId = option.messageId || this.uuid
    const parentMessageId = option.parentMessageId || this.uuid

    if (role === RoleEnum.User) {
      return {
        role: RoleEnum.User,
        messageId,
        parentMessageId,
        content,
      }
    }

    if (role === RoleEnum.Assistant) {
      return {
        role: RoleEnum.Assistant,
        messageId: '',
        parentMessageId: messageId,
        content,
        detail: null,
        thinking: true,
        done: false,
      }
    }

    throw new Error('Invalid role type')
  }

  /**
   * 获取指定 ID 的会话
   */
  protected async getConversation(id: string): Promise<AI.Conversation | undefined> {
    return this._messageStore.get(id)
  }

  /**
   * 获取所有会话
   */
  public async getAllConversations(): Promise<AI.Conversation[]> {
    return Array.from(this._messageStore.values())
  }

  /**
   * 更新或插入会话
   */
  protected async upsertConversation(message: AI.Conversation): Promise<void> {
    this._messageStore.set(message.messageId, { ...message })
  }

  /**
   * 清空所有会话
   */
  protected async _clearConversation(): Promise<void> {
    this._messageStore.clear()
  }

  /**
   * 输出调试日志
   */
  protected _debugLog(action: string, ...args: unknown[]): void {
    if (this._debug) {
      console.log(`AI-apis:DEBUG:${action}`, ...args)
    }
  }

  /**
   * 将 ReadableStream 转换为异步迭代器
   */
  private async *streamAsyncIterable(
    stream: ReadableStream<Uint8Array>
  ): AsyncIterable<Uint8Array> {
    const reader = stream.getReader()
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        yield value!
      }
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * 发送 SSE 请求
   */
  protected async _fetchSSE<R extends object>(
    url: string,
    requestInit: AI.FetchRequestInit
  ): Promise<AI.AnswerResponse<R> | void> {
    const { onMessage, ...fetchOptions } = requestInit
    const response = (await fetch(url, fetchOptions)) as AI.AnswerResponse<R>

    if (!response.ok) {
      const errorText = await response.text()
      const { error } = JSON.parse(errorText)
      throw new AiError(error.message, {
        url: response.url,
        status: response.status,
        statusText: response.statusText,
      })
    }

    if (!onMessage) return response

    const parser = this._createParser(onMessage)
    const body = response.body
    if (!body) throw new Error('Response body is null')

    for await (const chunk of this.streamAsyncIterable(body)) {
      const chunkString = new TextDecoder().decode(chunk)
      parser.feed(chunkString)
    }
  }

  /**
   * 创建 SSE 解析器
   */
  private _createParser(onMessage: (data: string) => void): EventSourceParser {
    return createParser({
      onEvent: (event) => {
        const data = event.data.trim()
        if (!data) return

        // 处理 [DONE] 标记
        if (data === '[DONE]') {
          onMessage(data)
          return
        }

        if (data.startsWith(DATA_PREFIX) && !data.startsWith(KEEPALIVE_FLAG)) {
          onMessage(data.slice(DATA_PREFIX.length))
        } else {
          onMessage(data)
        }
      },
    })
  }

  /**
   * 创建可清除的 Promise
   */
  protected clearablePromise<V extends object>(
    inputPromise: PromiseLike<V>,
    options: AI.ClearablePromiseOptions
  ): Promise<V> {
    const { milliseconds, message } = options
    let timer: ReturnType<typeof setTimeout> | undefined

    const wrappedPromise = new Promise<V>((resolve, reject) => {
      if (milliseconds === Number.POSITIVE_INFINITY) {
        inputPromise.then(resolve, reject)
        return
      }

      try {
        timer = setTimeout(() => {
          const errorMessage = message ?? `Promise timed out after ${milliseconds} milliseconds`
          this._abortController.abort(errorMessage)
          reject(new AiError(errorMessage))
        }, milliseconds)

        inputPromise.then(resolve, reject)
      } catch (error) {
        reject(error)
      }
    })

    return wrappedPromise.finally(() => {
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }
    })
  }

  /**
   * 取消当前会话
   */
  public async cancelConversation(reason?: string): Promise<void> {
    if (this._currentConversation) {
      const conversation = this._currentConversation
      conversation.done = false
      conversation.thinking = false
      await this.upsertConversation(conversation)
      this._currentConversation = null
    }
    this._abortController.abort(reason)
    this._abortController = new AbortController()
  }

  /**
   * 获取可用模型列表
   */
  public async getModels(): Promise<
    AI.AnswerResponse<{ data: Array<{ id: string; name: string }> }>
  > {
    const requestInit = {
      method: 'GET',
      headers: this.headers,
    }
    const response = await this._fetchSSE<{ data: Array<{ id: string; name: string }> }>(
      this._modelsUrl,
      requestInit
    )
    if (!response) {
      throw new AiError('Failed to get models')
    }
    return response
  }
}

/**
 * AI 错误类
 */
export class AiError extends Error {
  readonly name = 'AIError'
  readonly status?: number
  readonly statusText?: string
  readonly url?: string

  constructor(message: string, option?: AI.AiErrorOption) {
    super(message)
    if (option) {
      const { status, statusText, url } = option
      this.status = status
      this.statusText = statusText
      this.url = url
    }
  }
}
