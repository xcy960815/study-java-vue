declare interface OrderVo {
  orderId: number
  orderNo: string
  userId: number
  totalPrice: number
  payStatus: number
  payType: number
  payTime: string | null
  orderStatus: number
  extraInfo: string
  userName: string
  userPhone: string
  userAddress: string
  isDeleted: number
  createTime: string
  updateTime: string
}

declare type OrderDto = Partial<OrderVo>
