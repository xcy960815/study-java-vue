/**
 * 操作日志视图对象接口
 */
declare interface OperLogVo {
  /** 日志主键 */
  operId: number
  /** 模块标题 */
  title: string
  /** 业务类型（0其它 1新增 2修改 3删除 4授权 5导出 6导入 7强退 8生成代码 9清空数据 10查询） */
  businessType: number
  /** 方法名称 */
  method: string
  /** 请求方式 */
  requestMethod: string
  /** 操作类别（0其它 1后台用户 2手机端用户） */
  operatorType: number
  /** 操作人员 */
  operName: string
  /** 部门名称 */
  deptName: string
  /** 请求URL */
  operUrl: string
  /** 主机地址 */
  operIp: string
  /** 操作地点 */
  operLocation: string
  /** 请求参数 */
  operParam: string
  /** 返回参数 */
  jsonResult: string
  /** 操作状态（0正常 1异常） */
  status: number
  /** 错误消息 */
  errorMsg: string
  /** 操作时间 */
  operTime: string
  /** 消耗时间 */
  costTime: number
}

/**
 * 操作日志查询参数对象
 */
declare type OperLogDto = Partial<OperLogVo>
