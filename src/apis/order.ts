import { request } from '@utils/request'

/**
 * 获取订单列表。
 *
 * @param requestParams - 订单筛选条件与分页参数
 * @returns 订单分页结果
 */
export const getOrderList = (requestParams: OrderDto & BaseListDto) => {
  return request.get<ListResponseResult<OrderVo>, ListResponseResult<OrderVo>>(
    '/order/getOrderList',
    { params: requestParams }
  )
}

/**
 * 获取订单详情。
 *
 * @param orderId - 订单ID
 * @returns 订单详情
 */
export const getOrderInfo = (orderId: number) => {
  return request.get<OrderVo, OrderVo>('/order/getOrderInfo', {
    params: { id: orderId },
  })
}

/**
 * 下单。
 *
 * @param placeOrderRequest - 订单收货信息与商品条目
 * @returns 新创建的订单
 */
export const placeOrder = (placeOrderRequest: PlaceOrderRequest) => {
  return request.post<OrderVo, OrderVo>('/order/place', placeOrderRequest)
}

/**
 * 支付订单。
 *
 * @param payOrderRequest - 支付请求（幂等键、订单ID、支付方式）
 * @returns 支付结果
 */
export const payOrder = (payOrderRequest: PayOrderRequest) => {
  return request.post<PaymentResult, PaymentResult>('/order/pay', payOrderRequest)
}

/**
 * 流转订单状态（发货、收货等）。
 *
 * @param transitionRequest - 订单ID与目标动作
 * @returns 流转后的订单
 */
export const transitionOrder = (transitionRequest: OrderTransitionRequest) => {
  return request.post<OrderVo, OrderVo>('/order/transition', transitionRequest)
}

/**
 * 删除订单。
 *
 * @param orderId - 订单ID
 * @returns 是否删除成功
 */
export const deleteOrder = (orderId: number) => {
  return request.delete<boolean, boolean>('/order/deleteOrder', {
    params: { id: orderId },
  })
}
