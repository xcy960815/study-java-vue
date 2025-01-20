declare interface baseListParams {
  pageSize: number
  pageNum: number
}

declare type ResponseResult<T = any> = {
  code: number
  data: T
  message: string
}

declare interface ListResonse<D extends Object> {
  data: D[]
  total: number
}
