import { ref } from 'vue'

type ChatSessionModel = Pick<
  import('./useCompletions').Completions,
  'buildAssistantConversation' | 'cancelConversation' | 'completions' | 'getAllConversations'
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

  const syncConversationList = async () => {
    conversationList.value = await model.getAllConversations()
  }

  const sendMessage = async (question: string): Promise<AI.Gpt.AssistantConversation | null> => {
    const completionsOptions = {
      ...(getCompletionsOptions?.({ parentMessageId: parentMessageId.value }) ?? {}),
      parentMessageId: parentMessageId.value,
      onProgress(partialResponse: AI.Gpt.AssistantConversation) {
        currentConversation.value = cloneAssistantConversation(partialResponse)
      },
    } satisfies AI.Gpt.CompletionsOptions

    const responsePromise = model.completions(question, completionsOptions)

    await syncConversationList()
    currentConversation.value = model.buildAssistantConversation('', {
      parentMessageId: parentMessageId.value,
    })

    try {
      const response = await responsePromise

      if (response.done) {
        parentMessageId.value = response.messageId
      }

      return response
    } catch (error) {
      if (!isAbortError(error)) {
        onError?.(error)
      }

      return null
    } finally {
      currentConversation.value = null
      await syncConversationList()
    }
  }

  const cancelConversation = async (): Promise<void> => {
    await model.cancelConversation(cancelReason)
    currentConversation.value = null
    await syncConversationList()
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
