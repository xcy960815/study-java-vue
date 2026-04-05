import { createParser } from 'eventsource-parser'

const createEventSourceMessageParser = (onMessage: (message: string) => void) => {
  return createParser({
    onEvent: (event) => {
      if (event.data) {
        onMessage(event.data)
      }
    },
  })
}

const streamAsyncIterable = async function* (
  stream: ReadableStream<Uint8Array> | AsyncIterable<Uint8Array>
): AsyncIterable<Uint8Array> {
  if ('getReader' in stream) {
    const reader = stream.getReader()

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          return
        }

        yield value!
      }
    } finally {
      reader.releaseLock()
    }
  } else {
    for await (const chunk of stream) {
      yield chunk
    }
  }
}

export const streamEventSourceMessages = async (
  stream: ReadableStream<Uint8Array> | AsyncIterable<Uint8Array>,
  onMessage: (message: string) => void
): Promise<void> => {
  const parser = createEventSourceMessageParser(onMessage)
  const decoder = new TextDecoder()

  for await (const chunk of streamAsyncIterable(stream)) {
    parser.feed(decoder.decode(chunk, { stream: true }))
  }

  const remainingChunk = decoder.decode()
  if (remainingChunk) {
    parser.feed(remainingChunk)
  }
}
