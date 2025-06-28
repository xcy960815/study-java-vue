/**
 * 商品分类
 */
declare interface GoodsVo {
  goodsId: number
  goodsName: string
  goodsIntro: string
  goodsCategoryId: number
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
