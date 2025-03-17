const TOKENNAME = 'BearToken'

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
      path: VITE_BASE_URL
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
    return await cookieStore.delete({
      name: TOKENNAME,
      path: VITE_BASE_URL
    })
  } else {
    return localStorage.removeItem(TOKENNAME)
  }
}

