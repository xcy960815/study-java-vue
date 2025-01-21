<template>
  <el-container class="layout-container">
    <layout-menu></layout-menu>
    <el-container class="layout-view-container">
      <layoout-header></layoout-header>
      <el-main class="layout-main-container">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import LayooutHeader from './header/index.vue'
import LayoutMenu from './menu/index.vue'
</script>
<style lang="less" scoped>
.layout-container {
  height: 100%;
  width: 100%;
  display: flex;

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
