import { v4 as uuidv4 } from 'uuid'
import { RoleEnum } from '@enums'

import { createContentTransformer } from './ai-content-transformer'
import { AiError } from './ai-error'
import { InMemoryConversationStore } from './ai-in-memory-conversation-store'
import { GptTokenizerTokenCounter } from './ai-token-counter'
import { FetchOpenAITransport } from './fetch-openai-transport'

const DEFAULT_API_BASE_URL = 'https://api.openai.com'
const DEFAULT_MAX_MODEL_TOKENS = 4096
const DEFAULT_MAX_RESPONSE_TOKENS = 1000
const DEFAULT_TIMEOUT = 1000 * 60

/**
 * AI 聊天核心类
 * 提供传输层、会话存储、超时控制、token 估算等公共能力
 */
export class CompletionsCore {
  protected readonly _debug: boolean
  protected readonly _conversationStore?: AI.ConversationStore
  protected readonly _maxModelTokens: number
  protected readonly _maxResponseTokens: number
  protected readonly _systemMessage?: string
  protected _abortController: AbortController
  protected readonly _milliseconds: number
  protected _currentConversation: AI.Gpt.AssistantConversation | null = null

  private readonly _transport: AI.OpenAITransport
  private readonly _contentTransformer: AI.ContentTransformer
  private readonly _tokenCounter: AI.TokenCounter
  private readonly _completionsUrl?: string

  constructor(options: AI.CoreOptions) {
    const {
      apiKey = '',
      apiBaseUrl,
      baseURL,
      organization,
      debug = false,
      withContent = true,
      conversationStore,
      tokenCounter,
      transport,
      maxModelTokens = DEFAULT_MAX_MODEL_TOKENS,
      maxResponseTokens = DEFAULT_MAX_RESPONSE_TOKENS,
      systemMessage = `你是Ai助手,帮助用户使用代码。您聪明、乐于助人、专业的开发人员，总是给出正确的答案，并且只按照指示执行。你的回答始终如实，不会造假,返回结果用markdown显示`,
      milliseconds = DEFAULT_TIMEOUT,
      markdown2Html,
      transformResponseContent,
      completionsUrl,
    } = options

    this._debug = !!debug
    this._conversationStore =
      conversationStore === false
        ? undefined
        : (conversationStore ?? (withContent ? new InMemoryConversationStore() : undefined))
    this._maxModelTokens = maxModelTokens
    this._maxResponseTokens = maxResponseTokens
    this._systemMessage = systemMessage?.trim() ? systemMessage : undefined
    this._abortController = new AbortController()
    this._milliseconds = milliseconds
    this._transport =
      transport ??
      new FetchOpenAITransport({
        apiKey,
        apiBaseUrl: apiBaseUrl ?? baseURL ?? DEFAULT_API_BASE_URL,
        baseURL,
        organization,
      })
    this._contentTransformer = createContentTransformer({
      markdown2Html,
      transformResponseContent,
    })
    this._tokenCounter = tokenCounter ?? new GptTokenizerTokenCounter()
    this._completionsUrl = completionsUrl
  }

  protected get completionsUrl(): string {
    return this._completionsUrl ?? '/chat/completions'
  }

  protected get uuid(): string {
    return uuidv4()
  }

  protected transformContent(text: string): string {
    return this._contentTransformer(text)
  }

  protected async request<R extends object>(
    path: string,
    requestInit: AI.FetchRequestInit
  ): Promise<AI.AnswerResponse<R> | void> {
    return this._transport.request<R>(path, requestInit, this._abortController.signal)
  }

  protected async getTokenCount(
    text: string,
    options?: AI.TokenCountOptions
  ): Promise<number> {
    return this._tokenCounter.count(text, options)
  }

  protected hasConversationStore(): boolean {
    return !!this._conversationStore
  }

  protected requireConversationStore(): AI.ConversationStore {
    if (!this._conversationStore) {
      throw new AiError(
        'parentMessageId requires a conversationStore. Pass conversationStore or withContent: true to enable history.'
      )
    }

    return this._conversationStore
  }

  protected debugLog(action: string, ...args: Array<unknown>): void {
    if (this._debug) {
      console.log(`AI-apis:DEBUG:${action}`, ...args)
    }
  }

  public buildConversation(
    role: AI.Role,
    content: string,
    option: AI.CompletionsOptions
  ): AI.Conversation | AI.Gpt.AssistantConversation {
    const baseConversation = {
      role,
      messageId: option.messageId || this.uuid,
      parentMessageId: option.parentMessageId,
      content,
      tool_call_id: option.tool_call_id,
      name: option.name,
    }

    if (role === RoleEnum.Assistant) {
      return {
        ...baseConversation,
        detail: null,
        thinking: false,
        done: true,
      }
    }

    return baseConversation
  }

  public buildAssistantConversation(
    content: string,
    option: AI.CompletionsOptions
  ): AI.Gpt.AssistantConversation {
    return {
      role: RoleEnum.Assistant,
      messageId: this.uuid,
      parentMessageId: option.messageId || option.parentMessageId || this.uuid,
      content,
      detail: null,
      thinking: true,
      done: false,
    }
  }

  protected getConversation(id: string): Promise<AI.Conversation | undefined> {
    return this._conversationStore?.get(id) ?? Promise.resolve(undefined)
  }

  public async getAllConversations(): Promise<Array<AI.Conversation>> {
    if (!this._conversationStore?.list) {
      return []
    }

    return this._conversationStore.list()
  }

  protected upsertConversation(message: AI.Conversation): Promise<void> {
    return this._conversationStore?.set(message) ?? Promise.resolve()
  }

  protected clearConversation(): Promise<void> {
    return this._conversationStore?.clear() ?? Promise.resolve()
  }

  protected serializeConversationForTokenCount(message: Partial<AI.Conversation>): string {
    return JSON.stringify({
      role: message.role,
      content: message.content ?? '',
      name: message.name,
      tool_call_id: message.tool_call_id,
      tool_calls: message.tool_calls,
      function_call: message.function_call,
    })
  }

  protected clearablePromise<V>(
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
          this._abortController.abort()
          this._abortController = new AbortController()
          const errorMessage =
            message && message.trim()
              ? message
              : `Promise timed out after ${milliseconds} milliseconds`
          reject(new AiError(errorMessage))
        }, milliseconds)
      } catch (error) {
        reject(error)
      } finally {
        inputPromise.then(resolve, reject)
      }
    })

    return wrappedPromise.finally(() => {
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }
    })
  }

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

  public getModels(): Promise<AI.AnswerResponse<AI.ListModelsResponse> | void> {
    return this.request<AI.ListModelsResponse>('/models', {
      method: 'GET',
    })
  }
}

export { AiError } from './ai-error'
