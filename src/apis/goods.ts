import { request } from '@utils/request'

/**
 * 获取商品分类列表
 * @param requestParams
 * @returns {Promise<ResponseResult<T>>}
 */
export const getGoodsList = async <T extends ListResponseResult<GoodsVo>>(
  requestParams: GoodsDto & BaseListDto
) => {
  const url = `/goods/getGoodsList`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: requestParams,
  })
}

/**
 * 获取商品分类详情
 * @param goodsCategoryDto
 * @returns {Promise<ResponseResult<T>>}
 */
export const getGoodsInfo = async <T extends GoodsVo>(goodsDto: GoodsDto) => {
  const url = `/goods/getGoodsInfo`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: goodsDto,
  })
}

/**
 * 新增商品分类
 * @param goodsCategoryDto
 * @returns {Promise<ResponseResult<T>>}
 */
export const insertGoods = async <T extends boolean>(goodsDto: GoodsDto) => {
  const url = `/goods/insertGoods`
  return request.post<ResponseResult<T>, ResponseResult<T>>(url, goodsDto)
}

/**
 * 更新商品分类
 * @param goodsCategoryDto
 * @returns {Promise<ResponseResult<T>>}
 */
export const updateGoods = async <T extends boolean>(goodsDto: GoodsDto) => {
  const url = `/goods/updateGoods`
  return request.post<ResponseResult<T>, ResponseResult<T>>(url, goodsDto)
}

/**
 * 删除商品分类
 * @param goodsCategoryDto
 * @returns {Promise<ResponseResult<T>>}
 */
export const deleteGoods = async <T extends boolean>(id: number) => {
  const url = `/goods/deleteGoods`
  return request.delete<ResponseResult<T>, ResponseResult<T>>(url, {
    params: { id },
  })
}
