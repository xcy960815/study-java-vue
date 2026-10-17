import { request } from '@/utils/request'

/**
 * 获取服务器当前快照信息。
 *
 * @returns CPU、内存、JVM、磁盘与系统信息
 */
export function getServerInfo() {
  return request.get<ServerInfoVo, ServerInfoVo>('/monitor/server/info')
}

/**
 * 开始通过 SSE 推送服务器监控数据。
 *
 * @returns 推送会话标识
 */
export function startServerMonitor() {
  return request.post<string, string>('/monitor/server/start')
}

/**
 * 停止推送服务器监控数据。
 *
 * @returns 操作结果信息
 */
export function stopServerMonitor() {
  return request.post<string, string>('/monitor/server/stop')
}

/**
 * 查询服务器监控指标历史趋势。
 *
 * @param metricKey - 指标键（cpu_usage/memory_usage/jvm_usage/disk_usage）
 * @param start - Unix 秒级起始时间（含）
 * @param end - Unix 秒级结束时间（含）
 * @returns 指标趋势数据（label/unit/points）
 */
export function getServerMetricsHistory<T extends ServerMetricsHistoryVo>(
  metricKey: ServerMetricKey,
  start: number,
  end: number
): Promise<T> {
  return request.get<T, T>('/monitor/server/history', {
    params: { metricKey, start, end },
  })
}
