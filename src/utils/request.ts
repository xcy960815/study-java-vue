import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { eventEmitter } from './event-emits'
import { getToken, removeToken, getRefreshToken, setToken, setRefreshToken } from './token'
import { loginEnum } from '@/enums'

// 直接使用相对路径，依赖 nginx 代理
const baseUrl = import.meta.env.VITE_API_DOMAIN_PREFIX

const withoutAuthorizationUrls = ['/login']

let status = 0
let isRefreshing = false
let requests: Function[] = []

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

axios.defaults.withCredentials = false
const request = axios.create({
  baseURL: baseUrl,
  timeout: 60 * 1000 * 10,
})

request.interceptors.request.use(
  async (config) => {
    const token = await getToken()
    const isWithoutAuthorizationUrl = !withoutAuthorizationUrls.some((url) =>
      config.url?.includes(url)
    )
    if (isWithoutAuthorizationUrl) {
      // 添加请求头
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    const { message } = error
    ElMessage.error(message)
  }
)
/**
 * 响应拦截器
 * 直接返回 response，调用方需要访问 response.data 获取业务数据
 */
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回 response.data
    return response.data
  },
  async (error: AxiosError) => {
    // 处理 HTTP 错误状态码
    if (error.response) {
      const statusCode = error.response.status
      const errorData = error.response.data as { message?: string } | undefined

      // 401: Token 无效
      if (statusCode === loginEnum.InvalidToken) {
        const originalRequest = error.config as RetryRequestConfig

        // 排除 /refreshToken 接口本身的错误，防止死循环
        if (originalRequest.url?.includes('/refreshToken')) {
          await removeToken()
          eventEmitter.emit('token-invalid')
          return Promise.reject(error)
        }

        if (!originalRequest._retry) {
          if (isRefreshing) {
            // 如果正在刷新，将当前请求加入队列，等待刷新完成后执行
            return new Promise((resolve) => {
              requests.push((token: string) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`
                resolve(request(originalRequest))
              })
            })
          }

          originalRequest._retry = true
          isRefreshing = true

          try {
            // 调用刷新 Token 接口
            const refreshToken = await getRefreshToken()

            // 使用 axios 直接请求，避免走拦截器
            const { data } = await axios.post(baseUrl + '/refreshToken', { refreshToken })

            if (data && data.token) {
              // 1. 更新本地存储
              await setToken(data.token)
              await setRefreshToken(data.refreshToken)

              // 2. 执行队列中的请求
              requests.forEach((cb) => cb(data.token))
              requests = []

              // 3. 重试当前请求
              originalRequest.headers['Authorization'] = `Bearer ${data.token}`
              return request(originalRequest)
            }
          } catch (refreshError) {
            // 刷新失败
            await removeToken()
            eventEmitter.emit('token-invalid')
            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
          }
        }
      }
      // 400/500 等其他错误
      else {
        ElMessage({
          type: 'error',
          message: errorData?.message || error.message || '请求失败',
        })
      }
    } else {
      // 网络错误或其他错误
      ElMessage.error(error.message || '网络错误')
    }

    return Promise.reject(error)
  }
)

export { request }
