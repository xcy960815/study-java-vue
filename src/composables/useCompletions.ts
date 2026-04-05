import { RoleEnum } from '@enums'

import { buildGptConversationHistory } from '@/utils/ai-gpt-request'
import {
  GptAssistantResponseAssembler,
  isStreamDoneMessage,
} from '@/utils/ai-gpt-response-assembler'
import { CompletionsCore } from '../utils/completions-core'

const MODEL = 'deepseek-chat'

/**
 * Completions 聊天模型适配器
 * 负责与 AI 模型进行对话请求、流式处理、历史消息拼接等
 */
class Completions extends CompletionsCore {
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

  private async buildFetchRequestInit(
    currentMessage: AI.Conversation,
    options: AI.Gpt.CompletionsOptions = {}
  ): Promise<AI.FetchRequestInit> {
    const { onProgress, stream = !!onProgress, requestParams } = options
    const mergedRequestParams = {
      ...this._requestParams,
      ...requestParams,
    }
    const { messages, maxTokens } = await buildGptConversationHistory({
      currentMessage,
      options,
      model: mergedRequestParams.model,
      defaultSystemMessage: this._systemMessage,
      maxModelTokens: this._maxModelTokens,
      maxResponseTokens: this._maxResponseTokens,
      conversationStore: this._conversationStore,
      getTokenCount: (text, tokenOptions) => this.getTokenCount(text, tokenOptions),
      serializeConversationForTokenCount: (message) =>
        this.serializeConversationForTokenCount(message),
    })

    return {
      method: 'POST',
      body: JSON.stringify({
        ...mergedRequestParams,
        messages,
        stream,
        max_tokens: maxTokens,
      }),
    }
  }

  public async completions(
    question: string,
    options: AI.Gpt.CompletionsOptions = {}
  ): Promise<AI.Gpt.AssistantConversation> {
    const { onProgress, stream = !!onProgress } = options
    const role = (options.role || RoleEnum.User) as AI.Role
    const currentMessage = this.buildConversation(role, question, options)
    await this.upsertConversation(currentMessage)

    const assistantMessage = this.buildAssistantConversation('', {
      ...options,
      parentMessageId: currentMessage.messageId,
    })
    this._currentConversation = assistantMessage

    const responseAssembler = new GptAssistantResponseAssembler(assistantMessage, (text: string) =>
      this.transformContent(text)
    )

    const responsePromise = new Promise<AI.Gpt.AssistantConversation>(async (resolve, reject) => {
      try {
        const requestInit = await this.buildFetchRequestInit(currentMessage, options)

        if (stream) {
          requestInit.onMessage = (data: string) => {
            if (isStreamDoneMessage(data)) {
              resolve(responseAssembler.finalizeStream())
              return
            }

            try {
              const response: AI.Gpt.Response = JSON.parse(data)
              onProgress?.(responseAssembler.applyStreamResponse(response))
            } catch (error) {
              console.error('Failed to parse stream data:', error, 'Raw data:', data)
            }
          }

          await this.request<AI.Gpt.Response>(this.completionsUrl, requestInit).catch(reject)
          return
        }

        const response = await this.request<AI.Gpt.Response>(this.completionsUrl, requestInit)
        const data = await response?.json()

        if (data) {
          responseAssembler.applyResponse(data)
        }

        assistantMessage.done = true
        assistantMessage.thinking = false
        resolve(assistantMessage)
      } catch (error) {
        console.error('AI EventStream error:', error)
        reject(error)
      }
    })
      .then(async (conversation) => {
        await this.upsertConversation(responseAssembler.toHistoryConversation())
        return conversation
      })
      .finally(() => {
        if (this._currentConversation === assistantMessage) {
          this._currentConversation = null
        }
      })

    return this.clearablePromise(responsePromise, {
      milliseconds: this._milliseconds,
      message: '',
    })
  }
}

export const useCompletions = () => {
  return {
    Completions,
  }
}

export type { Completions }
