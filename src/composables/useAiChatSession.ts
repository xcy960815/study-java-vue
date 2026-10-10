import { ref } from 'vue'

import { RoleEnum } from '@enums'

type ChatSessionModel = Pick<
  import('./useCompletions').Completions,
  | 'buildAssistantConversation'
  | 'buildConversation'
  | 'cancelConversation'
  | 'completions'
  | 'getAllConversations'
>

type UseAiChatSessionOptions = {
  model: ChatSessionModel
  getCompletionsOptions?: (
    context: Readonly<{
      parentMessageId: string
    }>
  ) => Omit<AI.Gpt.CompletionsOptions, 'onProgress' | 'parentMessageId'>
  cancelReason?: string
  onError?: (error: unknown) => void
}

const cloneAssistantConversation = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value)) as T
}

const isAbortError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false
  }

  return error.name === 'AbortError' || error.message.toLowerCase().includes('abort')
}

export const useAiChatSession = ({
  model,
  getCompletionsOptions,
  cancelReason = '用户手动取消会话',
  onError,
}: UseAiChatSessionOptions) => {
  const parentMessageId = ref('')
  const conversationList = ref<AI.Conversation[]>([])
  const currentConversation = ref<AI.Gpt.AssistantConversation | null>(null)
  let requestInFlight = false

  const syncConversationList = async () => {
    conversationList.value = await model.getAllConversations()
  }

  const replaceConversation = (messageId: string, next: AI.Conversation) => {
    const index = conversationList.value.findIndex((item) => item.messageId === messageId)
    if (index === -1) {
      return
    }

    const nextList = conversationList.value.slice()
    nextList[index] = next
    conversationList.value = nextList
  }

  const sendMessage = async (question: string): Promise<AI.Gpt.AssistantConversation | null> => {
    if (requestInFlight || currentConversation.value) {
      return null
    }

    requestInFlight = true
    const userMessage = model.buildConversation(RoleEnum.User, question, {
      parentMessageId: parentMessageId.value,
    })
    const assistantMessage = model.buildAssistantConversation('', {
      parentMessageId: userMessage.messageId,
    })
    const placeholderId = assistantMessage.messageId
    conversationList.value = [...conversationList.value, userMessage, assistantMessage]
    currentConversation.value = assistantMessage

    const writeAssistant = (next: AI.Gpt.AssistantConversation) => {
      const row = {
        ...next,
        messageId: placeholderId,
        parentMessageId: userMessage.messageId,
      }
      replaceConversation(placeholderId, row)
      currentConversation.value = row
    }

    try {
      const completionsOptions = {
        ...(getCompletionsOptions?.({ parentMessageId: parentMessageId.value }) ?? {}),
        parentMessageId: parentMessageId.value,
        onProgress(partialResponse: AI.Gpt.AssistantConversation) {
          writeAssistant({
            ...cloneAssistantConversation(partialResponse),
            thinking: partialResponse.thinking,
            done: false,
          })
        },
      } satisfies AI.Gpt.CompletionsOptions

      const response = await model.completions(question, completionsOptions)

      if (response.done) {
        parentMessageId.value = response.messageId
      }

      writeAssistant({
        ...cloneAssistantConversation(response),
        thinking: false,
        done: true,
      })

      return response
    } catch (error) {
      if (!isAbortError(error)) {
        onError?.(error)
      }

      const current = conversationList.value.find((item) => item.messageId === placeholderId)
      if (current) {
        replaceConversation(placeholderId, {
          ...current,
          thinking: false,
          done: true,
        })
      }

      return null
    } finally {
      currentConversation.value = null
      requestInFlight = false
    }
  }

  const cancelConversation = async (): Promise<void> => {
    await model.cancelConversation(cancelReason)
  }

  return {
    cancelConversation,
    conversationList,
    currentConversation,
    parentMessageId,
    sendMessage,
    syncConversationList,
  }
}
