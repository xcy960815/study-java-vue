import { request } from '@utils/request'

/**
 * 获取商品分类列表
 * @param requestParams
 * @returns {Promise<ResponseResult<T>>}
 */
export const getGoodsCategoryList = async <T extends ListResponseResult<GoodsCategoryVo>>(
  requestParams: GoodsCategoryDto & baseListDto
) => {
  const url = `/goodsCategory/list`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: requestParams,
  })
}

/**
 * 获取商品分类详情
 * @param goodsCategoryDto
 * @returns {Promise<ResponseResult<T>>}
 */
export const getGoodsCategoryDetail = async <T extends GoodsCategoryVo>(
  goodsCategoryDto: GoodsCategoryDto
) => {
  const url = `/goodsCategory/getGoodsCategoryDetail`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: goodsCategoryDto,
  })
}

/**
 * 新增商品分类
 * @param goodsCategoryDto
 * @returns {Promise<ResponseResult<T>>}
 */
export const insertGoodsCategory = async <T extends boolean>(
  goodsCategoryDto: GoodsCategoryDto
) => {
  const url = `/goodsCategory/insertGoodsCategory`
  return request.post<ResponseResult<T>, ResponseResult<T>>(url, goodsCategoryDto)
}

/**
 * 更新商品分类
 * @param goodsCategoryDto
 * @returns {Promise<ResponseResult<T>>}
 */
export const updateGoodsCategory = async <T extends boolean>(
  goodsCategoryDto: GoodsCategoryDto
) => {
  const url = `/goodsCategory/updateGoodsCategory`
  return request.post<ResponseResult<T>, ResponseResult<T>>(url, goodsCategoryDto)
}

/**
 * 删除商品分类
 * @param goodsCategoryDto
 * @returns {Promise<ResponseResult<T>>}
 */
export const deleteGoodsCategory = async <T extends boolean>(goodsCategoryDto: number) => {
  const url = `/goodsCategory/deleteGoodsCategory`
  return request.delete<ResponseResult<T>, ResponseResult<T>>(url, {
    params: goodsCategoryDto,
  })
}
