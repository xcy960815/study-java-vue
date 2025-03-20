import { request } from '@utils/request'

export const getGoodsCategoryDetail = async <T extends GoodsCategoryDto>(requestParams: GoodsCategoryVo) => {
  const url = `/goodsCategory/getGoodsCategoryDetail`
  return request.get<ResponseResult<T>, ResponseResult<T>>(url, {
    params: requestParams
  })
}
