const TOKENNAME = 'BearToken'
const REFRESH_TOKEN_NAME = 'RefreshToken'

const hasCookieStore = () => 'cookieStore' in window

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL
/**
 * 获取请求头的token
 * @returns {Promise<string>}
 */
export const getToken = async () => {
  if (hasCookieStore()) {
    try {
      const tokenOption = await cookieStore.get(TOKENNAME)
      if (tokenOption?.value) {
        return tokenOption.value
      }
    } catch (error) {
      console.warn('Failed to get token from cookieStore:', error)
    }
  }
  return localStorage.getItem(TOKENNAME)
}

/**
 * 设置请求头的token
 * @param token {String}
 * @returns {Promise<void>}
 */
export const setToken = async (token: string) => {
  if (hasCookieStore()) {
    try {
      return await cookieStore.set({
        name: TOKENNAME,
        value: token,
        // path: VITE_BASE_URL
      })
    } catch (error) {
      console.warn('Failed to set token to cookieStore:', error)
    }
  }
  return localStorage.setItem(TOKENNAME, token)
}

/**
 * 删除请求头的token
 * @returns {Promise<void>}
 */
export const removeToken = async () => {
  if (hasCookieStore()) {
    try {
      await cookieStore.delete({
        name: TOKENNAME,
        // path: VITE_BASE_URL
      })
      await cookieStore.delete({
        name: REFRESH_TOKEN_NAME,
      })
    } catch (error) {
      console.warn('Failed to remove token from cookieStore:', error)
    }
  }
  localStorage.removeItem(TOKENNAME)
  return localStorage.removeItem(REFRESH_TOKEN_NAME)
}

/**
 * 获取刷新token
 * @returns {Promise<string>}
 */
export const getRefreshToken = async () => {
  if (hasCookieStore()) {
    try {
      const tokenOption = await cookieStore.get(REFRESH_TOKEN_NAME)
      if (tokenOption?.value) {
        return tokenOption.value
      }
    } catch (error) {
      console.warn('Failed to get refresh token from cookieStore:', error)
    }
  }
  return localStorage.getItem(REFRESH_TOKEN_NAME)
}

/**
 * 设置刷新token
 * @param token {String}
 * @returns {Promise<void>}
 */
export const setRefreshToken = async (token: string) => {
  if (hasCookieStore()) {
    try {
      return await cookieStore.set({
        name: REFRESH_TOKEN_NAME,
        value: token,
        // path: VITE_BASE_URL
      })
    } catch (error) {
      console.warn('Failed to set refresh token to cookieStore:', error)
    }
  }
  return localStorage.setItem(REFRESH_TOKEN_NAME, token)
}

/**
 * 删除刷新token
 * @returns {Promise<void>}
 */
export const removeRefreshToken = async () => {
  if (hasCookieStore()) {
    try {
      await cookieStore.delete({
        name: REFRESH_TOKEN_NAME,
        // path: VITE_BASE_URL
      })
    } catch (error) {
      console.warn('Failed to remove refresh token from cookieStore:', error)
    }
  }
  return localStorage.removeItem(REFRESH_TOKEN_NAME)
}
