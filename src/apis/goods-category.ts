import { request } from '@utils/request'

export const getGoodsCategoryList = async <
  T extends ListResonse<GoodsCategoryDto>
>(
  requestParams: GoodsCategoryVo
) => {
  const url = `/goodsCategory/getGoodsCategoryList`
  return request.get<ResponseResult<T>, ResponseResult<T>>(
    url,
    {
      params: requestParams
    }
  )
}
