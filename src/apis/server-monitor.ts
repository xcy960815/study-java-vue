import { request } from '@/utils/request'

/**
 * 获取服务器信息
 */
export function getServerInfo() {
  return request.get<ServerInfoVo, ServerInfoVo>('/monitor/server/info')
}

/**
 * 开始推送服务器监控数据
 */
export function startServerMonitor() {
  return request.post<string, string>('/monitor/server/start')
}

/**
 * 停止推送服务器监控数据
 */
export function stopServerMonitor() {
  return request.post<string, string>('/monitor/server/stop')
}
