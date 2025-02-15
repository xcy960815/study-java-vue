import GptModel from './gpt-model'
import TextModle from './text-model'
import { ChatgptError } from './core'
export { GptModel, TextModle, ChatgptError }

export namespace OpenAI {
  export type ClearablePromiseOptions = {
    milliseconds: number
    message?: string
  }

  export interface ChatgptErrorOption {
    status?: number
    statusText?: string
    url?: string
  }
  /**
   * fetch 请求配置
   */
  export interface FetchRequestInit extends RequestInit {
    onMessage?: (message: string) => void
  }
  /**
   * 模型公共参数
   */
  export interface CoreOptions {
    apiKey: string
    /** 请求连接 default https://api.OpenAI.com */
    apiBaseUrl?: string
    /** 组织 */
    organization?: string
    /** 是否开启debug模式 */
    debug?: boolean
    /** @defaultValue 4096 **/
    maxModelTokens?: number
    /** @defaultValue 1000 **/
    maxResponseTokens?: number
    /** 是否携带上下文 */
    withContent?: boolean
    /** 系统消息 */
    systemMessage?: string
    /** 超时时间 */
    milliseconds?: number
    /** 是否将markdown语法转换成html */
    markdown2Html?: boolean
  }

  /**
   * 公共返回usage
   */
  export interface ResponseUsage {
    completion_tokens: number
    prompt_tokens: number
    total_tokens: number
  }

  export type BuildConversationReturns<
    R extends 'user' | 'gpt-assistant' | 'text-assistant'
  > = R extends 'user'
    ? OpenAI.Conversation
    : R extends 'gpt-assistant'
    ? OpenAI.GptModel.AssistantConversation
    : R extends 'text-assistant'
    ? OpenAI.TextModel.AssistantConversation
    : undefined

  export interface Response {
    /** id */
    id: string
    /** example "chat.completion" */
    object: string
    /** 创建时间（时间戳） */
    created: number
    /** 本次回答所用到的模型 */
    model: string
    /** 当用户设置stream:true时，不会返回 usage 字段 */
    usage?: ResponseUsage
  }
  /**
   * 公共请求参数
   */
  export interface RequestParams {
    /** 模型 */
    model: string
    max_tokens?: number
    temperature?: number | null
    top_p?: number | null
    n?: number | null
    stream?: boolean | null
    stop?: Array<string> | string
    logit_bias?: Record<string, number>
    presence_penalty?: number | null
    frequency_penalty?: number | null
    user?: string
  }

  /**
   * 公共返回的Choice参数
   */
  export interface ResponseChoice {
    /** 下标 */
    index?: number
    /** 结束原因 */
    finish_reason?: string | null
    /** 参数未知 作用未知 */
    content_filter_results?: {
      hate: { filtered: boolean; severity: string }
      self_harm: { filtered: boolean; severity: string }
      sexual: { filtered: boolean; severity: string }
      violence: { filtered: boolean; severity: string }
    }
  }

  /**
   * 系统、用户、助手（gpt）会话消息
   * @param role 角色 system 给系统设置的人设 user用户 assistant 助手 gpt
   * @param content 对话内容
   * @param messageId 当前对话产生的id
   * @param parentMessageId 上次对话消息id
   */
  export interface Conversation {
    role: 'user' | 'assistant' | 'system'
    content: string
    messageId: string
    parentMessageId: string
  }

  /**
   * 公共发送消息选项
   */
  export interface GetAnswerOptions {
    parentMessageId?: string
    messageId?: string
    stream?: boolean
    systemMessage?: string
  }
  /**
   * 公共角色枚举
   */
  export const RoleEnum = {
    System: 'system',
    User: 'user',
    Assistant: 'assistant'
  } as const

  type Role = (typeof RoleEnum)[keyof typeof RoleEnum]

  export interface AnswerResponse<T = any>
    extends globalThis.Response {
    json(): Promise<T>
  }

  /**
   * gpt 模型模块
   */
  export namespace GptModel {
    export interface RequestMessage
      extends Omit<
        OpenAI.Conversation,
        'messageId' | 'parentMessageId'
      > {}

    /**
     * 请求参数
     */
    export interface RequestParams
      extends OpenAI.RequestParams {
      messages: Array<RequestMessage>
    }

    export interface ResponseMessage {
      role: Role
      content: string
    }

    export interface ResponseDelta
      extends ResponseMessage {}

    export interface ResponseChoice
      extends OpenAI.ResponseChoice {
      message?: ResponseMessage
      delta: ResponseDelta
    }

    /**
     * 不走steam流接口的输出结果
     */
    export interface Response extends OpenAI.Response {
      choices: Array<ResponseChoice>
      // detail?: ResponseDetail;
    }

    export interface AssistantConversation
      extends OpenAI.Conversation {
      detail?: Response | null
    }

    export interface GetAnswerOptions
      extends OpenAI.GetAnswerOptions {
      onProgress?: (
        partialResponse: AssistantConversation
      ) => void
      requestParams?: Partial<
        Omit<RequestParams, 'messages' | 'n' | 'stream'>
      >
    }
    export interface GptCoreOptions extends CoreOptions {
      requestParams?: Partial<
        Omit<RequestParams, 'messages' | 'n' | 'stream'>
      >
    }
  }

  export namespace TextModel {
    /**
     * 发送的消息选项
     */
    export interface GetAnswerOptions
      extends OpenAI.GetAnswerOptions {
      systemPromptPrefix?: string
      onProgress?: (
        partialResponse: AssistantConversation
      ) => void
      requestParams?: Partial<
        Omit<RequestParams, 'messages' | 'n' | 'stream'>
      >
    }

    /**
     * 请求参数
     */
    export interface RequestParams
      extends OpenAI.RequestParams {
      prompt: string
      suffix?: string
      echo?: boolean
      best_of?: number
    }
    /**
     * 请求返回
     */
    export interface Response extends OpenAI.Response {
      choices: Array<ResponseChoice>
    }

    /**
     * 对数概率？？？？
     */
    export interface ResponseLogprobs {
      tokens?: Array<string>
      token_logprobs?: Array<number>
      top_logprobs?: Array<object>
      text_offset?: Array<number>
    }

    /**
     * 作用未知
     */
    export interface ResponseChoice
      extends OpenAI.ResponseChoice {
      text?: string
      logprobs: ResponseLogprobs | null
    }

    export interface AssistantConversation
      extends OpenAI.Conversation {
      detail?: Response | null
    }

    export interface TextCoreOptions extends CoreOptions {
      requestParams?: Partial<RequestParams>
      userPromptPrefix?: string
      systemPromptPrefix?: string
    }
  }
}
