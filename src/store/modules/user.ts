import { defineStore } from 'pinia'
import { StoreNames } from '@enums'
import { userModule } from '@apis'

export const userInfoStore = defineStore<
  StoreNames.USER,
  BaseStore.State<UserStore.State>,
  BaseStore.Getters<UserStore.State, UserStore.Getters>,
  BaseStore.Actions<UserStore.State, UserStore.Actions>
>(StoreNames.USER, {
  state: () => {
    return {
      address: '',
      id: null,
      createTime: '',
      introduceSign: '',
      loginName: '',
      nickName: '',
      avatar: '',
      permissions: [],
    }
  },
  getters: {
    getId: (state) => state.id,
    getAddress: (state) => state.address,
    getCreateTime: (state) => state.createTime,
    getIntroduceSign: (state) => state.introduceSign,
    getLoginName: (state) => state.loginName,
    getNickName: (state) => state.nickName,
    getAvatar: (state) => state.avatar,
    getPermissions: (state) => state.permissions,
  },
  actions: {
    /**
     * 获取用户信息
     */
    async getUserInfo() {
      const result = await userModule.getUserInfo()
      this.address = result.address
      this.createTime = result.createTime
      this.id = result.id
      this.introduceSign = result.introduceSign
      this.loginName = result.loginName
      this.nickName = result.nickName
      this.avatar = result.avatar
      this.permissions = result.permissions || []
    },
    setId(value: number | null) {
      this.id = value
    },
    setAddress(value: string) {
      this.address = value
    },
    setCreateTime(value: string) {
      this.createTime = value
    },
    setIntroduceSign(value: string) {
      this.introduceSign = value
    },
    setLoginName(value: string) {
      this.loginName = value
    },
    setNickName(value: string) {
      this.nickName = value
    },
    setAvatar(value: string) {
      this.avatar = value
    },
    setPermissions(value: string[]) {
      this.permissions = value
    },
  },
  // persist: true
})
