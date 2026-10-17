import axios from 'axios'
import { getRefreshToken, getToken } from './token'
import { refreshTokens } from './request'

/** 主动续期间隔：12 小时（定义为 access token 有效期 24 小时的一半） */
const KEEP_ALIVE_INTERVAL_MS = 12 * 60 * 60 * 1000

/**
 * Token 保活定时器：页面长期挂机（无任何点击）时也按节奏续期 access token。
 * 后端每次续期都会轮换 refresh token 并重置 7 天有效期，因此
 * 「页面常驻打开」期间不会再出现超时后强制踢回登录页。
 *
 * 失败不额外处理：request 层会按性质分流（网络抖动保留登录态等待下一轮；
 * 真正失效清理登录态并广播 token-invalid 由路由守卫接管）。
 *
 * @returns 停止保活的清理函数
 */
export const startTokenKeepAlive = () => {
  const keepAlive = async () => {
    const [token, refreshToken] = await Promise.all([getToken(), getRefreshToken()])
    // 未登录时不做续期动作
    if (!token && !refreshToken) return
    try {
      await refreshTokens()
    } catch (error) {
      console.warn('Token 保活续期失败，等待下一轮或 401 兜底:', error)
    }
  }
  const timer = setInterval(keepAlive, KEEP_ALIVE_INTERVAL_MS)
  return () => clearInterval(timer)
}
