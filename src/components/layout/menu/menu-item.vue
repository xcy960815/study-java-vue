<template>
  <template v-for="menuItem in menuData">
    <el-sub-menu
      v-if="hasSubMenu(menuItem)"
      :index="menuItem.path"
    >
      <template #title>
        <component
          v-if="menuItem.meta?.icon"
          style="width: 1em; height: 1em; margin-right: 1em"
          :is="menuItem.meta?.icon"
        ></component>
        <span
          v-else
          style="width: 1em; height: 1em; margin-right: 1em"
        ></span>
        <span>{{ menuItem.meta?.title }}</span>
      </template>
      <menu-item :menu-data="menuItem.children"></menu-item>
    </el-sub-menu>
    <el-menu-item v-else :index="menuItem.path">
      <component
        v-if="menuItem.meta?.icon"
        style="width: 1em; height: 1em; margin-right: 1em"
        :is="menuItem.meta?.icon"
      >
      </component>
      <span
        v-else
        style="width: 1em; height: 1em; margin-right: 1em"
      ></span>
      <span>{{ menuItem.meta?.title }}</span>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { type RouteRecordRaw } from 'vue-router'
const props = defineProps({
  menuData: {
    type: Object as PropType<Array<RouteRecordRaw>>,
    default: () => {
      return []
    }
  }
})

const menuData = computed(() => {
  return props.menuData
})
const hasSubMenu = (menuItem: RouteRecordRaw) => {
  return menuItem.children && menuItem.children.length
}

defineOptions({
  name: 'MenuItem'
})
</script>
<style lang="less" scoped></style>
