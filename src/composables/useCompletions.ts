import { RoleEnum } from '@enums'

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
    const { messages, maxTokens } = await this.getConversationHistory(
      currentMessage,
      options,
      mergedRequestParams.model
    )

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

    let rawContent = ''
    let rawAssistantContent = ''

    const responsePromise = new Promise<AI.Gpt.AssistantConversation>(async (resolve, reject) => {
      try {
        const requestInit = await this.buildFetchRequestInit(currentMessage, options)

        if (stream) {
          requestInit.onMessage = (data: string) => {
            if (data === '[DONE]') {
              assistantMessage.content = assistantMessage.content.trim()
              assistantMessage.done = true
              assistantMessage.thinking = false
              resolve(assistantMessage)
              return
            }

            try {
              const response: AI.Gpt.Response = JSON.parse(data)
              this.applyStreamResponse({
                response,
                assistantMessage,
                rawContent,
              })

              rawContent = this.getNextRawContent(response, rawContent)
              rawAssistantContent = rawContent
              onProgress?.(assistantMessage)
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
          const message = data.choices?.[0]?.message
          const content = message?.content ?? ''
          rawAssistantContent = content

          if (data.id) {
            assistantMessage.messageId = data.id
          }

          assistantMessage.content = this.transformContent(content)
          assistantMessage.role = message?.role || RoleEnum.Assistant
          assistantMessage.tool_calls = message?.tool_calls
          assistantMessage.function_call = message?.function_call
          assistantMessage.detail = data
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
        const historyConversation: AI.Conversation = {
          ...conversation,
          content: rawAssistantContent,
        }
        await this.upsertConversation(historyConversation)
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

  private applyStreamResponse({
    response,
    assistantMessage,
    rawContent,
  }: {
    response: AI.Gpt.Response
    assistantMessage: AI.Gpt.AssistantConversation
    rawContent: string
  }): void {
    if (response.id) {
      assistantMessage.messageId = response.id
    }

    const delta = response.choices?.[0]?.delta
    if (!delta) {
      return
    }

    if (delta.content) {
      const nextRawContent = rawContent + delta.content
      assistantMessage.content = this.transformContent(nextRawContent)
    }

    if (delta.tool_calls) {
      assistantMessage.tool_calls = this.mergeToolCalls(
        assistantMessage.tool_calls,
        delta.tool_calls
      )
    }

    if (delta.function_call) {
      assistantMessage.function_call = {
        name: `${assistantMessage.function_call?.name || ''}${delta.function_call.name || ''}`,
        arguments: `${assistantMessage.function_call?.arguments || ''}${delta.function_call.arguments || ''}`,
      }
    }

    if (delta.role) {
      assistantMessage.role = delta.role
    }

    assistantMessage.detail = response
    assistantMessage.thinking = false
  }

  private getNextRawContent(response: AI.Gpt.Response, rawContent: string): string {
    const deltaContent = response.choices?.[0]?.delta?.content
    if (!deltaContent) {
      return rawContent
    }

    return rawContent + deltaContent
  }

  private mergeToolCalls(
    currentToolCalls: Array<AI.ToolCall> | undefined,
    deltaToolCalls: Array<AI.ToolCall>
  ): Array<AI.ToolCall> {
    const nextToolCalls = currentToolCalls ? [...currentToolCalls] : []

    deltaToolCalls.forEach((toolCall, index) => {
      const existingToolCall = nextToolCalls[index]

      if (!existingToolCall) {
        nextToolCalls[index] = {
          id: toolCall.id || '',
          type: toolCall.type || 'function',
          function: {
            name: toolCall.function?.name || '',
            arguments: toolCall.function?.arguments || '',
          },
        }
        return
      }

      if (toolCall.id) {
        existingToolCall.id = toolCall.id
      }

      if (toolCall.type) {
        existingToolCall.type = toolCall.type
      }

      if (toolCall.function?.name) {
        existingToolCall.function.name = `${existingToolCall.function.name || ''}${toolCall.function.name}`
      }

      if (toolCall.function?.arguments) {
        existingToolCall.function.arguments = `${existingToolCall.function.arguments || ''}${toolCall.function.arguments}`
      }
    })

    return nextToolCalls
  }

  private toRequestMessage(message: AI.Conversation): AI.Gpt.RequestMessage {
    const requestMessage: AI.Gpt.RequestMessage = {
      role: message.role,
      content: message.content,
    }

    if (message.name) {
      requestMessage.name = message.name
    }

    if (message.tool_call_id) {
      requestMessage.tool_call_id = message.tool_call_id
    }

    if (message.tool_calls) {
      requestMessage.tool_calls = message.tool_calls
    }

    if (message.function_call) {
      requestMessage.function_call = message.function_call
    }

    return requestMessage
  }

  private async getConversationHistory(
    currentMessage: AI.Conversation,
    options: AI.Gpt.CompletionsOptions = {},
    model = this._requestParams.model
  ): Promise<{
    messages: Array<AI.Gpt.RequestMessage>
    maxTokens: number
  }> {
    const { systemMessage } = options
    const maxTokenCount = this._maxModelTokens - this._maxResponseTokens
    let parentMessageId = options.parentMessageId

    const messages: Array<AI.Gpt.RequestMessage> = []
    const resolvedSystemMessage = systemMessage ?? this._systemMessage

    if (currentMessage.role !== RoleEnum.System && resolvedSystemMessage) {
      messages.push({
        role: RoleEnum.System,
        content: resolvedSystemMessage,
      })
    }

    messages.push(this.toRequestMessage(currentMessage))

    let tokenCount = 0
    for (const message of messages) {
      tokenCount += await this.getTokenCount(this.serializeConversationForTokenCount(message), {
        model,
      })
    }

    const conversationStore = parentMessageId ? this.requireConversationStore() : undefined
    const historyInsertIndex = messages[0]?.role === RoleEnum.System ? 1 : 0

    while (true) {
      if (tokenCount > maxTokenCount) {
        break
      }

      if (!parentMessageId) {
        break
      }

      if (!conversationStore) {
        break
      }

      const parentMessage = await conversationStore.get(parentMessageId)

      if (!parentMessage) {
        break
      }

      const historyConversation = this.toRequestMessage(parentMessage)
      const historyTokenCount = await this.getTokenCount(
        this.serializeConversationForTokenCount(historyConversation),
        {
          model,
        }
      )

      if (tokenCount + historyTokenCount > maxTokenCount) {
        break
      }

      messages.splice(historyInsertIndex, 0, historyConversation)
      tokenCount += historyTokenCount
      parentMessageId = parentMessage.parentMessageId
    }

    const maxTokens = Math.max(
      1,
      Math.min(this._maxModelTokens - tokenCount, this._maxResponseTokens)
    )

    return {
      messages,
      maxTokens,
    }
  }
}

export const useCompletions = () => {
  return {
    Completions,
  }
}
