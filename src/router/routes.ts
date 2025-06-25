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
  // {
  //   path: '/goods-category',
  //   name: 'goods-category',
  //   component: () => import(`../components/layout/index.vue`),
  //   meta: {
  //     title: '商品',
  //     icon: 'Commodity',
  //   },
  //   children: [
  //     {
  //       path: '/goods-category/list',
  //       name: 'goods-category-list',
  //       component: () => import(`../views/goods-category/list.vue`),
  //       meta: {
  //         title: '商品列表',
  //         keepAlive: true,
  //         icon: 'ListView',
  //       },
  //     },
  //     {
  //       path: '/goods-category/info',
  //       name: 'info',
  //       component: () => import(`../views/goods-category/info.vue`),
  //       meta: {
  //         hidden: true,
  //         hightlight: '/goods-category/list',
  //         title: '商品详情',
  //         icon: 'DocDetail',
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: '/ollama',
  //   name: 'ollama',
  //   component: () => import(`../components/layout/index.vue`),
  //   meta: {
  //     title: 'ollama',
  //     icon: 'Brain',
  //   },
  //   children: [
  //     {
  //       path: '/ollama/models',
  //       name: 'ollama-models',
  //       component: () => import(`../views/ollama/models/index.vue`),
  //       meta: {
  //         title: '模型列表',
  //         icon: 'ListView',
  //       },
  //     },
  //     {
  //       name: 'ollama-chat',
  //       path: '/ollama/chat',
  //       component: () => import(`../views/ollama/chat/index.vue`),
  //       meta: {
  //         hightlight: '/ollama/models',
  //         openMore: true,
  //         keepAlive: true,
  //         hidden: true,
  //         title: '会话',
  //         icon: 'Intercom',
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: '/upload',
  //   name: 'upload',
  //   component: () => import(`../components/layout/index.vue`),
  //   meta: {
  //     title: '文件上传',
  //     icon: 'InboxUploadR',
  //   },
  //   children: [
  //     {
  //       path: '/upload/file',
  //       name: 'upload-file',
  //       component: () => import(`../views/file-upload/file-upload.vue`),
  //       meta: {
  //         title: '文件上传',
  //         icon: 'Upload',
  //       },
  //     },
  //     {
  //       path: '/upload/large-file',
  //       name: 'upload-large-file',
  //       component: () => import(`../views/file-upload/large-file-upload.vue`),
  //       meta: {
  //         title: '大文件切片上传',
  //         icon: 'UploadThree',
  //       },
  //     },
  //   ],
  // },
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
