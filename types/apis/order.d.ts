declare type OrderStatus = -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4
declare type PayStatus = -1 | 0 | 1
declare type PaymentType = 1 | 2
declare type OrderAction =
  | 'PREPARE'
  | 'SHIP'
  | 'COMPLETE'
  | 'MANUAL_CLOSE'
  | 'TIMEOUT_CLOSE'
  | 'MERCHANT_CLOSE'

declare interface OrderVo {
  orderId: number
  orderNo: string
  userId: number
  totalPrice: number
  payStatus: PayStatus
  payType: 0 | PaymentType
  payTime: string | null
  orderStatus: OrderStatus
  extraInfo: string
  userName: string
  userPhone: string
  userAddress: string
  isDeleted?: number
  createTime: string
  updateTime: string
}

declare type OrderDto = Partial<OrderVo>

declare interface PlaceOrderItem {
  goodsId: number
  quantity: number
}

declare interface PlaceOrderRequest {
  userId: number
  userName: string
  userPhone: string
  userAddress: string
  items: PlaceOrderItem[]
}

declare interface PayOrderRequest {
  requestId: string
  orderId: number
  payType: PaymentType
}

declare interface PaymentResult {
  orderId: number
  orderNo: string
  totalPrice: number
  orderStatus: OrderStatus
  payStatus: PayStatus
  payType: PaymentType
  transactionNo: string
  idempotent: boolean
}

declare interface OrderTransitionRequest {
  orderId: number
  action: OrderAction
}

declare interface OrderPaidEvent {
  orderId: number
  orderNo: string
  userId: number
  amount: number
  paymentType: PaymentType
  transactionNo: string
}

declare interface CheckoutDraftItem extends PlaceOrderItem {
  goodsName: string
  sellingPrice: number
  stockNum: number
}
