import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from '@router/routes'
import { getToken } from '@/utils/token'
import { changeTabIcon } from '@/utils/system-style'
import { eventEmitter, BASE_REDIRECT_PATH, LOGIN_PATH, WHITELIST_PATHS } from '@/utils/event-emits'
import { getRoutes } from '@apis/system/menu'
import { useSystemInfoStore } from '@store'
import { buildRoute } from '@/utils/build-route'

const router = createRouter({
  history: createWebHashHistory(), // hash 模式
  // history: createWebHistory(),  // history 模式
  routes,
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
      if (routesRes.code === 200) {
        const routes = routesRes.data
        const routeList = buildRoute(routes)
        routeList.forEach((route) => {
          router.addRoute(route)
        })
        console.log('get-routes', router.getRoutes())
        systemInfoStore.setHasAddedRoutes(true)
      }
    }
    setTimeout(() => {
      resolve()
    }, 3000)
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
    } else {
      // const result = await eventEmitter.emit('get-routes')
      const systemInfoStore = useSystemInfoStore()
      const hasAddedRoutes = systemInfoStore.getHasAddedRoutes
      if (!hasAddedRoutes) {
        const routesRes = await getRoutes<StudyJavaSysMenuVo[]>()
        if (routesRes.code === 200) {
          const routes = routesRes.data
          const routeList = buildRoute(routes)
          routeList.forEach((route) => {
            router.addRoute(route)
          })
          console.log('get-routes', router.getRoutes())
          systemInfoStore.setHasAddedRoutes(true)
        }
      }
      next()
    }
  }
})

export default router
