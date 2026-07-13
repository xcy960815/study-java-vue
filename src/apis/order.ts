import { request } from '@utils/request'

export const getOrderList = (requestParams: OrderDto & BaseListDto) => {
  return request.get<ListResponseResult<OrderVo>, ListResponseResult<OrderVo>>(
    '/order/getOrderList',
    { params: requestParams }
  )
}

export const getOrderInfo = (orderId: number) => {
  return request.get<OrderVo, OrderVo>('/order/getOrderInfo', {
    params: { id: orderId },
  })
}

export const placeOrder = (placeOrderRequest: PlaceOrderRequest) => {
  return request.post<OrderVo, OrderVo>('/order/place', placeOrderRequest)
}

export const payOrder = (payOrderRequest: PayOrderRequest) => {
  return request.post<PaymentResult, PaymentResult>('/order/pay', payOrderRequest)
}

export const transitionOrder = (transitionRequest: OrderTransitionRequest) => {
  return request.post<OrderVo, OrderVo>('/order/transition', transitionRequest)
}

export const deleteOrder = (orderId: number) => {
  return request.delete<boolean, boolean>('/order/deleteOrder', {
    params: { id: orderId },
  })
}
