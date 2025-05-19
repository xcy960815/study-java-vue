/**
 * 后端返回的admin用户信息
 */
declare interface AdminUserInfoVo {
  adminUserId: number
  locked: number
  loginPassword: string
  loginUserName: string
  nickName: string
}

/**
 * 前端请求的admin用户信息
 */
declare interface AdminUserInfoDto
  extends Partial<
    Omit<AdminUserInfoVo & baseListDto, 'createTime' | 'createUser' | 'updateTime' | 'updateUser'>
  > {}
