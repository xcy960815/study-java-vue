// import { type RouteLocationNormalizedLoadedGeneric } from "vue-router"

declare namespace LoginStore {
  // type RouteLocationNormalizedLoadedGeneric = import('vue-router').RouteLocationNormalizedLoadedGeneric
  type State = {}
  /**
   * getter
   */
  type Getters = {}
  /**
   * action
   */
  type Actions = {
    login: (loginData: LoginRequestDto) => Promise<void>
    logout: () => Promise<void>
  }
}
