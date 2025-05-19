import { defineStore } from 'pinia'
import { StoreNames } from '@enums'
import { userModule } from '@apis'

export const userInfoStore = defineStore(StoreNames.USER, {
  state: () => {
    return {
      address: '',
      userId: 0,
      createTime: '',
      introduceSign: '',
      loginName: '',
      nickName: '',
      avatar: '',
    }
  },
  getters: {},
  actions: {
    /**
     * 获取用户信息
     */
    async getUserInfo() {
      const result = await userModule.getUserInfo()
      if (result.code === 200) {
        this.address = result.data.address
        this.createTime = result.data.createTime
        this.userId = result.data.userId || 0
        this.introduceSign = result.data.introduceSign
        this.loginName = result.data.loginName
        this.nickName = result.data.nickName
        this.avatar = result.data.avatar
      }
    },
  },
  // persist: true
})
