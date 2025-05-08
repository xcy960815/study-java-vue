<template>
  <div class="theme-switch-container">
    <!-- 切换主题按钮 -->
    <el-tooltip content="切换主题色" placement="bottom">
      <el-button class="theme-btn" :icon="Brush" circle @click="handleClickChangeThemeColor" />
    </el-tooltip>
    <el-tooltip :content="isDark ? '切换到浅色模式' : '切换到深色模式'" placement="bottom">
      <el-button
        class="theme-btn"
        :icon="isDark ? Sunny : Moon"
        circle
        @click="handleClickChangeTheme"
      />
    </el-tooltip>

    <!-- 切换主题dialog -->
    <el-dialog v-model="themeDialogVisible" title="主题设置" width="400px" destroy-on-close>
      <el-form :model="themeConfig" ref="themeFormRef" class="theme-form" label-width="70px">
        <el-form-item label="主色">
          <el-color-picker
            v-model="themeConfig.colors.primary"
            :predefine="predefineColors"
            show-alpha
            color-format="hex"
          />
        </el-form-item>
        <el-form-item label="消息色">
          <el-color-picker
            v-model="themeConfig.colors.info"
            :predefine="predefineColors"
            show-alpha
            color-format="hex"
          />
        </el-form-item>
        <el-form-item label="成功色">
          <el-color-picker
            v-model="themeConfig.colors.success"
            :predefine="predefineColors"
            show-alpha
            color-format="hex"
          />
        </el-form-item>
        <el-form-item label="警告色">
          <el-color-picker
            v-model="themeConfig.colors.warning"
            :predefine="predefineColors"
            show-alpha
            color-format="hex"
          />
        </el-form-item>
        <el-form-item label="危险色">
          <el-color-picker
            v-model="themeConfig.colors.danger"
            :predefine="predefineColors"
            show-alpha
            color-format="hex"
          />
        </el-form-item>
        <el-form-item class="color-buttons">
          <el-button type="primary" @click="handleConfirmTheme">应用主题</el-button>
          <el-button @click="resetTheme">重置默认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useSystemTheme } from '@/utils/system-style'
import { Brush, Moon, Sunny } from '@element-plus/icons-vue'
import { ref } from 'vue'

const {
  isDark,
  handleConfirmTheme,
  resetTheme,
  themeDialogVisible,
  themeConfig,
  handleClickChangeThemeColor,
  handleClickChangeTheme,
} = useSystemTheme()

// 预定义颜色
const predefineColors = ref([
  '#409EFF',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
  '#909399',
  '#409EFF80',
  '#67C23A80',
  '#E6A23C80',
  '#F56C6C80',
  '#90939980',
])
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

.theme-form {
  padding: 20px 0;

  :deep(.el-form-item) {
    margin-bottom: 20px;

    .el-form-item__label {
      color: var(--el-text-color-regular);
    }
  }

  .color-buttons {
    margin-top: 30px;
    margin-bottom: 0;
    text-align: center;
  }
}

:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;

  .el-dialog__header {
    margin: 0;
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-light);
    background-color: var(--el-bg-color-overlay);

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .el-dialog__body {
    padding: 20px;
  }

  .el-dialog__footer {
    padding: 16px 20px;
    border-top: 1px solid var(--el-border-color-light);
    background-color: var(--el-bg-color-overlay);
  }
}

// 针对暗黑模式
:root.dark {
  .layout-menu-view {
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
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

// 浅色主题菜单样式
:root:not(.dark) {
  .layout-menu-view {
    background-color: var(--el-bg-color) !important;

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
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
