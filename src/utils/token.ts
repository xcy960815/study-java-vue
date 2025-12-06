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
    const tokenOption = await cookieStore.get(TOKENNAME)
    return tokenOption?.value || ''
  } else {
    return localStorage.getItem(TOKENNAME)
  }
}

/**
 * 设置请求头的token
 * @param token {String}
 * @returns {Promise<void>}
 */
export const setToken = async (token: string) => {
  if (hasCookieStore()) {
    return await cookieStore.set({
      name: TOKENNAME,
      value: token,
      // path: VITE_BASE_URL
    })
  } else {
    return localStorage.setItem(TOKENNAME, token)
  }
}

/**
 * 删除请求头的token
 * @returns {Promise<void>}
 */
export const removeToken = async () => {
  if (hasCookieStore()) {
    await cookieStore.delete({
      name: TOKENNAME,
      // path: VITE_BASE_URL
    })
    return await cookieStore.delete({
      name: REFRESH_TOKEN_NAME,
    })
  } else {
    localStorage.removeItem(TOKENNAME)
    return localStorage.removeItem(REFRESH_TOKEN_NAME)
  }
}

/**
 * 获取刷新token
 * @returns {Promise<string>}
 */
export const getRefreshToken = async () => {
  if (hasCookieStore()) {
    const tokenOption = await cookieStore.get(REFRESH_TOKEN_NAME)
    return tokenOption?.value || ''
  } else {
    return localStorage.getItem(REFRESH_TOKEN_NAME)
  }
}

/**
 * 设置刷新token
 * @param token {String}
 * @returns {Promise<void>}
 */
export const setRefreshToken = async (token: string) => {
  if (hasCookieStore()) {
    return await cookieStore.set({
      name: REFRESH_TOKEN_NAME,
      value: token,
      // path: VITE_BASE_URL
    })
  } else {
    return localStorage.setItem(REFRESH_TOKEN_NAME, token)
  }
}

/**
 * 删除刷新token
 * @returns {Promise<void>}
 */
export const removeRefreshToken = async () => {
  if (hasCookieStore()) {
    return await cookieStore.delete({
      name: REFRESH_TOKEN_NAME,
      // path: VITE_BASE_URL
    })
  } else {
    return localStorage.removeItem(REFRESH_TOKEN_NAME)
  }
}
