import { request } from '@utils/request'

/**
 * 获取商品分类详情
 * @param requestParams
 * @returns
 */
export const getGoodsCategoryDetail = async <T extends GoodsVo>(
  requestParams: GoodsCategoryDto
) => {
  const url = `/goodsCategory/getGoodsCategoryDetail`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: requestParams,
  })
}
