// import { type RouteLocationNormalizedLoadedGeneric } from "vue-router"

declare namespace SystemStore {
  type RouteLocationNormalizedLoadedGeneric = import('vue-router').RouteLocationNormalizedLoadedGeneric
  type State = {
    openMenuFlag: boolean
    historyList: Array<RouteLocationNormalizedLoadedGeneric>
    keepLiveList: Array<string>
  }
  /**
   * getter
   */
  type Getters = {}
  /**
   * action
   */
  type Actions = {
    reversalOpenMenuFlag: () => void
    addKeepLiveItem: (
      keepLiveItem: RouteLocationNormalizedLoadedGeneric
    ) => void
    addHistoryItem: (
      historyItem: RouteLocationNormalizedLoadedGeneric
    ) => void
    removeHistoryItem: (
      historyItem: RouteLocationNormalizedLoadedGeneric
    ) => void
  }
}
