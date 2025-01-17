import { defineStore } from 'pinia'
import { Names } from './store-name'

export const systemInfoStore = defineStore(Names.SYSTEM, {
  state: () => {
    return {
      openMenu: true
    }
  },
  getters: {
    openMenuFlag(state) {
      return state.openMenu
    }
  },
  actions: {
    reversalOpenMenuFlag() {
      this.openMenu = !this.openMenu
    },
    setOpenMenuFlag(flag: boolean) {
      this.openMenu = flag
    }
  },
  persist: true
})
