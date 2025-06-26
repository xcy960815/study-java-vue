import { defineAsyncComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/login',
    meta: {
      hidden: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(`../views/login/index.vue`),
    meta: {
      title: '登录',
      hidden: true,
      icon: 'Login',
    },
  },
  {
    path: '/password',
    name: 'password',
    component: () => import(`../components/layout/index.vue`),
    meta: {
      title: '密码',
      hidden: true,
      icon: 'password',
    },
    props: {
      content: defineAsyncComponent(() => import(`../views/password/index.vue`)), // 这么做的原因是既想保住layout布局 又想跟 login 页面一样 保持一层路由
    },
  },
  {
    path: '/system',
    name: 'system',
    component: () => import(`../components/layout/index.vue`),
    meta: {
      title: '系统管理',
      icon: 'Setting',
    },
    children: [
      {
        path: '/system/menu',
        name: 'system-menu',
        component: () => import(`../views/system/menu/index.vue`),
        meta: {
          title: '菜单管理',
          icon: 'ApplicationMenu',
          keepAlive: true,
        },
      },
      {
        path: '/system/user',
        name: 'systemUser',
        component: () => import(`../views/system/user/index.vue`),
        meta: {
          icon: 'AddressBook',
          keepAlive: true,
          title: '用户列表',
        },
      },
      {
        // 角色管理
        path: '/system/role',
        name: 'systemRole',
        component: () => import(`../views/system/role/index.vue`),
        meta: {
          title: '角色列表',
          icon: 'Permissions',
        },
      },
      {
        path: '/system/data-dictionary',
        name: 'systemDataDictionary',
        component: () => import(`../views/system/data-dictionary/index.vue`),
        meta: {
          title: '数据字典',
          icon: 'Bookmark',
        },
      },
    ],
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import(`../views/error/404.vue`),
    meta: {
      title: '404',
      hidden: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]
