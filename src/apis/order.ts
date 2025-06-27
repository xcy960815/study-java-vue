import { request } from '@utils/request'

/**
 * 获取订单列表
 * @param requestParams
 * @returns {Promise<ResponseResult<T>>}
 */
export const getOrderList = async <T extends ListResponseResult<OrderVo>>(
  requestParams: OrderDto & BaseListDto
) => {
  const url = `/order/getOrderList`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: requestParams,
  })
}

/**
 * 获取订单详情
 * @param orderDto
 * @returns {Promise<ResponseResult<T>>}
 */
export const getOrderDetail = async <T extends OrderVo>(orderDto: OrderDto) => {
  const url = `/order/getOrderDetail`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: orderDto,
  })
}

/**
 * 新增订单
 * @param orderDto
 * @returns {Promise<ResponseResult<T>>}
 */
export const insertOrder = async <T extends boolean>(orderDto: OrderDto) => {
  const url = `/order/insertOrder`
  return request.post<ResponseResult<T>, ResponseResult<T>>(url, orderDto)
}

/**
 * 更新订单
 * @param orderDto
 * @returns {Promise<ResponseResult<T>>}
 */
export const updateOrder = async <T extends boolean>(orderDto: OrderDto) => {
  const url = `/order/updateOrder`
  return request.post<ResponseResult<T>, ResponseResult<T>>(url, orderDto)
}

/**
 * 删除订单
 * @param orderId
 * @returns {Promise<ResponseResult<T>>}
 */
export const deleteOrder = async <T extends boolean>(orderId: number) => {
  const url = `/order/deleteOrder`
  return request.delete<ResponseResult<T>, ResponseResult<T>>(url, {
    params: { orderId },
  })
}
