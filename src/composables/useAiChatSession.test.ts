import { describe, expect, it } from 'vitest'

import { useAiChatSession } from './useAiChatSession'

const assistant = (
  messageId: string,
  content: string,
  done: boolean
): AI.Gpt.AssistantConversation => ({
  role: 'assistant',
  messageId,
  parentMessageId: 'parent',
  content,
  thinking: !done,
  done,
  detail: null,
})

const createModel = () => {
  let releaseFirst: (() => void) | undefined
  const firstGate = new Promise<void>((resolve) => {
    releaseFirst = resolve
  })
  let calls = 0

  const model = {
    buildConversation(role: AI.Role, content: string, option: AI.CompletionsOptions) {
      return {
        role,
        content,
        messageId: `local-${role}-${calls + 1}-${content}`,
        parentMessageId: option.parentMessageId,
      }
    },
    buildAssistantConversation(content: string, option: AI.CompletionsOptions) {
      return assistant(`placeholder-${option.parentMessageId}`, content, false)
    },
    async completions(_question: string, options: AI.Gpt.CompletionsOptions) {
      calls += 1
      const responseId = `chatcmpl-${calls}`
      options.onProgress?.(assistant(responseId, calls === 1 ? 'Hel' : 'Next', false))
      if (calls === 1) {
        await firstGate
      }
      return assistant(responseId, calls === 1 ? 'Hello' : 'Next', true)
    },
    async cancelConversation() {},
    async getAllConversations() {
      return []
    },
    releaseFirst() {
      releaseFirst?.()
    },
  }

  return model
}

describe('useAiChatSession', () => {
  it('把用户消息和回复追加到同一条列表，流式内容只更新最后一条', async () => {
    const model = createModel()
    const session = useAiChatSession({ model })

    const firstSend = session.sendMessage('hello')
    expect(session.conversationList.value.map((item) => item.role)).toEqual(['user', 'assistant'])
    expect(session.conversationList.value.map((item) => item.content)).toEqual(['hello', 'Hel'])
    expect(session.conversationList.value[1]?.messageId).toBe(
      `placeholder-${session.conversationList.value[0]?.messageId}`
    )

    await expect(session.sendMessage('hello')).resolves.toBeNull()
    expect(session.conversationList.value).toHaveLength(2)

    model.releaseFirst()
    await firstSend

    expect(session.conversationList.value.map((item) => [item.role, item.content])).toEqual([
      ['user', 'hello'],
      ['assistant', 'Hello'],
    ])
    expect(session.currentConversation.value).toBeNull()

    await session.sendMessage('again')
    expect(session.conversationList.value.map((item) => [item.role, item.content])).toEqual([
      ['user', 'hello'],
      ['assistant', 'Hello'],
      ['user', 'again'],
      ['assistant', 'Next'],
    ])
  })
})
