import { createRouter, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { eventEmitter } from '@/utils/event-emits'
import { getToken } from '@utils/token'
import { changeTabIco } from '@/utils/system-style'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/login',
    meta: {
      hidden: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(`../views/login/index.vue`),
    meta: {
      title: '登录',
      hidden: true,
      icon: 'Login'
    }
  },
  {
    path: '/password',
    name: 'password',
    component: () => import(`../components/layout/index.vue`),
    meta: {
      title: '密码',
      hidden: true,
      icon: 'password'
    },
    props: {
      content: defineAsyncComponent(() => import(`../views/password/index.vue`)) // 这么做的原因是既想保住layout布局 又想跟 login 页面一样 保持一层路由
    }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import(`../components/layout/index.vue`),
    meta: {
      title: '用户',
      icon: 'User'
    },
    children: [
      {
        path: '/user/list',
        name: 'userList',
        component: () => import(`../views/user/list.vue`),
        meta: {
          // icon: 'ListView',
          icon: 'other',
          keepAlive: true,
          title: '用户列表'
        }
      },
      {
        path: '/user/info',
        name: 'userInfo',
        component: () => import(`../views/user/info.vue`),
        meta: {
          hightlight:"/user/list",
          hidden: true,
          title: '用户中心'
        }
      }
    ]
  },
  {
    path: '/goods-category',
    name: 'goods-category',
    component: () => import(`../components/layout/index.vue`),
    meta: {
      title: '商品',
      icon: 'Commodity'
    },
    children: [
      {
        path: '/goods-category/list',
        name: 'goods-category-list',
        component: () => import(`../views/goods-category/list.vue`),
        meta: {
          title: '商品列表',
          keepAlive: true,
          icon: 'ListView'
        }
      },
      {
        path: '/goods-category/info',
        name: 'info',
        component: () => import(`../views/goods-category/info.vue`),
        meta: {
          hidden: true,
          hightlight:"/goods-category/list",
          title: '商品详情',
          icon: 'DocDetail'
        }
      }
    ]
  },
  {
    path: '/deepseek',
    name: 'deepseek',
    component: () => import(`../components/layout/index.vue`),
    meta: {
      title: 'deepseek',
      icon: 'Brain'
    },
    children: [
      {
        path: '/deepseek/models',
        name: 'deepseek-models',
        component: () => import(`../views/deepseek/models/index.vue`),
        meta: {
          title: '模型列表',
          icon: 'ListView'
        }
      },
      {
        path: '/deepseek/chat',
        name: 'deepseek-chat',
        component: () => import(`../views/deepseek/chat/index.vue`),
        meta: {
          hightlight:"/deepseek/models",
          openMore: true,
          keepAlive: true,
          title: '聊天',
          hidden: true,
          icon: 'Intercom'
        }
      }
    ]
  },
  {
    path: '/ollama',
    name: 'ollama',
    component: () => import(`../components/layout/index.vue`),
    meta: {
      title: 'ollama',
      icon: 'Brain'
    },
    children: [
      {
        path: '/ollama/models',
        name: 'ollama-models',
        component: () => import(`../views/ollama/models/index.vue`),
        meta: {
          title: '模型列表',
          icon: 'ListView'
        }
      },
      {
        name: 'ollama-chat',
        path: '/ollama/chat',
        component: () => import(`../views/ollama/chat/index.vue`),
        meta: {
          hightlight:"/ollama/models",
          openMore: true,
          keepAlive: true,
          hidden: true,
          title: '会话',
          icon: 'Intercom'
        }
      }
    ]
  },
  {
    path: '/admin-user',
    name: 'admin-user',
    component: () => import(`../components/layout/index.vue`),
    meta: {
      title: '超级管理员',
      icon: 'DataUser'
    },
    children: [
      {
        path: '/admin-user/list',
        name: 'admin-user-list',
        component: () => import(`../views/admin-user/list.vue`),
        meta: {
          title: '超级管理员列表',
          icon: 'ListView'
        }
      }
    ]
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import(`../components/layout/index.vue`),
    meta: {
      title: '文件上传',
      icon: 'InboxUploadR'
    },
    children: [
      {
        path: '/upload/file',
        name: 'upload-file',
        component: () => import(`../views/file-upload/file-upload.vue`),
        meta: {
          title: '文件上传',
          icon: 'Upload'
        }
      },
      {
        path: '/upload/large-file',
        name: 'upload-large-file',
        component: () => import(`../views/file-upload/large-file-upload.vue`),
        meta: {
          title: '大文件切片上传',
          icon: 'UploadThree'
        }
      }
    ]
  },
  {
    path: '/*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(), // hash 模式
  // history: createWebHistory(),  // history 模式
  routes
})

/*************** 统一管理通用路由跳转 *****************/

/**
 * token过期
 */
eventEmitter.on('token-invalid', () => {
  const route = router.currentRoute.value
  const redirect = route.fullPath
  router.replace({
    path: '/login',
    query: {
      redirect
    }
  })
})
/**
 * 登录成功
 */
eventEmitter.on('login', () => {
  const redirect = router.currentRoute.value.query.redirect as string
  console.log('登录', redirect)
  router.replace({
    path: redirect || '/user/list'
  })
})

eventEmitter.on('logout', () => {
  const route = router.currentRoute.value
  const redirect = route.fullPath
  // TODO 重定向之后 不会携带路径的参数
  console.log('退出登录', router)

  router.replace({
    path: '/login',
    query: {
      redirect
    }
  })
})

/*************** 统一管理通用路由跳转 *****************/

// 全局路由守卫
router.beforeEach(async (to, _from, next) => {
  changeTabIco(to)
  const token = await getToken()
  if (to.path === '/login') {
    if (token) {
      next('/user/list')
    } else {
      next()
    }
  } else {
    if (!token) {
      next('/login')
    }
    next()
  }
})

router.afterEach((_to, _from) => {
  // console.log(to, from)
  // console.log('afterEach')
})

export default router
