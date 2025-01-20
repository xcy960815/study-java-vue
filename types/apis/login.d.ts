declare interface LoginRequestVo {
  username: string
  password: string
  rememberMe: boolean
}

declare interface LoginResponseDto {
  address: string
  createTime: string
  id: number
  introduceSign: string
  loginName: string
  nickName: string
  token: string
}
