declare interface GoodsCategoryDto {
  categoryId: number | null

  /**
   * 分类级别(1-一级分类 2-二级分类 3-三级分类)
   */
  categoryLevel: string

  /**
   * 父分类id
   */
  parentId: number

  /**
   * 分类名称
   */
  categoryName: string

  /**
   * 排序值(字段越大越靠前)
   */
  categoryRank: number

  /**
   * 删除标识字段(0-未删除 1-已删除)
   */
  isDeleted: number

  /**
   * 创建时间
   */
  createTime: string

  /**
   * 创建者id
   */
  createUser: number

  /**
   * 修改时间
   */
  updateTime: string

  /**
   * 修改者id
   */
  updateUser: number
}

declare interface GoodsCategoryVo
  extends Partial<
    Omit<
      GoodsCategoryDto & baseListParams,
      | 'createTime'
      | 'createUser'
      | 'updateTime'
      | 'updateUser'
    >
  > {
  categoryLevel: number
}
