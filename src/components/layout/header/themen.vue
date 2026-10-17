<template>
  <div class="theme-switch-container">
    <!-- 全屏切换 -->
    <el-tooltip :content="fullscreen ? '退出全屏' : '全屏'" placement="bottom">
      <el-button
        class="theme-btn"
        :icon="FullScreen"
        circle
        :aria-label="fullscreen ? '退出全屏' : '全屏'"
        @click="toggleFullscreen()"
      />
    </el-tooltip>
    <!-- 快速切换亮暗 -->
    <el-tooltip :content="isDark ? '切换到浅色模式' : '切换到深色模式'" placement="bottom">
      <el-button
        class="theme-btn"
        :icon="isDark ? Sunny : Moon"
        circle
        @click="toggleDarkQuick()"
      />
    </el-tooltip>
    <!-- 打开个性化设置抽屉 -->
    <el-tooltip content="个性化设置" placement="bottom">
      <el-button class="theme-btn" :icon="Brush" circle @click="drawerVisible = true" />
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
/**
 * 头部快捷按钮组（与 React 版右上角对齐）：全屏切换、亮暗快切、个性化设置抽屉入口。
 * 主题偏好的完整编辑都在 personalization-drawer 中进行（外观主题 + 主题色彩）。
 */
import { useSystemTheme } from '@/utils/system-style'
import { useFullscreen } from '@/composables/useFullscreen'
import { Brush, Moon, Sunny, FullScreen } from '@element-plus/icons-vue'

const { isDark, drawerVisible, toggleDarkQuick } = useSystemTheme()
const { fullscreen, toggleFullscreen } = useFullscreen()
</script>

<style lang="less" scoped>
.theme-switch-container {
  display: flex;
  align-items: center;
  gap: 8px;

  .theme-btn {
    padding: 8px;
    border: none;
    background: transparent;
    color: var(--el-text-color-regular);
    transition: all 0.3s ease;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }

    :deep(.el-icon) {
      font-size: 18px;
    }
  }
}
</style>

<style lang="less">
/* 菜单在暗/亮主题下的着色规则（沿用旧版 themen 样式，保证菜单观感不变） */
:root.dark {
  .layout-menu-view {
    .el-menu-item,
    .el-sub-menu__title {
      &:hover {
        background-color: rgba(64, 158, 255, 0.12) !important; // 主色+透明度
        color: var(--el-color-primary) !important;
      }
      &.is-active {
        background-color: rgba(64, 158, 255, 0.18) !important;
        color: var(--el-color-primary) !important;
      }
    }
  }
}

:root:not(.dark) {
  .layout-menu-view {
    background-color: var(--el-bg-color) !important;

    .el-menu-item,
    .el-sub-menu__title {
      background-color: var(--el-bg-color) !important;
      color: var(--el-text-color-regular) !important;

      &:hover {
        background-color: var(--el-color-primary-light-9) !important;
        color: var(--el-color-primary) !important;
      }
      &.is-active {
        background-color: rgba(64, 158, 255, 0.12) !important;
        color: var(--el-color-primary) !important;
      }
    }
  }
}
</style>
