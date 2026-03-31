declare namespace AI {
  export type ClearablePromiseOptions = {
    milliseconds: number
    message?: string
  }

  export interface AiErrorOption {
    status?: number
    statusText?: string
    url?: string
  }

  export interface FetchRequestInit extends RequestInit {
    onMessage?: (message: string) => void
  }

  export type ContentTransformer = (text: string) => string

  export interface ConversationStore {
    get(messageId: string): Promise<Conversation | undefined>
    set(message: Conversation): Promise<void>
    clear(): Promise<void>
    list?(): Promise<Array<Conversation>>
  }

  export interface TokenCountOptions {
    model?: string
  }

  export interface TokenCounter {
    count(text: string, options?: TokenCountOptions): Promise<number>
  }

  export interface OpenAITransport {
    request<R extends object>(
      path: string,
      requestInit: FetchRequestInit,
      abortSignal: AbortSignal
    ): Promise<AnswerResponse<R> | void>
  }

  export interface OpenAITransportOptions {
    apiKey?: string
    apiBaseUrl?: string
    baseURL?: string
    organization?: string
  }

  export interface CoreOptions {
    apiKey?: string
    apiBaseUrl?: string
    baseURL?: string
    organization?: string
    debug?: boolean
    maxModelTokens?: number
    maxResponseTokens?: number
    withContent?: boolean
    conversationStore?: ConversationStore | false
    tokenCounter?: TokenCounter
    transport?: OpenAITransport
    systemMessage?: string
    milliseconds?: number
    markdown2Html?: boolean
    transformResponseContent?: ContentTransformer
    completionsUrl?: string
  }

  export interface ResponseUsage {
    completion_tokens: number
    prompt_tokens: number
    total_tokens: number
  }

  export const enum RoleEnum {
    System = 'system',
    User = 'user',
    Assistant = 'assistant',
    Tool = 'tool',
    Function = 'function',
  }

  export type Role = `${RoleEnum}`

  export interface Response {
    id: string
    object: string
    created: number
    model: string
    usage?: ResponseUsage
  }

  export type OnProgress<A> = (partialResponse: A) => void

  export interface FunctionDef {
    name: string
    description?: string
    parameters?: Record<string, any>
  }

  export interface Tool {
    type: 'function'
    function: FunctionDef
  }

  export interface ToolCall {
    id: string
    type: 'function'
    function: {
      name: string
      arguments: string
    }
  }

  export interface FunctionCall {
    name: string
    arguments: string
  }

  export interface RequestParams {
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
    prompt_cache_key?: string
    prompt_cache_retention?: string
    reasoning_effort?: 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh'
    verbosity?: 'low' | 'medium' | 'high'
    tools?: Array<Tool>
    tool_choice?: string | { type: 'function'; function: { name: string } }
    parallel_tool_calls?: boolean
    store?: boolean | null
    metadata?: Record<string, string>
    response_format?:
      | { type: 'text' }
      | { type: 'json_object' }
      | {
          type: 'json_schema'
          json_schema: {
            name: string
            description?: string
            schema?: Record<string, any>
            strict?: boolean
          }
        }
    stream_options?: {
      include_usage?: boolean
    }
    modalities?: Array<'text' | 'audio'> | string[]
    audio?: {
      format: 'wav' | 'mp3' | 'flac' | 'opus' | 'pcm16'
      voice: string | { id: string }
    } | null
    prediction?: Record<string, any>
    service_tier?: 'auto' | 'default' | 'flex' | 'priority' | string
    safety_identifier?: string
    web_search_options?: Record<string, any>
  }

  export interface ResponseChoice {
    index?: number
    finish_reason?: string | null
    content_filter_results?: {
      hate: {
        filtered: boolean
        severity: string
      }
      self_harm: {
        filtered: boolean
        severity: string
      }
      sexual: {
        filtered: boolean
        severity: string
      }
      violence: {
        filtered: boolean
        severity: string
      }
    }
  }

  export interface Conversation {
    thinking?: boolean
    done?: boolean
    role: Role
    content: string
    messageId: string
    parentMessageId?: string
    name?: string
    tool_calls?: Array<ToolCall>
    tool_call_id?: string
    function_call?: FunctionCall
  }

  export interface CompletionsOptions {
    parentMessageId?: string
    messageId?: string
    stream?: boolean
    systemMessage?: string
    role?: Role
    tool_call_id?: string
    name?: string
  }

  export interface AnswerResponse<T = any> extends globalThis.Response {
    json(): Promise<T>
  }

  export interface Model {
    id: string
    object: string
    owned_by: string
  }

  export interface ListModelsResponse {
    data: Array<Model>
  }

  export namespace Gpt {
    export interface RequestMessage
      extends Omit<
        AI.Conversation,
        'messageId' | 'parentMessageId' | 'thinking' | 'done'
      > {}

    export interface RequestParams extends AI.RequestParams {
      messages: Array<RequestMessage>
    }

    export interface ResponseMessage {
      role: Role
      content: string
      tool_calls?: Array<ToolCall>
      function_call?: FunctionCall
    }

    export interface ResponseDelta extends ResponseMessage {
      tool_calls?: Array<ToolCall>
    }

    export interface ResponseChoice extends AI.ResponseChoice {
      message?: ResponseMessage
      delta?: ResponseDelta
    }

    export interface Response extends AI.Response {
      choices: Array<ResponseChoice>
    }

    export interface AssistantConversation extends AI.Conversation {
      detail?: Response | null
    }

    export interface CompletionsOptions extends AI.CompletionsOptions {
      onProgress?: OnProgress<AssistantConversation>
      requestParams?: Partial<Omit<RequestParams, 'messages' | 'n' | 'stream'>>
    }

    export interface GptCoreOptions extends CoreOptions {
      requestParams?: Partial<Omit<RequestParams, 'messages' | 'n' | 'stream'>>
    }
  }

  export namespace Text {
    export interface CompletionsOptions extends AI.CompletionsOptions {
      systemPromptPrefix?: string
      requestParams?: Partial<Omit<RequestParams, 'messages' | 'n' | 'stream'>>
      onProgress?: OnProgress<AssistantConversation>
    }

    export interface RequestParams extends AI.RequestParams {
      prompt: string
      suffix?: string
      echo?: boolean
      best_of?: number
    }

    export interface Response extends AI.Response {
      choices: Array<ResponseChoice>
    }

    export interface ResponseLogprobs {
      tokens?: Array<string>
      token_logprobs?: Array<number>
      top_logprobs?: Array<object>
      text_offset?: Array<number>
    }

    export interface ResponseChoice extends AI.ResponseChoice {
      text?: string
      logprobs?: ResponseLogprobs | null
    }

    export interface AssistantConversation extends AI.Conversation {
      detail?: Response | null
    }

    export interface TextCoreOptions extends CoreOptions {
      requestParams?: Partial<RequestParams>
      userPromptPrefix?: string
      systemPromptPrefix?: string
    }
  }
}
