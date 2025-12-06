import { createRouter, createWebHashHistory } from 'vue-router'
import { baseRoutes, redirectRoutes } from '@router/routes'
import { getToken } from '@/utils/token'
import { changeTabIcon } from '@/utils/system-style'
import { eventEmitter, BASE_REDIRECT_PATH, LOGIN_PATH, WHITELIST_PATHS } from '@/utils/event-emits'
import { getRoutes } from '@apis/system/menu'
import { useSystemInfoStore } from '@store'
import { buildRoute } from '@/utils/build-route'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHashHistory(), // hash 模式
  // history: createWebHistory(),  // history 模式
  routes: baseRoutes,
})

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
  router.replace({
    path: redirect || BASE_REDIRECT_PATH,
  })
})

/**
 * 退出登录
 */
eventEmitter.on('logout', () => {
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
 * 获取路由
 */
eventEmitter.on('get-routes', () => {
  return new Promise<void>(async (resolve) => {
    const systemInfoStore = useSystemInfoStore()
    const hasAddedRoutes = systemInfoStore.getHasAddedRoutes
    if (!hasAddedRoutes) {
      const routesRes = await getRoutes<StudyJavaSysMenuVo[]>()
      if (routesRes) {
        const routes = routesRes
        const routeList = buildRoute(routes)
        const allRoutes = [...routeList, ...redirectRoutes]
        allRoutes.forEach((route) => {
          router.addRoute(route)
        })
        systemInfoStore.setHasAddedRoutes(true)
      }
    }
    resolve()
  })
})

router.beforeEach(async (to) => {
  NProgress.start()
  changeTabIcon(to)
  if (WHITELIST_PATHS.includes(to.path)) return true
  const token = await getToken()
  if (!token) return LOGIN_PATH
  const systemInfoStore = useSystemInfoStore()
  if (!systemInfoStore.getHasAddedRoutes) {
    await eventEmitter.emitAsync('get-routes')
    // await systemInfoStore.setRoutes()
    // 关键：动态路由注册后，重新进入当前路由
    return to.fullPath
  }
  NProgress.done()
  return true
})
router.afterEach(() => {
  NProgress.done()
})
export default router
