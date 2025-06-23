import type { RouteRecordRaw } from 'vue-router'
import { defineAsyncComponent, type Component } from 'vue'
// import Layout from '@components/layout/index.vue'
// 自动导入 views 下所有 vue 组件
const modules = import.meta.glob('@/views/**/*.vue') as Record<
  string,
  () => Promise<{ default: Component }>
>

/**
 * 获取组件
 * @param path {string} 路径
 * @returns {any} 组件
 */
const getComponent = (path: string) => {
  const component = modules[`/src/${path}`]
  if (path.includes('layout')) {
    return defineAsyncComponent(() => import('@components/layout/index.vue'))
  } else if (component) {
    return defineAsyncComponent(component)
  } else {
    throw new Error(`组件 ${path} 不存在`)
  }
}

/**
 * 首字母大写
 * @param str {string} 字符串
 * @returns {string} 首字母大写后的字符串
 */
function capitalize(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * 构建路由名称
 * @param route {StudyJavaSysMenuVo} 路由
 * @returns {string} 路由名称
 */
const buildName = (route: StudyJavaSysMenuVo) => {
  const path = route.path
  const pathList = path.split('/')
  const name = pathList.reduce((pre,item) => {
    return pre + capitalize(item)
  }, '')
  return name
}
/**
 * 构建路由
 * @param voRoutes {StudyJavaSysMenuVo[]} 路由列表
 * @returns {RouteRecordRaw[]} 路由列表
 */
export const buildRoute = (voRoutes: StudyJavaSysMenuVo[]): RouteRecordRaw[] => {
  return voRoutes.map((voRoute) => {
    const hasChildren = Array.isArray(voRoute.children) && voRoute.children.length > 0
    const route = {
      path: voRoute.path,
      name: buildName(voRoute),
      component: getComponent(voRoute.component),
      redirect: '',
      meta: {
        title: voRoute.menuName,
        icon: voRoute.icon,
      },
    } as RouteRecordRaw
    if (hasChildren) {
      route.children = buildRoute(voRoute.children!)
    }
    return route
  })
}
