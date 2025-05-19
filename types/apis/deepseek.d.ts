declare namespace DeepSeekVo {
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

  export interface Balance {
    is_available: boolean
    balance_infos: Array<BalanceInfo>
  }
  interface BalanceInfo {
    currency: string
    total_balance: string
    granted_balance: string
    topped_up_balance: string
  }
}
