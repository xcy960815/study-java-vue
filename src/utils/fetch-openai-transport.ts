import { createParser, type EventSourceParser } from 'eventsource-parser'

import { AiError } from './ai-error'

export class FetchOpenAITransport implements AI.OpenAITransport {
  private readonly apiKey: string
  private readonly apiBaseUrl: string
  private readonly organization?: string

  constructor(options: AI.OpenAITransportOptions) {
    const { apiKey = '', apiBaseUrl, baseURL, organization } = options

    this.apiKey = apiKey
    this.apiBaseUrl = (apiBaseUrl ?? baseURL ?? 'https://api.openai.com').replace(/\/+$/, '')
    this.organization = organization
  }

  async request<R extends object>(
    path: string,
    requestInit: AI.FetchRequestInit,
    abortSignal: AbortSignal
  ): Promise<AI.AnswerResponse<R> | void> {
    const { onMessage, headers, ...fetchOptions } = requestInit
    const response = (await fetch(this.buildApiUrl(path), {
      signal: abortSignal,
      ...fetchOptions,
      headers: this.buildHeaders(headers),
    })) as AI.AnswerResponse<R>

    if (!response.ok) {
      const errorOption: AI.AiErrorOption = {
        url: response.url,
        status: response.status,
        statusText: response.statusText,
      }
      let errorMessage = response.statusText

      try {
        const data = await response.text()
        const json = JSON.parse(data)

        if (json.error?.message) {
          errorMessage = json.error.message
        } else {
          errorMessage = data
        }
      } catch {
        // ignore json parse error and keep the original status text
      }

      throw new AiError(errorMessage, errorOption)
    }

    if (!onMessage) {
      return response
    }

    const parser = this.createParser(onMessage)
    const body = response.body

    if (!body) {
      return
    }

    for await (const chunk of this.streamAsyncIterable(body)) {
      const chunkString = new TextDecoder().decode(chunk)
      parser.feed(chunkString)
    }
  }

  private buildApiUrl(path: string): string {
    if (/^https?:\/\//.test(path)) {
      return path
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const isRelativeBaseUrl =
      this.apiBaseUrl.startsWith('/') ||
      this.apiBaseUrl.startsWith('./') ||
      this.apiBaseUrl.startsWith('../')

    if (isRelativeBaseUrl) {
      return `${this.apiBaseUrl}${normalizedPath}`
    }

    return this.apiBaseUrl.endsWith('/v1')
      ? `${this.apiBaseUrl}${normalizedPath}`
      : `${this.apiBaseUrl}/v1${normalizedPath}`
  }

  private buildHeaders(extraHeaders?: HeadersInit): Headers {
    const headers = new Headers()

    if (this.apiKey) {
      headers.set('Authorization', `Bearer ${this.apiKey}`)
    }

    if (this.organization) {
      headers.set('OpenAI-Organization', this.organization)
    }

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    if (extraHeaders) {
      const normalizedHeaders = new Headers(extraHeaders)
      normalizedHeaders.forEach((value, key) => {
        headers.set(key, value)
      })
    }

    return headers
  }

  private createParser(onMessage: (message: string) => void): EventSourceParser {
    return createParser({
      onEvent: (event) => {
        if (event.data) {
          onMessage(event.data)
        }
      },
    })
  }

  private async *streamAsyncIterable(
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
}
