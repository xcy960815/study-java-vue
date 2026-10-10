import { afterEach, describe, expect, it, vi } from 'vitest'

import { useCompletions } from './useCompletions'

const encoder = new TextEncoder()

const sseResponse = (chunks: string[]) => {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)))
      controller.close()
    },
  })

  return new Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
  })
}

const chunk = (id: string, content: string) =>
  `data: ${JSON.stringify({ id, choices: [{ delta: { content } }] })}\n\n`

describe('Completions', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('把没有 [DONE] 的回复按发送顺序写入历史', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(sseResponse([chunk('chatcmpl-1', 'Hello')]))
      .mockResolvedValueOnce(sseResponse([chunk('chatcmpl-2', 'Hello again')]))

    vi.stubGlobal('fetch', fetchMock)

    const { Completions } = useCompletions()
    const model = new Completions({
      apiKey: '',
      apiBaseUrl: 'https://example.test',
      completionsUrl: '/deepseek/completions',
      milliseconds: 5000,
    })

    const first = await model.completions('hello', {
      onProgress() {},
      systemMessage: 'bot',
    })
    const second = await model.completions('hello', {
      onProgress() {},
      parentMessageId: first.messageId,
      systemMessage: 'bot',
    })

    expect(first.done).toBe(true)
    expect(second.done).toBe(true)

    const history = await model.getAllConversations()
    expect(history.map((message) => message.role)).toEqual([
      'user',
      'assistant',
      'user',
      'assistant',
    ])
    expect(history.map((message) => message.content)).toEqual([
      'hello',
      'Hello',
      'hello',
      'Hello again',
    ])
  })
})
