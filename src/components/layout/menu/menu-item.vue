<template>
  <template v-for="menuItem in menuData">
    <el-sub-menu
      v-if="hasSubMenu(menuItem)"
      :index="menuItem.path"
    >
      <template #title>
        <svg-icon
          v-if="menuItem.meta?.icon"
          :name="menuItem.meta?.icon"
          class="icon"
        ></svg-icon>
        <!-- 占位符 -->
        <span class="icon" v-else></span>
        <span>{{ menuItem.meta?.title }}</span>
      </template>
      <menu-item :menu-data="menuItem.children"></menu-item>
    </el-sub-menu>
    <el-menu-item v-else :index="menuItem.path">
      <svg-icon
        v-if="menuItem.meta?.icon"
        :name="menuItem.meta?.icon"
        class="icon"
      ></svg-icon>
      <!-- 占位符 -->
      <span class="icon" v-else></span>
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
<style lang="less" scoped>
.el-menu-item,
.el-sub-menu__title {
  .icon {
    margin-right: 0.5em;
  }
}
</style>
