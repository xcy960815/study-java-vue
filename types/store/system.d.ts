// import { type RouteLocationNormalizedLoadedGeneric } from "vue-router"

declare namespace SystemStore {
  type State = {
    openMenuFlag: boolean
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
    addKeepLiveList: (
      addKeepLiveItem: import('vue-router').RouteLocationNormalizedLoadedGeneric
    ) => void
  }
}
