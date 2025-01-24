declare namespace SystemStore {
  type State = {
    openMenuFlag: boolean
  }
  /**
   * @desc getter
   */
  type Getters = {}
  /**
   * @desc action
   */
  type Actions = {
    reversalOpenMenuFlag: () => void
  }
}
