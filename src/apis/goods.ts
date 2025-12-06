import { request } from '@utils/request'

/**
 * 获取商品分类列表
 * @param requestParams
 */
export const getGoodsList = async <T extends ListResponseResult<GoodsVo>>(
  requestParams: GoodsDto & BaseListDto
) => {
  const url = `/goods/getGoodsList`
  return request.get<T, T>(url, {
    params: requestParams,
  })
}

/**
 * 获取商品
 * @param GoodsDto
 * @returns {Promise<T>}
 */
export const getGoodsInfo = async <T extends GoodsVo>(goodsDto: GoodsDto) => {
  const url = `/goods/getGoodsInfo`
  return request.get<T, T>(url, {
    params: goodsDto,
  })
}

/**
 * 新增商品
 * @param GoodsDto
 * @returns {Promise<T>}
 */
export const insertGoods = async <T extends boolean>(goodsDto: GoodsDto) => {
  const url = `/goods/insertGoods`
  return request.put<T, T>(url, goodsDto)
}

/**
 * 更新商品
 * @param GoodsDto
 * @returns {Promise<T>}
 */
export const updateGoods = async <T extends boolean>(goodsDto: GoodsDto) => {
  const url = `/goods/updateGoods`
  return request.post<T, T>(url, goodsDto)
}

/**
 * 删除商品
 * @param number
 * @returns {Promise<T>}
 */
export const deleteGoods = async <T extends boolean>(id: number) => {
  const url = `/goods/deleteGoods`
  return request.delete<T, T>(url, {
    params: { id },
  })
}
