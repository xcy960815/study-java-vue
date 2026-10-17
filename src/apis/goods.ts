import { request } from '@utils/request'

/**
 * 获取商品列表。
 *
 * @param requestParams - 商品查询条件与分页参数
 * @returns 商品分页结果
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
 * 按条件获取商品详情。
 *
 * @param goodsDto - 商品查询条件（如商品ID）
 * @returns 商品详情
 */
export const getGoodsInfo = async <T extends GoodsVo>(goodsDto: GoodsDto) => {
  const url = `/goods/getGoodsInfo`
  return request.get<T, T>(url, {
    params: goodsDto,
  })
}

/**
 * 新增商品。
 *
 * @param goodsDto - 待新增的商品信息
 * @returns 是否新增成功
 */
export const insertGoods = async <T extends boolean>(goodsDto: GoodsDto) => {
  const url = `/goods/insertGoods`
  return request.put<T, T>(url, goodsDto)
}

/**
 * 更新商品信息。
 *
 * @param goodsDto - 待更新的商品信息
 * @returns 是否更新成功
 */
export const updateGoods = async <T extends boolean>(goodsDto: GoodsDto) => {
  const url = `/goods/updateGoods`
  return request.post<T, T>(url, goodsDto)
}

/**
 * 获取商品分类树。
 *
 * @returns 商品分类树
 */
export const getGoodsCategoryTree = async <T extends GoodsCategoryVo[]>() => {
  return request.get<T, T>('/goods/category/tree')
}

/**
 * 新增商品分类。
 *
 * @param category - 待新增的分类信息
 * @returns 是否新增成功
 */
export const insertGoodsCategory = async <T extends boolean>(category: GoodsCategoryDto) => {
  return request.post<T, T>('/goods/category', category)
}

/**
 * 更新商品分类。
 *
 * @param category - 待更新的分类信息
 * @returns 是否更新成功
 */
export const updateGoodsCategory = async <T extends boolean>(category: GoodsCategoryDto) => {
  return request.put<T, T>('/goods/category', category)
}

/**
 * 删除商品分类。
 *
 * @param categoryId - 分类ID
 * @returns 是否删除成功
 */
export const deleteGoodsCategory = async <T extends boolean>(categoryId: number) => {
  return request.delete<T, T>(`/goods/category/${categoryId}`)
}

/**
 * 删除商品。
 *
 * @param id - 商品ID
 * @returns 是否删除成功
 */
export const deleteGoods = async <T extends boolean>(id: number) => {
  const url = `/goods/deleteGoods`
  return request.delete<T, T>(url, {
    params: { id },
  })
}
