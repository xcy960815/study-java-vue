import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { refreshTokens } from './request'
import { getRefreshToken, getToken } from './token'
import { startTokenKeepAlive } from './token-keepalive'

vi.mock('./request', () => ({ refreshTokens: vi.fn() }))
vi.mock('./token', () => ({
  getToken: vi.fn(),
  getRefreshToken: vi.fn(),
}))

const REFRESH_INTERVAL = 12 * 60 * 60 * 1000

/** 让 getToken/getRefreshToken 的 mock 以确定的登录态返回 */
const mockAuthState = (token: string | null, refreshToken: string | null) => {
  vi.mocked(getToken).mockResolvedValue(token)
  vi.mocked(getRefreshToken).mockResolvedValue(refreshToken)
}

describe('startTokenKeepAlive', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('登录态下到期触发一次续期', async () => {
    mockAuthState('access-token', 'refresh-token')
    startTokenKeepAlive()

    await vi.advanceTimersByTimeAsync(REFRESH_INTERVAL - 1)
    expect(refreshTokens).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(refreshTokens).toHaveBeenCalledTimes(1)
  })

  it('未登录时不发起续期', async () => {
    mockAuthState(null, null)
    startTokenKeepAlive()

    await vi.advanceTimersByTimeAsync(REFRESH_INTERVAL * 3)
    expect(refreshTokens).not.toHaveBeenCalled()
  })

  it('续期失败不中断后续轮次', async () => {
    mockAuthState('access-token', 'refresh-token')
    vi.mocked(refreshTokens).mockRejectedValueOnce(new Error('boom'))
    startTokenKeepAlive()

    await vi.advanceTimersByTimeAsync(REFRESH_INTERVAL)
    expect(refreshTokens).toHaveBeenCalledTimes(1)

    vi.mocked(refreshTokens).mockResolvedValueOnce('fresh-token')
    await vi.advanceTimersByTimeAsync(REFRESH_INTERVAL)
    expect(refreshTokens).toHaveBeenCalledTimes(2)
  })

  it('清理函数停止保活', async () => {
    mockAuthState('access-token', 'refresh-token')
    const stop = startTokenKeepAlive()
    stop()

    await vi.advanceTimersByTimeAsync(REFRESH_INTERVAL * 2)
    expect(refreshTokens).not.toHaveBeenCalled()
  })
})
