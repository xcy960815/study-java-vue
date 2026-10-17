<template>
  <span
    v-if="hasUpdate"
    class="update-dot-trigger"
    title="发现新版本，点击查看"
    role="button"
    tabindex="0"
    @click="handleShowUpdatePrompt"
  >
    <span class="update-dot"></span>
  </span>
</template>

<script lang="ts" setup>
/**
 * 新版本提示（迁移自 guibiao 的 version-update-dot，React 版同源）：
 * 检测到线上已发布新版本时，在右上角显示橙色脉冲圆点，
 * 点击弹出确认框，确认后整页重载以加载最新前端资源。
 */
import { ElMessageBox } from 'element-plus'
import { useAppUpdateCheck } from '@/composables/useAppUpdateCheck'

const { hasUpdate } = useAppUpdateCheck()

function handleShowUpdatePrompt(): void {
  ElMessageBox.confirm(
    '系统已发布新版本，刷新页面后即可使用最新功能。请先保存正在编辑的内容。',
    '发现新版本',
    {
      confirmButtonText: '刷新并更新',
      cancelButtonText: '稍后处理',
      type: 'info',
    }
  )
    .then(() => {
      window.location.reload()
    })
    .catch(() => {
      // 用户选择稍后处理
    })
}
</script>

<style lang="less" scoped>
.update-dot-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  outline: none;

  &:hover,
  &:focus-visible {
    background: rgba(250, 140, 22, 0.14);
  }

  &:focus-visible {
    outline: 2px solid #fa8c16;
    outline-offset: 2px;
  }
}

.update-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #fa8c16;
  box-shadow: 0 0 0 0 rgba(250, 140, 22, 0.55);
  animation: update-dot-pulse 1.8s ease-out infinite;
}

@keyframes update-dot-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(250, 140, 22, 0.55);
  }

  70% {
    box-shadow: 0 0 0 7px rgba(250, 140, 22, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(250, 140, 22, 0);
  }
}

/* 弱动效环境下不播放脉冲动画 */
@media (prefers-reduced-motion: reduce) {
  .update-dot {
    animation: none;
  }
}
</style>
