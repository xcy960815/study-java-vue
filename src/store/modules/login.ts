import { defineStore } from 'pinia'
import { StoreNames } from '@enums'
import { ElMessage } from 'element-plus'
import { eventEmitter } from '@/utils/event-emits'
import { loginModule } from '@apis'
import { setToken, removeToken } from '@utils/token'

export const loginStore = defineStore(StoreNames.LOGIN, {
  state: () => {
    return {}
  },
  getters: {},
  actions: {
    async login(loginData: LoginRequestDto) {
      const result = await loginModule.login(loginData)
      if (result.code === 200) {
        ElMessage({
          message: '登入成功',
          type: 'success',
        })
        const { token } = result.data
        await setToken(token)
        eventEmitter.emit('login')
      }
    },
    /**
     * 退出登录
     */
    async logout() {
      const result = await loginModule.logout()
      if (result.code === 200) {
        ElMessage({
          message: '退出成功',
          type: 'success',
        })
        await removeToken()
        eventEmitter.emit('logout')
      }
    },
  },
  // persist: true
})
