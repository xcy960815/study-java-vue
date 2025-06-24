declare type ResponseResult<T = any> = {
  code: number
  data: T
  message: string
}

declare interface ListResponseResult<D extends Object> {
  data: Array<D>
  total: number
}
