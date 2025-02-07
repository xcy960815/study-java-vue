import { OpenAI } from './index'
import {
  createParser,
  type EventSourceParser
} from 'eventsource-parser'
import { v4 as uuidv4 } from 'uuid'
import Gpt3Tokenizer from 'gpt3-tokenizer'
import { marked } from 'marked'
import { getToken } from '@utils/token'
marked.setOptions({
  renderer: new marked.Renderer(),
  // highlight: function (code, _lang) {
  //   return hljs.highlightAuto(code).value;
  // },
  // langPrefix: 'hljs language-',
  pedantic: false,
  gfm: true,
  breaks: true
  // sanitize: false,
  // smartypants: false,
  // xhtml: false,
})
/**
 * 基础类 有一些公共方法
 * @internal
 */
export class Core {
  /** 用于区分是哪个模型的继承 返回不同请求地址 */
  private _who: string
  /** gpt 对话key */
  protected _apiKey: string
  /** gpt 请求域名 */
  protected _apiBaseUrl: string
  /** gpt 组织 */
  protected _organization?: string
  /** 是否开启debug */
  protected _debug: boolean
  /** 是否携带上下文 */
  protected _withContent: boolean
  /** 消息仓库 */
  protected _messageStore: Map<string, OpenAI.Conversation>
  /** 最大请求token */
  protected _maxModelTokens: number
  /** 最多返回token */
  protected _maxResponseTokens: number
  /** 系统角色 */
  protected _systemMessage: string
  /** 取消fetch请求控制器 */
  protected _abortController: AbortController
  /** 用于计算token */
  protected _gpt3Tokenizer: Gpt3Tokenizer
  /** 超时时间 */
  protected _milliseconds: number
  /** 是否开启markdown转html */
  protected _markdown2Html: boolean

  constructor(options: OpenAI.CoreOptions) {
    const {
      who,
      apiKey,
      apiBaseUrl,
      organization,
      debug,
      withContent,
      maxModelTokens,
      maxResponseTokens,
      systemMessage,
      milliseconds,
      markdown2Html
    } = options

    this._who = who
    this._apiKey = ''
    ;(async () => {
      this._apiKey = apiKey
        ? apiKey
        : (await getToken()) || ''
    })()

    this._apiBaseUrl =
      apiBaseUrl ?? 'https://api.OpenAI.com'

    this._organization = organization

    this._debug = !!debug

    this._withContent =
      withContent === undefined ? true : withContent

    this._maxModelTokens = maxModelTokens ?? 4096

    this._maxResponseTokens = maxResponseTokens ?? 1000

    this._messageStore = new Map<
      string,
      OpenAI.Conversation
    >()

    this._gpt3Tokenizer = new Gpt3Tokenizer({
      type: 'gpt3'
    })

    this._systemMessage =
      systemMessage ??
      ` 你是ChatGPT,帮助用户使用代码。您聪明、乐于助人、专业的开发人员，总是给出正确的答案，并且只按照指示执行。你的回答始终如实，不会造假`

    this._abortController = new AbortController()

    this._milliseconds = milliseconds ?? 1000 * 60

    this._markdown2Html = markdown2Html ?? false
  }

  /**
   * completions请求地址
   * @returns {string}
   */
  protected get completionsUrl(): string {
    return `${this._apiBaseUrl}${
      this._who === 'gpt-model'
        ? '/v1/chat/completions'
        : '/v1/completions'
    }`
  }

  /**
   * models 请求地址
   * @returns {string}
   */
  private get modelUrl(): string {
    return `${this._apiBaseUrl}${'/v1/models'}`
  }

  /**
   * 生成随机id
   * @returns {string}
   */
  protected get uuid(): string {
    return uuidv4()
  }

