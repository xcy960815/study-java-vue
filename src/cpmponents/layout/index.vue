<template>
  <el-container class="layout-container">
    <el-aside
      class="layout-menu"
      :class="{ 'layout-menu-collapse': isCollapse }"
      :width="isCollapse ? '64px' : '300px'"
    >
      <layout-menu></layout-menu>
    </el-aside>
    <el-container class="layout-view-container">
      <layoout-header></layoout-header>
      <el-main class="layout-main-container">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import LayooutHeader from './header/index.vue'
import LayoutMenu from './menu/index.vue'
import { useSystemInfoStore } from '@store'
const systemInfoStore = useSystemInfoStore()
const isCollapse = computed(() => {
  return !systemInfoStore.openMenuFlag
})
</script>
<style lang="less" scoped>
.layout-container {
  height: 100%;
  width: 100%;
  display: flex;

  .layout-menu {
    height: 100%;
    // background-color: #293135;
    background-color: rgb(2, 93, 126);
    transition: width 0.3s;
  }

  .layout-view-container {
    display: flex;
    flex-direction: column;

    .layout-main-container {
      flex: 1;
      padding: 10px;
    }
  }
}
</style>
