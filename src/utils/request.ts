import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { eventEmitter } from './event-emits'
import { getToken, removeToken } from './token'
import { loginEnum } from '@/enums'

// 直接使用相对路径，依赖 nginx 代理
const baseUrl = import.meta.env.VITE_API_DOMAIN_PREFIX

const withoutAuthorizationUrls = ['/login']

let status = 0

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
        await removeToken()
        eventEmitter.emit('token-invalid')
        if (status !== loginEnum.InvalidToken) {
          // 同一种类型错误只提示一次
          ElMessage({
            type: 'error',
            message: errorData?.message || '登录已过期，请重新登录',
          })
        }
        status = loginEnum.InvalidToken
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
