import { defineStore } from 'pinia'
import { Names } from './store-name'
import { ElMessage } from 'element-plus'
import { eventEmitter } from '@/utils/event-emits'
import { loginModule } from '@apis'
import { setToken, removeToken } from '@utils/token'
import { userModule } from '@apis'

export const userInfoStore = defineStore(Names.User, {
  state: () => {
    return {
      address: '',
      userId: 0,
      createTime: '',
      introduceSign: '',
      loginName: '',
      nickName: '',
      avatar: ''
    }
  },
  getters: {},
  actions: {
    async login(loginData: loginModule.LoginRequestParams) {
      const result = await loginModule.login(loginData)
      if (result.code === 200) {
        ElMessage({
          message: '登入成功',
          type: 'success'
        })
        const { token } = result.data
        await setToken(token)
        eventEmitter.emit('login-success')
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
          type: 'success'
        })
        await removeToken()
        eventEmitter.emit('login-out')
      }
    },
    /**
     * 获取用户信息
     */
    async getUserInfo() {
      const result = await userModule.getUserInfo()
      // console.log(result);
      if (result.code === 200) {
        this.address = result.data.address
        this.createTime = result.data.createTime
        this.userId = result.data.userId || 0
        this.introduceSign = result.data.introduceSign
        this.loginName = result.data.loginName
        this.nickName = result.data.nickName
        this.avatar = result.data.avatar
      }
    }
  }
  // persist: true
})
