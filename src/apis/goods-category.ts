import { request } from '@utils/request'

export const getGoodsCategoryList = async <
  T extends ListResonse<GoodsCategoryDto>
>(
  requestParams: GoodsCategoryVo
) => {
  const url = `/goodsCategory/list`
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url,
    {
      params: requestParams
    }
  )
}

export const getGoodsCategoryDetail = async <
  T extends GoodsCategoryDto
>(
  requestParams: GoodsCategoryVo
) => {
  const url = `/goodsCategory/getGoodsCategoryDetail`
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url,
    {
      params: requestParams
    }
  )
}
