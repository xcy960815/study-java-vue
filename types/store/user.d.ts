declare namespace UserStore {
  type State = {
    id: number | null
    address: string
    createTime: string
    introduceSign: string
    loginName: string
    nickName: string
    avatar: string
  }
  type Getters = {}
  type Actions = {
    getUserInfo: () => Promise<void>
  }
}
