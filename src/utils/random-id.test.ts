import { afterEach, describe, expect, it, vi } from 'vitest'

import { randomId } from './random-id'

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('randomId', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('生成符合 RFC4122 v4 的唯一 ID', () => {
    const first = randomId()
    const second = randomId()
    expect(first).toMatch(UUID_V4)
    expect(second).toMatch(UUID_V4)
    expect(first).not.toBe(second)
  })

  it('非安全上下文（无 randomUUID）回退仍可用', () => {
    // 模拟内网 HTTP 环境：crypto 存在但 randomUUID 缺失
    vi.stubGlobal('crypto', {
      getRandomValues: (buf: Uint8Array) =>
        Uint8Array.from(buf, () => Math.floor(Math.random() * 256)),
    })
    const first = randomId()
    const second = randomId()
    expect(first).toMatch(UUID_V4)
    expect(second).toMatch(UUID_V4)
    expect(first).not.toBe(second)
  })

  it('完全缺失 crypto 时 Math.random 兜底', () => {
    vi.stubGlobal('crypto', undefined)
    expect(randomId()).toMatch(UUID_V4)
  })
})
