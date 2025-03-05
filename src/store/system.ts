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
      openMenuFlag: true,
      keepLiveList: []
    }
  },
  getters: {
    getOpenMenuFlag(state) {
      return state.openMenuFlag
    },
    getKeepLiveList(state) {
      return state.keepLiveList
    }
  },
  actions: {
    reversalOpenMenuFlag() {
      this.openMenuFlag = !this.openMenuFlag
    },
    setOpenMenuFlag(flag) {
      this.openMenuFlag = flag
    },
    setKeepLiveList(list) {
      this.keepLiveList = list
    },
    addKeepLiveList(addKeepLiveItem) {
      if (
        !!addKeepLiveItem.meta.keepAlive &&
        !this.keepLiveList.includes(
          addKeepLiveItem.name as string
        )
      ) {
        this.keepLiveList.push(
          addKeepLiveItem.name as string
        )
      }
      console.log(
        'addKeepLiveItem.name',
        addKeepLiveItem.name
      )
      console.log('this.keepLiveList', this.keepLiveList)
    }
  },
  persist: true
})
