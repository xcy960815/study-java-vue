export class AiError extends Error {
  readonly name = 'AIError'
  readonly status?: number
  readonly statusText?: string
  readonly url?: string

  constructor(message: string, option?: AI.AiErrorOption) {
    super(message)
    if (option) {
      const { status, statusText, url } = option
      this.status = status
      this.statusText = statusText
      this.url = url
    }
  }
}
