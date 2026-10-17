import { request } from '@utils/request'

/** 虚拟线程基准测试请求参数 */
export interface VirtualThreadBenchmarkRequest {
  /** 提交任务总数 */
  taskCount?: number
  /** 单任务模拟阻塞时长（毫秒） */
  sleepMillis?: number
}

/** 单个执行引擎的基准测试结果 */
export interface VirtualThreadEngineResult {
  /** 引擎标识，如 platform-8 / virtual */
  engineKey: string
  /** 引擎名称 */
  label: string
  /** 平台线程池：PLATFORM；虚拟线程：VIRTUAL */
  threadType: 'PLATFORM' | 'VIRTUAL'
  /** 并发力度：平台线程池为池大小，虚拟线程引擎≈任务数 */
  workerCount: number
  /** 引擎实际处理的任务总数 */
  taskCount: number
  /** 该引擎整轮完成耗时（毫秒） */
  wallMillis: number
  /** 吞吐量（任务/秒） */
  throughputPerSecond: number
  /** 该引擎运行期间 JVM 平台线程峰值 */
  peakPlatformThreads: number
}

/** 虚拟线程基准测试聚合结果 */
export interface VirtualThreadBenchmarkResult {
  /** Java 运行时版本 */
  javaVersion: string
  /** 提交任务总数 */
  taskCount: number
  /** 单任务模拟阻塞时长（毫秒） */
  sleepMillis: number
  /** 全部引擎串行执行的总耗时（毫秒） */
  totalElapsedMillis: number
  /** 各执行引擎的结果列表 */
  engines: VirtualThreadEngineResult[]
}

/**
 * 运行虚拟线程基准测试。
 * 最长轮次约 20 秒，与后端约定放宽 axios 超时。
 *
 * @param requestParams - 任务总数与单任务阻塞毫秒数
 * @returns 平台线程池与虚拟线程各引擎的基准结果
 */
export const runVirtualThreadBenchmark = (requestParams?: VirtualThreadBenchmarkRequest) => {
  return request.post<VirtualThreadBenchmarkResult, VirtualThreadBenchmarkResult>(
    '/lab/virtual-thread/benchmark',
    requestParams ?? {},
    { timeout: 90 * 1000 }
  )
}
