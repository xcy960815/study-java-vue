/**
 * 服务器信息 VO
 */
declare interface ServerInfoVo {
  cpu: CpuInfoVo
  memory: MemoryInfoVo
  jvm: JvmInfoVo
  disk: DiskInfoVo
  sys: SysInfoVo
}

/**
 * CPU 信息
 */
declare interface CpuInfoVo {
  /** CPU 核心数 */
  cpuNum: number
  /** CPU 使用率 (%) */
  used: number
  /** CPU 空闲率 (%) */
  free: number
  /** CPU 型号 */
  cpuModel: string
}

/**
 * 内存信息
 */
declare interface MemoryInfoVo {
  /** 总内存 (GB) */
  total: number
  /** 已使用内存 (GB) */
  used: number
  /** 空闲内存 (GB) */
  free: number
  /** 使用率 (%) */
  usage: number
}

/**
 * JVM 信息
 */
declare interface JvmInfoVo {
  /** JVM 总内存 (MB) */
  total: number
  /** JVM 最大可使用内存 (MB) */
  max: number
  /** JVM 已使用内存 (MB) */
  used: number
  /** JVM 空闲内存 (MB) */
  free: number
  /** JVM 使用率 (%) */
  usage: number
  /** JVM 版本 */
  version: string
  /** JVM 启动时间 */
  startTime: string
  /** JVM 运行时长 */
  runTime: string
}

/**
 * 磁盘信息
 */
declare interface DiskInfoVo {
  /** 总空间 (GB) */
  total: number
  /** 已使用空间 (GB) */
  used: number
  /** 可用空间 (GB) */
  free: number
  /** 使用率 (%) */
  usage: number
}

/**
 * 系统信息
 */
declare interface SysInfoVo {
  /** 操作系统 */
  os: string
  /** 系统架构 */
  arch: string
  /** 服务器名称 */
  hostname: string
  /** 服务器 IP */
  ip: string
}

/**
 * 监控指标历史键
 */
declare type ServerMetricKey = 'cpu_usage' | 'memory_usage' | 'jvm_usage' | 'disk_usage'

/**
 * 监控指标卡数据
 */
declare interface ServerMetricValue {
  /** 指标键 */
  key: ServerMetricKey
  /** 指标展示名 */
  label: string
  /** 指标单位 */
  unit: string
  /** 当前值（null 表示无数据） */
  value: number | null
  /** 指标状态 */
  status: 'ok' | 'warning' | 'danger' | 'unavailable'
}

/**
 * 单个趋势点（Unix 秒级时间戳）
 */
declare interface ServerMetricsHistoryPoint {
  /** 采样时间（Unix 秒级时间戳） */
  timestamp: number
  /** 采样值 */
  value: number
}

/**
 * 监控指标历史趋势响应
 */
declare interface ServerMetricsHistoryVo {
  /** 指标键 */
  metricKey: ServerMetricKey
  /** 指标展示名 */
  label: string
  /** 指标单位 */
  unit: string
  /** 趋势点列表（按时间升序） */
  points: ServerMetricsHistoryPoint[]
}