  /**
   * 请求头
   * @returns {HeadersInit}
   */
  protected get headers(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this._apiKey}`
    }
    if (this._organization) {
      headers['OpenAI-Organization'] = this._organization
    }
    return headers
  }
  /**
   * 获取token数量
   * @param {string} text
   * @returns {Promise<number>}
   */
  protected async getTokenCount(
    _text: string
  ): Promise<number> {
    return await this._gpt3Tokenizer.encode(_text).bpe
      .length
  }

  /**
   * 构建会话消息
   * @param {"user" | "gpt-assistant" | "text-assistant"} role
   * @param {string} content
   * @param {OpenAI.SendMessageOptions} option
   * @returns {OpenAI.Conversation}
   */
  protected buildConversation<
    R extends 'user' | 'gpt-assistant' | 'text-assistant'
  >(
    role: R,
    content: string,
    option: OpenAI.GetAnswerOptions
  ): OpenAI.BuildConversationReturns<R> {
    if (role === 'user') {
      return {
        role: 'user',
        messageId: option.messageId || this.uuid,
        parentMessageId: option.parentMessageId,
        content
      } as OpenAI.BuildConversationReturns<R>
    } else if (
      role === 'gpt-assistant' ||
      role === 'text-assistant'
    ) {
      return {
        role: 'assistant',
        messageId: '',
        parentMessageId: option.messageId || this.uuid,
        content,
        detail: null
      } as OpenAI.BuildConversationReturns<R>
    } else {
      return undefined as OpenAI.BuildConversationReturns<R>
    }
  }

  /**
   * 获取对话
   * @param {string} id
   * @returns {Promise<OpenAI.Conversation | undefined>}
   */
  protected getConversation(
    id: string
  ): Promise<OpenAI.Conversation | undefined> {
    return new Promise((resolve) => {
      const message = this._messageStore.get(id)
      resolve(message)
    })
  }
  /**
   * 更新对话
   * @param {OpenAI.Conversation} message
   * @returns {Promise<void>}
   */
  protected upsertConversation(
    message: OpenAI.Conversation
  ): Promise<void> {
    return new Promise((resolve) => {
      // 这里做层浅拷贝 因为map存储的值如果是对象的话 会受到指针的影响
      this._messageStore.set(message?.messageId, {
        ...message
      })
      resolve()
    })
  }
  /**
   * 清空消息
   * @returns {Promise<void>}
   */
  protected _clearMessage(): Promise<void> {
    return new Promise<void>((resolve) => {
      this._messageStore.clear()
      resolve()
    })
  }
  /**
   * 输出debug参数
   * @param {string} action
   * @param {any[]} args
   * @returns {void}
   */
  protected _debugLog(action: string, ...args: any[]) {
    if (this._debug) {
      console.log(`OpenAI-apis:DEBUG:${action}`, ...args)
    }
  }
  /**
   * 这个方法的作用是将一个 ReadableStream 对象转换成一个异步迭代器 AsyncIterable，
   * 该迭代器会在每次迭代中返回一个 Uint8Array 类型的数据块。具体来说，该方法会获取一个 ReadableStream 对象的读取器（reader），
   * 然后在一个无限循环中等待读取器返回数据。每次读取器返回数据时，该方法都会返回一个包含数据的 Uint8Array 对象。
   * 当读取器返回一个 done 属性为 true 的对象时，该方法就会结束迭代。最后，该方法会释放读取器的锁。
   * @param {ReadableStream<Uint8Array>} stream
   * @returns {AsyncIterable<Uint8Array>}
   */
  private async *streamAsyncIterable(
    stream: ReadableStream<Uint8Array>
  ): AsyncIterable<Uint8Array> {
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
  }
  /**
   * 向OpenAI发送请求
   * @param {string} url
   * @param {OpenAI.FetchSSEOptions} options
   * @returns {Promise<OpenAI.GptResponse<R> | void>}
   */
  protected async _fetchSSE<R extends Object>(
    url: string,
    requestInit: OpenAI.FetchRequestInit
  ): Promise<OpenAI.AnswerResponse<R> | void> {
    const { onMessage, ...fetchOptions } = requestInit
    const response = (await fetch(url, {
      ...fetchOptions
    })) as OpenAI.AnswerResponse<R>
    if (!response.ok) {
      // 走到这一步是OpenAI接口错误的时候 如果其他后端应用封装了OpenAI接口即使发生错误也不一定 走到这步
      const errorOption: OpenAI.ChatgptErrorOption = {
        url: response.url,
        status: response.status,
        statusText: response.statusText
      }
      const { error } = JSON.parse(await response.text())
      throw new ChatgptError(error.message, errorOption)
    }
    // 如果没有 onMessage 回调函数，直接返回 response
    if (!onMessage) {
      return response
    }
    const parser = this._createParser(onMessage)
    const body = response.body
    for await (const chunk of this.streamAsyncIterable(
      body!
    )) {
      const chunkString = new TextDecoder().decode(chunk)
      parser.feed(chunkString)
    }
  }
  /**
   * 创建parser
   * @param {(p:string)=>void} onMessage
   * @returns {EventSourceParser}
   */
  // private _createParser(onMessage: (p: string) => void): EventSourceParser {
  //     return createParser((event) => {
  //         if (event.type === 'event') {
  //             onMessage?.(event.data);
  //         }
  //     })
  // };
  /**
   * 创建parser
   * @param {(p:string) => void} onMessage
   * @returns {EventSourceParser}
   */
  private _createParser(
    onMessage: (p: string) => void
  ): EventSourceParser {
    return createParser({
      onEvent: (event) => {
        onMessage?.(event.data) // 这里调用传入的 onMessage 回调
      }
      // 可选：根据需要处理其他回调函数（onRetry, onComment, onError）
      // onRetry: (retry: number) => { ... },
      // onComment: (comment: string) => { ... },
      // onError: (error: ParseError) => { ... }
    })
  }

  /**
   * 解析markdown语法装换成html语法
   * @param {string} content
   * @returns {string}
   */
  protected async _markdownToHtml(
    content: string
  ): Promise<string> {
    const html = await marked.parse(content)
    return html
  }

  /**
   * 清空promise
   */
  protected clearablePromise<V = any>(
    inputPromise: PromiseLike<V>,
    options: OpenAI.ClearablePromiseOptions
  ) {
    const { milliseconds, message } = options
    let timer: ReturnType<typeof setTimeout> | undefined
    const wrappedPromise = new Promise<V>(
      (resolve, reject) => {
        if (milliseconds === Number.POSITIVE_INFINITY) {
          inputPromise.then(resolve, reject)
          return
        }
        try {
          timer = setTimeout.call(
            undefined,
            () => {
              // 终止请求
              this._abortController.abort()
              const errorMessage =
                message ??
                `Promise timed out after ${milliseconds} milliseconds`
              const timeoutError = new ChatgptError(
                errorMessage
              )
              reject(timeoutError)
            },
            milliseconds
          )
        } catch (error) {
          reject(error)
        } finally {
          inputPromise.then((inputPromiseResult) => {
            resolve(inputPromiseResult)
          })
        }
      }
    )

    /**
     * 默认清除定时器
     */
    const cancelablePromise = wrappedPromise.finally(() => {
      clearTimeout.call(undefined, timer)
      timer = undefined
    })

    return cancelablePromise
  }
  /**
   * 取消对话
   * @param {string}reson
   * @returns {void}
   */
  public cancelConversation(reson?: string) {
    this._abortController.abort(reson)
  }

  /**
   *
   * @returns {Promise<OpenAI.Model[]>}
   */
  public getModels() {
    const requestInit = {
      method: 'GET',
      headers: this.headers
    }
    return this._fetchSSE(this.modelUrl, requestInit)
  }
}
/**
 * ChatGPT 错误类
 */
export class ChatgptError extends Error {
  status?: number
  statusText?: string
  url?: string
  constructor(
    message: string,
    option?: OpenAI.ChatgptErrorOption
  ) {
    super(message)
    if (option) {
      const { status, statusText, url } = option
      this.status = status
      this.statusText = statusText
      this.url = url
    }
  }
}
