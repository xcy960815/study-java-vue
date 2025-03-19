import { defineStore } from 'pinia'
import { StoreNames } from '@enums'
import router from "@router"

export const systemInfoStore = defineStore<
  StoreNames.SYSTEM,
  BaseStore.State<SystemStore.State>,
  BaseStore.Getters<SystemStore.State, SystemStore.Getters>,
  BaseStore.Actions<SystemStore.State, SystemStore.Actions>
>(StoreNames.SYSTEM, {
  state: () => {
    return {
      openMenuFlag: true,
      historyList: [],
      keepLiveList: []
    }
  },
  getters: {
    getOpenMenuFlag(state) {
      return state.openMenuFlag
    },
    getKeepLiveList(state) {
      return state.keepLiveList
    },
    getHistoryList(state) {
      return state.historyList
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
    /**
     * 添加缓存列表
     * @param {RouteLocationNormalizedLoadedGeneric} keepLiveItem 
     */
    addKeepLiveItem(keepLiveItem) {
      if (
        !!keepLiveItem.meta.keepAlive &&
        !this.keepLiveList.includes(
          keepLiveItem.name as string
        )
      ) {
        this.keepLiveList.push(
          keepLiveItem.name as string
        )
      }
    },
    setHistoryList(list) {
      this.historyList = list
    },
    /**
     * 添加历史记录
     * @param {RouteLocationNormalizedLoadedGeneric} historyItem 
     */
    addHistoryItem(historyItem) {
      // 登录页面不需要记录
      if (historyItem.path === "/login") return
      const currenHistoryItem = this.historyList.find(
        (item) => item.fullPath === historyItem.fullPath
      )
      // console.log("this.historyList", JSON.parse(JSON.stringify(this.historyList)));
      // if(historyItem.openMore) return
      if (!!currenHistoryItem) {
        const currenHistoryIndex = this.historyList.findIndex(
          (item) => item.fullPath === currenHistoryItem.fullPath
        )
        this.historyList.splice(currenHistoryIndex, 1, historyItem)
      } else {
        this.historyList.push(historyItem)
      }

    },
    /**
     * 移除历史记录
     * @param {RouteLocationNormalizedLoadedGeneric} historyItem 
     */
    removeHistoryItem(historyItem) {
      const historyIndex = this.historyList.findIndex(
        (item) => item.fullPath === historyItem.fullPath
      )
      if (historyIndex !== -1) {
        this.historyList.splice(historyIndex, 1)
      }
      const nextHistoryItem = this.historyList[historyIndex]
      const preHistoryItem = this.historyList[historyIndex - 1]
      // const router = useRouter()
      if (!!nextHistoryItem) {
        router.push(nextHistoryItem)
      } else if (!!preHistoryItem) {
        router.push(preHistoryItem)
      }
    }
  },
  persist: true
})
