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
