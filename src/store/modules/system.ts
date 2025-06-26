import { defineStore } from 'pinia'
import { StoreNames } from '@enums'
import router from '@router'
// import { getRoutes as getRoutesApi } from '@apis/system/menu'
// import { buildRoute } from '@/utils/build-route'
// import { redirectRoutes } from '@router/routes'
/**
 * 系统信息
 */
export const systemInfoStore = defineStore<
  StoreNames.SYSTEM,
  BaseStore.State<SystemStore.State>,
  BaseStore.Getters<SystemStore.State, SystemStore.Getters>,
  BaseStore.Actions<SystemStore.State, SystemStore.Actions>
>(StoreNames.SYSTEM, {
  state: () => {
    return {
      hasAddedRoutes: false,
      routes: [],
      openMenuFlag: true,
      historyList: [],
      keepLiveList: [],
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
    },
    getHasAddedRoutes(state) {
      return state.hasAddedRoutes
    },
    getRoutes(state) {
      return state.routes
    },
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
        !this.keepLiveList.includes(keepLiveItem.name as string)
      ) {
        this.keepLiveList.push(keepLiveItem.name as string)
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
      if (historyItem.path === '/login') return
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
    },
    setHasAddedRoutes(flag) {
      this.hasAddedRoutes = flag
    },
    setRoutes(routes) {
      // return new Promise<void>(async (resolve) => {
      //   if (!this.hasAddedRoutes) {
      //     const routesRes = await getRoutesApi<StudyJavaSysMenuVo[]>()
      //     if (routesRes.code === 200) {
      //       const routes = routesRes.data
      //       const routeList = buildRoute(routes)
      //       const allRoutes = [...routeList, ...redirectRoutes]
      //       allRoutes.forEach((route) => {
      //         router.addRoute(route)
      //       })
      //       this.routes = routes
      //       this.setHasAddedRoutes(true)
      //     }
      //   }
      //   resolve()
      // })
      this.routes = routes
    },
  },
  // persist: true,
})
