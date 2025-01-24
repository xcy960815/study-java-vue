import { defineStore } from 'pinia'
import { Names } from './store-name'

export const systemInfoStore = defineStore<
  Names.SYSTEM,
  BaseStore.State<SystemStore.State>,
  BaseStore.Getters<SystemStore.State, SystemStore.Getters>,
  BaseStore.Actions<SystemStore.State, SystemStore.Actions>
>(Names.SYSTEM, {
  state: () => {
    return {
      openMenuFlag: true
    }
  },
  getters: {
    getOpenMenuFlag(state) {
      return state.openMenuFlag
    }
  },
  actions: {
    reversalOpenMenuFlag() {
      this.openMenuFlag = !this.openMenuFlag
    },
    setOpenMenuFlag(flag) {
      this.openMenuFlag = flag
    }
  },
  persist: true
})
