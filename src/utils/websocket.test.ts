import { afterEach, describe, expect, it, vi } from 'vitest'

import { getWebSocketUrl } from './websocket'

describe('getWebSocketUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('生成原生 WebSocket 端点的 ws(s) 地址', () => {
    vi.stubEnv('VITE_API_DOMAIN_PREFIX', 'prod-api')
    const scheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = getWebSocketUrl()
    expect(url).toBe(
      `${scheme}//${window.location.host}/prod-api/ws/server-monitor-native`
    )
  })

  it('未配置前缀时回退 dev-api', () => {
    vi.stubEnv('VITE_API_DOMAIN_PREFIX', '')
    const url = getWebSocketUrl()
    expect(url).toContain('/dev-api/ws/server-monitor-native')
  })
})
