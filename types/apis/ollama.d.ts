/**
 * Ollama 模块声明
 */
declare namespace OllamaVo {
  /**
   * generate 接口返回参数
   */
  export interface Generate {
    model: string
    created_at: string
    response: string
    done: boolean
    done_reason: string
    context: Array<number>
    total_duration: number
    load_duration: number
    prompt_eval_count: number
    prompt_eval_duration: number
    eval_count: number
    eval_duration: number
  }

  interface ModelOption {
    id: string
    object: string
    created: number
    owned_by: string
  }
  /**
   * models 接口返回参数
   */
  export interface Models {
    object: string
    data: Array<ModelOption>
  }

  interface Details {
    parent_model: string
    format: string
    family: string
    families: Array<string>
    parameter_size: string
    quantization_level: string
  }

  interface PsModelOption {
    /** 模型名称 */
    name: string
    /** 模型模型 */
    model: string
    /** 模型大小 */
    size: number
    digest: string
    details: Details
    expires_at: string
    size_vram: number
  }
  /**
   * ps 接口返回参数
   */
  export interface Ps {
    models: Array<PsModelOption>
  }

  interface ModleInfo {
    // General fields

    generalArchitecture: string

    generalBasename: string

    generalFileType: number

    generalParameterCount: number

    generalQuantizationVersion: number

    generalSizeLabel: string

    generalType: string

    generalVersion: string

    // Qwen2 fields

    qwen2AttentionHeadCount: string

    qwen2AttentionHeadCountKv: string

    qwen2AttentionLayerNormRmsEpsilon: string

    qwen2BlockCount: string

    qwen2ContextLength: string

    qwen2EmbeddingLength: string

    qwen2FeedForwardLength: string

    qwen2RopeFreqBase: string

    // Tokenizer fields

    tokenizerGgmlAddBosToken: string

    tokenizerGgmlAddEosToken: string

    tokenizerGgmlBosTokenId: string

    tokenizerGgmlEosTokenId: string

    tokenizerGgmlMerges: string

    tokenizerGgmlModel: string

    tokenizerGgmlPaddingTokenId: string

    tokenizerGgmlPre: string

    tokenizerGgmlTokenType: string

    tokenizerGgmlTokens: string
  }

  export interface Show {
    license: string
    modelfile: string
    parameters: string
    template: string
    details: Details
    model_info: ModleInfo
    modified_at: string
  }

  export interface Version {
    version: string
  }

  interface Model {
    name: string
    model: string
    modified_at: string
    size: number
    digest: string
    details: Details
  }

  export interface Tags {
    models: Array<Model>
  }
}

declare namespace OllamaDto {
  /**
   * generate 接口请求参数
   */
  export interface Generate {
    model: string
    prompt: string
    stream?: boolean
  }

  export interface DeleteModelVo {
    name: string
  }
}
