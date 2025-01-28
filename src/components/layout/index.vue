<template>
  <el-container
    class="layout-container w-screen h-screen flex"
  >
    <layout-menu></layout-menu>
    <el-container
      class="layout-view-container flex-1 flex flex-col"
    >
      <layoout-header></layoout-header>
      <el-main class="layout-main-container flex-1 p-2.5">
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
import LayooutHeader from './header/index.vue'
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
