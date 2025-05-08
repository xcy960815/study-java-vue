<template>
  <el-aside id="sidebarContainer" class="layout-side-container">
    <h4 class="layout-side-title">{{ viteAppTitle }}</h4>
    <div class="layout-side-view">
      <!-- text-color="#fff" -->
      <!-- active-text-color="#fff" -->
      <el-menu class="layout-menu-view" :collapse="isCollapse" :default-active="currentRoute">
        <menu-item :menu-data="menuData"></menu-item>
      </el-menu>
      <div id="drap-meuline" class="drap-meuline"></div>
    </div>
  </el-aside>
</template>
<script lang="ts" setup>
import { setStyleProperty, CSS_VARIABLES } from '@/utils/system-style'
import { useSystemInfoStore } from '@store'
import MenuItem from './menu-item.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router'
const viteAppTitle = import.meta.env.VITE_APP_TITLE
const route = useRoute()
const router = useRouter()

const currentRoute = computed(() => {
  if (!!route.meta.hightlight) return route.meta.hightlight
  return route.fullPath
})

const systemInfoStore = useSystemInfoStore()

const isCollapse = computed(() => {
  const openMenuFlag = !systemInfoStore.getOpenMenuFlag
  return openMenuFlag
})

const menuData = computed(() => {
  const routes = router.options.routes
  function filterRoutes(data: ReadonlyArray<RouteRecordRaw>) {
    return data
      .map((node) => {
        const newNode = { ...node }
        if (newNode.children && newNode.children.length > 0) {
          newNode.children = filterRoutes(newNode.children)
        }
        return newNode
      })
      .filter((node) => node.meta && node.meta?.title && !node.meta?.hidden)
  }
  return filterRoutes(routes)
})

/**
 * 初始化左侧菜单宽度
 */
const initLayoutSideContainerWidth = () => {
  const history_width = localStorage.getItem(CSS_VARIABLES.LAYOUT_SIDE_CONTAINER_WIDTH) || '300px'
  if (!isCollapse.value) {
    setStyleProperty(CSS_VARIABLES.LAYOUT_SIDE_CONTAINER_WIDTH, history_width)
  } else {
    setStyleProperty(CSS_VARIABLES.LAYOUT_SIDE_CONTAINER_WIDTH, '64px')
  }
}
const initDrap = () => {
  // 获取dom，对左菜单进行拖拽
  const drapLine = document.getElementById('drap-meuline')!
  const sidebarContainer = document.getElementById('sidebarContainer')!
  drapLine.onmousedown = (e) => {
    e.preventDefault() // 阻止默认事件
    // 设置最大/最小宽度
    const max_width = 600
    const min_width = 54
    let mouse_x = 0 // 记录鼠标相对left盒子x轴位置
    const _e = e || window.event
    mouse_x = _e.clientX - sidebarContainer.offsetWidth
    document.onmousemove = (e_) => {
      const _e_ = e_ || window.event
      let left_width = _e_.clientX - mouse_x
      left_width = left_width < min_width ? min_width : left_width
      left_width = left_width > max_width ? max_width : left_width
      if (!isCollapse.value) {
        setStyleProperty(CSS_VARIABLES.LAYOUT_SIDE_CONTAINER_WIDTH, left_width + 'px')
      }
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      if (sidebarContainer.offsetWidth <= 64) {
        setStyleProperty(CSS_VARIABLES.LAYOUT_SIDE_CONTAINER_WIDTH, '64px')
        systemInfoStore.setOpenMenuFlag(false)
      } else {
        localStorage.setItem(
          CSS_VARIABLES.LAYOUT_SIDE_CONTAINER_WIDTH,
          sidebarContainer.offsetWidth + 'px'
        )
      }
    }
  }
}
onMounted(() => {
  initLayoutSideContainerWidth()
  initDrap()
})
</script>
<style lang="less" scoped>
.layout-side-container {
  transition: width 0.3s;
  width: var(--layout-side-container-width);
  height: 100%;
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);

  .layout-side-title {
    height: 50px;
    font-weight: 600;
    font-size: 16px;
    font-family:
      Avenir,
      Helvetica Neue,
      Arial,
      Helvetica,
      sans-serif;
    text-align: center;
    line-height: 50px;
    color: var(--el-text-color-primary);
    background-color: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .layout-side-view {
    display: flex;
    height: calc(100% - 50px);
    background-color: var(--el-bg-color);
    transition: width 0.3s;
    position: relative;
    width: 100%;

    .drap-meuline {
      width: 4px;
      height: 100%;
      background-color: var(--el-border-color-lighter);
      cursor: e-resize;
      position: absolute;
      right: 0;
      z-index: 99;
      transition: all 0.3s ease;
      opacity: 0.6;

      &:hover {
        background-color: var(--el-color-primary);
        opacity: 1;
        width: 6px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
      }
    }

    .el-menu--horizontal {
      --el-menu-horizontal-height: 100px;
    }

    .layout-menu-view {
      background-color: var(--el-bg-color);
      width: 100%;
      border: 0 !important;

      :deep(.el-menu) {
        border-right: none;
      }

      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        &:hover {
          background-color: var(--el-color-primary-light-9);
        }

        &.is-active {
          background-color: var(--el-color-primary-light-8);
          color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>
