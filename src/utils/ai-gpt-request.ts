import { RoleEnum } from '@enums'

import { AiError } from './ai-error'

type BuildGptConversationHistoryOptions = {
  currentMessage: AI.Conversation
  options?: AI.Gpt.CompletionsOptions
  model?: string
  defaultSystemMessage?: string
  maxModelTokens: number
  maxResponseTokens: number
  conversationStore?: AI.ConversationStore
  getTokenCount: (text: string, options?: AI.TokenCountOptions) => Promise<number>
  serializeConversationForTokenCount: (message: Partial<AI.Conversation>) => string
}

export const toGptRequestMessage = (message: AI.Conversation): AI.Gpt.RequestMessage => {
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

export const buildGptConversationHistory = async ({
  currentMessage,
  options = {},
  model,
  defaultSystemMessage,
  maxModelTokens,
  maxResponseTokens,
  conversationStore,
  getTokenCount,
  serializeConversationForTokenCount,
}: BuildGptConversationHistoryOptions): Promise<{
  messages: Array<AI.Gpt.RequestMessage>
  maxTokens: number
}> => {
  const { systemMessage } = options
  const maxTokenCount = maxModelTokens - maxResponseTokens
  let parentMessageId = options.parentMessageId

  if (parentMessageId && !conversationStore) {
    throw new AiError(
      'parentMessageId requires a conversationStore. Pass conversationStore or withContent: true to enable history.'
    )
  }

  const messages: Array<AI.Gpt.RequestMessage> = []
  const resolvedSystemMessage = systemMessage ?? defaultSystemMessage

  if (currentMessage.role !== RoleEnum.System && resolvedSystemMessage) {
    messages.push({
      role: RoleEnum.System,
      content: resolvedSystemMessage,
    })
  }

  messages.push(toGptRequestMessage(currentMessage))

  let tokenCount = 0
  for (const message of messages) {
    tokenCount += await getTokenCount(serializeConversationForTokenCount(message), {
      model,
    })
  }

  const historyInsertIndex = messages[0]?.role === RoleEnum.System ? 1 : 0

  while (true) {
    if (tokenCount > maxTokenCount || !parentMessageId || !conversationStore) {
      break
    }

    const parentMessage = await conversationStore.get(parentMessageId)

    if (!parentMessage) {
      break
    }

    const historyConversation = toGptRequestMessage(parentMessage)
    const historyTokenCount = await getTokenCount(
      serializeConversationForTokenCount(historyConversation),
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

  const maxTokens = Math.max(1, Math.min(maxModelTokens - tokenCount, maxResponseTokens))

  return {
    messages,
    maxTokens,
  }
}
