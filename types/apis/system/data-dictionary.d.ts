declare interface DataDictionaryVo {
  /**
   * 主键ID
   */
  id: number

  /**
   * 字典类型
   */
  dictType: string

  /**
   * 字典编码
   */
  dictCode: string

  /**
   * 字典名称
   */
  dictName: string

  /**
   * 字典值
   */
  dictValue: string

  /**
   * 排序号
   */
  sortOrder: number

  /**
   * 状态（0-禁用，1-启用）
   */
  status: number

  /**
   * 备注
   */
  remark?: string

  /**
   * 创建人
   */
  createdBy?: string

  /**
   * 创建时间
   */
  createdTime?: string

  /**
   * 更新人
   */
  updatedBy?: string

  /**
   * 更新时间
   */
  updatedTime?: string
}

declare interface DataDictionaryDto
  extends Omit<DataDictionaryVo, 'createdBy' | 'createdTime' | 'updatedBy' | 'updatedTime'> {
  id?: number
}
