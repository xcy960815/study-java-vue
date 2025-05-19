import { getToken } from '@utils/token'
import { changeTabIcon } from '@/utils/system-style'
import { eventEmitter, HOME_PATH, LOGIN_PATH, WHITELIST_PATHS } from '@/utils/event-emits'
import router from '@/router'

/**
 * token过期
 */
eventEmitter.on('token-invalid', () => {
  const route = router.currentRoute.value
  const redirect = route.fullPath
  router.replace({
    path: '/login',
    query: {
      redirect,
    },
  })
})

/**
 * 登录成功
 */
eventEmitter.on('login', () => {
  const redirect = router.currentRoute.value.query.redirect as string
  console.log('登录', redirect)
  router.replace({
    path: redirect || '/system/user/list',
  })
})

eventEmitter.on('logout', () => {
  const route = router.currentRoute.value
  const redirect = route.fullPath
  // TODO 重定向之后 不会携带路径的参数
  router.replace({
    path: '/login',
    query: {
      redirect,
    },
  })
})

/*************** 统一管理通用路由跳转 *****************/

// 全局路由守卫
router.beforeEach(async (to, _from, next) => {
  changeTabIcon(to)
  const isIgnorePath = WHITELIST_PATHS.includes(to.path)
  if (isIgnorePath) {
    next()
  } else {
    const token = await getToken()
    if (!token) {
      next(LOGIN_PATH)
    }
    next()
  }
})

router.afterEach((_to, _from) => {
  // console.log(to, from)
  // console.log('afterEach')
})
