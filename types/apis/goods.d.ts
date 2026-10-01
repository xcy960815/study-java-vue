/**
 * 商品分类
 */
declare interface GoodsVo {
  goodsId: number
  goodsName: string
  goodsIntro: string
  goodsCategoryId: number
  categoryName?: string
  goodsCoverImg: string
  goodsCarousel: string
  goodsDetailContent: string
  originalPrice: number
  sellingPrice: number
  stockNum: number
  tag: string
  goodsSellStatus: number
  createUser: number
  createTime: string
  updateUser: number
  updateTime: string
}

/**
 * 商品分类请求参数
 */
declare interface GoodsDto extends Partial<GoodsVo> {
  categoryLevel?: number
}

declare interface GoodsCategoryVo {
  categoryId: number
  parentId: number
  categoryName: string
  categoryLevel: number
  orderNum: number
  remark?: string
  children?: GoodsCategoryVo[]
}

declare interface GoodsCategoryDto {
  categoryId?: number
  parentId: number
  categoryName: string
  orderNum?: number
  remark?: string
}
