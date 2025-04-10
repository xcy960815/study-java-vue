<template>
  <el-container class="layout-container w-screen h-screen flex">
    <layout-menu></layout-menu>
    <el-container class="layout-view-container flex-1 flex flex-col">
      <layout-header></layout-header>
      <!-- 历史记录 -->
      <!-- <layout-history></layout-history> -->
      <el-main class="layout-main-container flex-1 p-1.5">
        <!-- https://element-plus.org/zh-CN/guide/i18n.html -->
        <el-config-provider :locale="locale">
          <router-view v-if="!props.content"></router-view>
          <component v-else :is="props.content"></component>
        </el-config-provider>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import LayoutHeader from './header/index.vue'
import LayoutHistory from './history/index.vue'
import LayoutMenu from './menu/index.vue'
// import zhCn from 'element-plus/lib/locale/lang/zh-cn'
// @ts-ignore
import locale from 'element-plus/dist/locale/zh-cn.mjs'
// let  locale=zhCn
const props = defineProps({
  content: {
    type: Object,
    default: null
  }
})
</script>
<style lang="less" scoped>
.layout-container {
  position: relative;

  .layout-view-container {
    flex-direction: column;
  }
}
</style>
