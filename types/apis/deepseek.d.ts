declare namespace DeepSeekDto {
  export interface Models {
    object: string
    data: Array<ModelOption>
  }

  interface ModelOption {
    id: string
    object: string
    created: number
    owned_by: string
  }
}
