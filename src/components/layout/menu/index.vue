<template>
  <h4 class="layout-header-title">{{ viteAppTitle }}</h4>
  <el-menu
    :collapse="isCollapse"
    active-text-color="#fff"
    background-color="rgb(2, 93, 126)"
    router
    :default-active="defaultActive"
    text-color="#fff"
  >
    <menu-item :menu-data="menuData"></menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
// import { routes } from "@/router"
import { useSystemInfoStore } from '@store'
import MenuItem from './menu-item.vue'
import { computed, onMounted } from 'vue'
import {
  useRoute,
  useRouter,
  type RouteRecordRaw
} from 'vue-router'
const viteAppTitle = import.meta.env.VITE_APP_TITLE
const route = useRoute()
const router = useRouter()
const defaultActive = computed(() => route.path)
const systemInfoStore = useSystemInfoStore()
const isCollapse = computed(() => {
  return !systemInfoStore.openMenuFlag
})
const menuData = computed(() => {
  const routes = router.options.routes
  function filterRoutes(
    data: ReadonlyArray<RouteRecordRaw>
  ) {
    return data
      .map((node) => {
        const newNode = { ...node }
        if (
          newNode.children &&
          newNode.children.length > 0
        ) {
          newNode.children = filterRoutes(newNode.children)
        }
        return newNode
      })
      .filter(
        (node) =>
          node.meta &&
          node.meta?.title &&
          !node.meta?.hidden
      )
  }
  return filterRoutes(routes)
})
onMounted(() => {
  console.log(menuData.value)
})
</script>
<style lang="less" scoped>
.layout-header-title {
  height: 50px;
  font-weight: 600;
  font-size: 16px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica,
    sans-serif;
  text-align: center;
  line-height: 50px;
  color: #ffffff;
}

.el-menu {
  border: 0 !important;
}
</style>
