import { Core } from './core'
import { RoleEnum } from '@enums'
const MODEL = 'deepseek-chat'
export class Ollama extends Core {
  /**
   * 请求参数
   */
  private readonly _requestParams: Partial<Omit<AI.Gpt.RequestParams, 'messages' | 'n' | 'stream'>>

  constructor(options: AI.Gpt.GptCoreOptions) {
    const { requestParams, ...coreOptions } = options
    super(coreOptions)
    this._requestParams = {
      model: MODEL, // 默认的model
      temperature: 0.8, // 默认的temperature (随机性)
      top_p: 1, // 默认的top_p
      presence_penalty: 1, // 默认的presence_penalty
      // 用户配置的参数
      ...requestParams
    }
  }
  /**
   * 构建fetch公共请求参数
   * @param {string} question
   * @param {AI.Gpt.completionsOptions} options
   * @returns {Promise<AI.FetchRequestInit>}
   */
  private async _getFetchRequestInit(question: string, options: AI.Gpt.completionsOptions): Promise<AI.FetchRequestInit> {
    const { onProgress, stream = !!onProgress, requestParams } = options
    // 获取用户和gpt历史对话记录
    const { messages, maxTokens } = await this._getConversationHistory(question, options)
    const body = {
      ...this._requestParams,
      ...requestParams,
      messages,
      stream,
      max_tokens: maxTokens
    }

    const fetchRequestOption: AI.FetchRequestInit = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
      signal: this._abortController.signal
    }


    return fetchRequestOption
  }

  public async completions(question: string, options: AI.Gpt.completionsOptions): Promise<AI.Gpt.AssistantConversation> {
    const userConversation = this.buildConversation(RoleEnum.User, question, options);
    await this.upsertConversation(userConversation);

    this._currentConversation = this.buildConversation(RoleEnum.Assistant, '', {
      ...options,
      messageId: userConversation.messageId
    });

    const conversationPromise = this._handleAnswerRequest(question, options)
      .then(async (conversation) => {
        await this.upsertConversation(conversation);
        conversation.parentMessageId = conversation.messageId;
        return conversation;
      }).catch((error) => {
        this._currentConversation = null;
        throw error;
      });;

    return this.clearablePromise<AI.Gpt.AssistantConversation>(conversationPromise, {
      milliseconds: this._milliseconds,
      message: ``
    });
  }

  private async _handleAnswerRequest(
    question: string,
    options: AI.Gpt.completionsOptions,
  ): Promise<AI.Gpt.AssistantConversation> {
    const { stream = !!options.onProgress } = options;
    const requestInit = await this._getFetchRequestInit(question, options);

    return stream
      ? this._handleStreamResponse(requestInit, options.onProgress)
      : this._handleNonStreamResponse(requestInit);
  }

  private async _handleStreamResponse(
    requestInit: AI.FetchRequestInit,
    onProgress?: AI.Gpt.completionsOptions["onProgress"]
  ): Promise<AI.Gpt.AssistantConversation> {
    return new Promise<AI.Gpt.AssistantConversation>((resolve, reject) => {
      requestInit.onMessage = (data: string) => {
        this._processStreamData(data, resolve, onProgress);
      };
      this._fetchSSE<AI.Gpt.Response>(this.completionsUrl, requestInit).catch(reject);
    });
  }

  private _processStreamData(
    data: string,
    resolve: (value: AI.Gpt.AssistantConversation) => void,
    onProgress?: AI.Gpt.completionsOptions["onProgress"]
  ): void {
    if (data === '[DONE]') {
      this._currentConversation!.content = this._currentConversation!.content.trim();
      this._currentConversation!.done = true;
      this._currentConversation!.thinking = false;
      resolve(this._currentConversation!);
      return;
    }

    const response: AI.Gpt.Response = JSON.parse(data);
    this._updateConversationFromResponse(response);
    onProgress?.(this._currentConversation!);
  }

  private async _handleNonStreamResponse(
    requestInit: AI.FetchRequestInit,
  ): Promise<AI.Gpt.AssistantConversation> {
    const response = await this._fetchSSE<AI.Gpt.Response>(this.completionsUrl, requestInit);
    const data = await response?.json();

    if (data) {
      this._updateConversationFromResponse(data);
    }

    return this._currentConversation!;
  }

  private _updateConversationFromResponse(
    response: AI.Gpt.Response,
  ): void {
    if (response?.id) {
      this._currentConversation!.messageId = response.id;
    }

    if (response?.choices?.length) {
      const choice = response.choices[0];
      const messageOrDelta = 'message' in choice ? choice.message : choice.delta;

      if (messageOrDelta?.content) {
        this._currentConversation!.content += messageOrDelta.content || '';
      }
      if (messageOrDelta?.role) {
        this._currentConversation!.role = messageOrDelta.role;
      }
    }

    this._currentConversation!.detail = response;
    this._currentConversation!.thinking = false;
  }

  /**
   * 获取会话消息历史
   * @param {string} text
   * @param {Required<AI.Gpt.completionsOptions>} options
   * @returns {Promise<{
   * messages: AI.Gpt.RequestMessage[]
   * text:string
   * }>}
   */
  private async _getConversationHistory(
    text: string,
    options: AI.Gpt.completionsOptions
  ): Promise<{
    messages: Array<AI.Gpt.RequestMessage>
    maxTokens: number
  }> {
    const { systemMessage } = options
    const maxTokenCount = this._maxModelTokens - this._maxResponseTokens
    // 上次的会话id
    let parentMessageId = options.parentMessageId

    // 当前系统和用户消息
    const messages: Array<AI.Gpt.RequestMessage> = [
      {
        role: RoleEnum.System,
        content: systemMessage || this._systemMessage
      },
      // 用户当前的问题
      {
        role: RoleEnum.User,
        content: text
      }
    ]

    let tokenCount = 0
    let prompt = ''

    while (this._withContent) {
      // 计算
      messages.forEach((item) => {
        prompt += item.role
        prompt += item.content
      })

      tokenCount = this.getTokenCount(prompt)

      // 当前 prompt token 数量大于最大 token 数量时，不再向上查找
      if (prompt && tokenCount > maxTokenCount) {
        break
      }
      if (!parentMessageId) {
        break
      }

      const parentMessage = await this.getConversation(parentMessageId)

      if (!parentMessage) {
        break
      }

      const historyConversation = {
        role: parentMessage.role,
        content: parentMessage.content
      }
      // 插入会话消息
      messages.splice(1, 0, historyConversation)

      // 上次对话id
      parentMessageId = parentMessage.parentMessageId
    }

    const maxTokens = Math.max(1, Math.min(this._maxModelTokens - tokenCount, this._maxResponseTokens))

    return { messages, maxTokens }
  }
}
