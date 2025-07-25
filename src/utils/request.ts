import axios, { type AxiosError } from 'axios'
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
 */
request.interceptors.response.use(
  async (response) => {
    const responseData = response.data
    if (responseData.code === loginEnum.InvalidToken) {
      await removeToken()
      eventEmitter.emit('token-invalid')
      if (status !== loginEnum.InvalidToken) {
        // 同一种类型错误只提示一次
        ElMessage({
          type: 'error',
          message: responseData.message,
        })
      }
      status = loginEnum.InvalidToken
      return Promise.reject(responseData)
    } else if (responseData.code == loginEnum.ERROR) {
      ElMessage({
        type: 'error',
        message: responseData.message,
      })
      return Promise.reject(responseData)
    } else if (responseData.code == loginEnum.SUCCESS) {
      return Promise.resolve(responseData)
    }
  },
  (error) => {
    const { message } = error
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export { request }
