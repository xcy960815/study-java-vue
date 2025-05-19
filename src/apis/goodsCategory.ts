import { request } from '@utils/request'

/**
 * 获取商品分类列表
 * @param requestParams
 * @returns {Promise<ResponseResult<T>>}
 */
export const getGoodsCategoryList = async <T extends ListResponseResult<GoodsCategoryVo>>(
  requestParams: GoodsCategoryDto
) => {
  const url = `/goodsCategory/list`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: requestParams,
  })
}

/**
 * 获取商品分类详情
 * @param requestParams
 * @returns {Promise<ResponseResult<T>>}
 */
export const getGoodsCategoryDetail = async <T extends GoodsCategoryVo>(
  requestParams: GoodsCategoryDto
) => {
  const url = `/goodsCategory/getGoodsCategoryDetail`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: requestParams,
  })
}
