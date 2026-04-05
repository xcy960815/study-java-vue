import { RoleEnum } from '@enums'

const mergeToolCalls = (
  currentToolCalls: Array<AI.ToolCall> | undefined,
  deltaToolCalls: Array<AI.ToolCall>
): Array<AI.ToolCall> => {
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

export const isStreamDoneMessage = (message: string): boolean => {
  return message === '[DONE]'
}

export class GptAssistantResponseAssembler {
  private rawContent = ''
  private rawAssistantContent = ''

  constructor(
    private readonly assistantMessage: AI.Gpt.AssistantConversation,
    private readonly transformContent: AI.ContentTransformer
  ) {}

  applyStreamResponse(response: AI.Gpt.Response): AI.Gpt.AssistantConversation {
    if (response.id) {
      this.assistantMessage.messageId = response.id
    }

    const delta = response.choices?.[0]?.delta
    if (!delta) {
      this.assistantMessage.detail = response
      return this.assistantMessage
    }

    if (delta.content) {
      this.rawContent += delta.content
      this.rawAssistantContent = this.rawContent
      this.assistantMessage.content = this.transformContent(this.rawContent)
    }

    if (delta.tool_calls) {
      this.assistantMessage.tool_calls = mergeToolCalls(
        this.assistantMessage.tool_calls,
        delta.tool_calls
      )
    }

    if (delta.function_call) {
      this.assistantMessage.function_call = {
        name: `${this.assistantMessage.function_call?.name || ''}${delta.function_call.name || ''}`,
        arguments: `${this.assistantMessage.function_call?.arguments || ''}${delta.function_call.arguments || ''}`,
      }
    }

    if (delta.role) {
      this.assistantMessage.role = delta.role
    }

    this.assistantMessage.detail = response
    this.assistantMessage.thinking = false

    return this.assistantMessage
  }

  applyResponse(response: AI.Gpt.Response): AI.Gpt.AssistantConversation {
    const message = response.choices?.[0]?.message
    const content = message?.content ?? ''

    this.rawContent = content
    this.rawAssistantContent = content

    if (response.id) {
      this.assistantMessage.messageId = response.id
    }

    this.assistantMessage.content = this.transformContent(content)
    this.assistantMessage.role = message?.role || RoleEnum.Assistant
    this.assistantMessage.tool_calls = message?.tool_calls
    this.assistantMessage.function_call = message?.function_call
    this.assistantMessage.detail = response
    this.assistantMessage.done = true
    this.assistantMessage.thinking = false

    return this.assistantMessage
  }

  finalizeStream(): AI.Gpt.AssistantConversation {
    this.assistantMessage.content = this.assistantMessage.content.trim()
    this.assistantMessage.done = true
    this.assistantMessage.thinking = false

    return this.assistantMessage
  }

  toHistoryConversation(): AI.Conversation {
    return {
      ...this.assistantMessage,
      content: this.rawAssistantContent,
    }
  }
}
