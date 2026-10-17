/**
 * 服务监控展示层工具：指标卡数据构造、状态阈值与状态文案。
 *
 * 从 ServerInfoVo 快照构造指标卡数据，与图表渲染解耦；不包含请求与动画逻辑。
 */

/** 指标卡状态到中文文案的映射 */
const STATUS_TEXT: Record<ServerMetricValue['status'], string> = {
  ok: '正常',
  warning: '警告',
  danger: '危险',
  unavailable: '暂无数据',
}

/** 指标定义（键与展示名，单位统一为 %） */
export const METRIC_OPTIONS: Array<{ label: string; value: ServerMetricKey }> = [
  { label: 'CPU 使用率', value: 'cpu_usage' },
  { label: '内存使用率', value: 'memory_usage' },
  { label: 'JVM 内存使用率', value: 'jvm_usage' },
  { label: '磁盘使用率', value: 'disk_usage' },
]

/** 历史趋势时间范围选项，value 为往前追溯的秒数 */
export const RANGE_OPTIONS = [
  { label: '1小时', value: 3600 },
  { label: '6小时', value: 21600 },
  { label: '24小时', value: 86400 },
  { label: '7天', value: 604800 },
  { label: '30天', value: 2592000 },
]

/**
 * 将指标状态转换为中文展示文案。
 *
 * @param status - 指标状态
 * @returns 状态文案，如「正常」「暂无数据」
 */
export const getStatusText = (status: ServerMetricValue['status']): string => STATUS_TEXT[status]

/**
 * 按使用率阈值判定状态：<60% 正常、<85% 警告、否则危险。
 *
 * @param value - 使用率百分比
 * @returns 指标状态
 */
const statusOfUsage = (value: number): ServerMetricValue['status'] => {
  if (value < 60) {
    return 'ok'
  }
  return value < 85 ? 'warning' : 'danger'
}

/**
 * 构造无数据时期的占位指标卡列表。
 *
 * @returns 四张「暂无数据」占位卡
 */
export const buildEmptyServerMetrics = (): ServerMetricValue[] =>
  METRIC_OPTIONS.map((option) => ({
    key: option.value,
    label: option.label,
    unit: '%',
    value: null,
    status: 'unavailable',
  }))

/**
 * 由服务器信息快照构造指标卡数据。
 *
 * @param info - 服务器信息快照
 * @returns CPU/内存/JVM/磁盘使用率的指标卡列表
 */
export const serverInfoToMetrics = (info: ServerInfoVo): ServerMetricValue[] => {
  const usageOf: Record<ServerMetricKey, number> = {
    cpu_usage: info.cpu.used,
    memory_usage: info.memory.usage,
    jvm_usage: info.jvm.usage,
    disk_usage: info.disk.usage,
  }
  return METRIC_OPTIONS.map((option) => {
    const value = usageOf[option.value]
    return {
      key: option.value,
      label: option.label,
      unit: '%',
      value,
      status: typeof value === 'number' && Number.isFinite(value) ? statusOfUsage(value) : 'unavailable',
    }
  })
}
