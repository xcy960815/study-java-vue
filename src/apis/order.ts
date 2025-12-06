import { request } from '@utils/request'

/**
 * 获取订单列表
 * @param requestParams
 * @returns {Promise<T>}
 */
export const getOrderList = async <T extends ListResponseResult<OrderVo>>(
  requestParams: OrderDto & BaseListDto
) => {
  const url = `/order/getOrderList`
  return request.get<T, T>(url, {
    params: requestParams,
  })
}

/**
 * 获取订单详情
 * @param orderDto
 * @returns {Promise<T>}
 */
export const getOrderDetail = async <T extends OrderVo>(orderDto: OrderDto) => {
  const url = `/order/getOrderDetail`
  return request.get<T, T>(url, {
    params: orderDto,
  })
}

/**
 * 新增订单
 * @param orderDto
 * @returns {Promise<T>}
 */
export const insertOrder = async <T extends boolean>(orderDto: OrderDto) => {
  const url = `/order/insertOrder`
  return request.post<T, T>(url, orderDto)
}

/**
 * 更新订单
 * @param orderDto
 * @returns {Promise<T>}
 */
export const updateOrder = async <T extends boolean>(orderDto: OrderDto) => {
  const url = `/order/updateOrder`
  return request.post<T, T>(url, orderDto)
}

/**
 * 删除订单
 * @param orderId
 * @returns {Promise<T>}
 */
export const deleteOrder = async <T extends boolean>(orderId: number) => {
  const url = `/order/deleteOrder`
  return request.delete<T, T>(url, {
    params: { orderId },
  })
}
