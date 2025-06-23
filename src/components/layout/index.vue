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
import { onMounted } from 'vue'
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
    default: null,
  },
})
</script>

<style lang="less" scoped>
.layout-container {
  position: relative;
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);

  .layout-view-container {
    flex-direction: column;
    background-color: var(--el-bg-color-page);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    .layout-main-container {
      background-color: var(--el-bg-color-page);
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(
          to right,
          transparent,
          var(--el-border-color-lighter),
          transparent
        );
        z-index: 2;
      }

      :deep(.el-main) {
        background-color: var(--el-bg-color-page);
        padding: 16px;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
      }
    }
  }
}

// 浅色主题特定样式
:root:not(.dark) {
  .layout-container {
    .layout-view-container {
      background-color: #f5f7fa;

      .layout-main-container {
        background-color: #f5f7fa;

        :deep(.el-main) {
          background-color: #ffffff;
        }
      }
    }
  }
}
</style>
