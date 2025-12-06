import { defineStore } from 'pinia'
import { StoreNames } from '@enums'
import { ElMessage } from 'element-plus'
import { eventEmitter } from '@/utils/event-emits'
import { loginModule } from '@apis'
import { setToken, removeToken, setRefreshToken } from '@utils/token'

export const loginStore = defineStore<
  StoreNames.LOGIN,
  BaseStore.State<LoginStore.State>,
  BaseStore.Getters<LoginStore.State, LoginStore.Getters>,
  BaseStore.Actions<LoginStore.State, LoginStore.Actions>
>(StoreNames.LOGIN, {
  state: () => {
    return {}
  },
  getters: {},
  actions: {
    async login(loginData: LoginRequestDto) {
      const response = await loginModule.login<LoginResponseVo>(loginData)
      ElMessage({
        message: '登入成功',
        type: 'success',
      })
      const { token, refreshToken } = response
      await setToken(token)
      await setRefreshToken(refreshToken)
      eventEmitter.emit('login')
    },
    /**
     * 退出登录
     */
    async logout() {
      await loginModule.logout()
      ElMessage({
        message: '退出成功',
        type: 'success',
      })
      await removeToken()
      eventEmitter.emit('logout')
    },
  },
  // persist: true
})
