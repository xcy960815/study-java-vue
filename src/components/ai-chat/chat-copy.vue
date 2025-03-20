<template>
  <div class="flex items-center cursor-pointer" @click="copyToClipboard()">
    <copy
      v-show="buttonnStatus === 'copy'"
      :theme="buttonnConfig.theme"
      :size="buttonnConfig.size"
      :fill="buttonnConfig.fill"
    />
    <loading
      class="rotate"
      v-show="buttonnStatus === 'loading'"
      :theme="buttonnConfig.theme"
      :size="buttonnConfig.size"
      :fill="buttonnConfig.fill"
    />
    <check-one
      v-show="buttonnStatus === 'success'"
      :theme="buttonnConfig.theme"
      :size="buttonnConfig.size"
      :fill="buttonnConfig.fill"
    />
    <close-one
      v-show="buttonnStatus === 'error'"
      :theme="buttonnConfig.theme"
      :size="buttonnConfig.size"
      :fill="buttonnConfig.fill"
    />
    <span class="text-xs ml-0.5 text-gray-500 leading-none">{{ buttonnStatusTips[buttonnStatus] }}</span>
  </div>
</template>
<script setup lang="ts">
import { Copy, Loading, CheckOne, CloseOne } from '@icon-park/vue-next'
import type { Theme } from '@icon-park/vue-next/lib/runtime'
import { ref } from 'vue'

const porps = defineProps<{ content: string }>()

interface ButtonnConfig {
  size: number
  fill: string
  theme: Theme
}
/**
 * 按钮配置
 */
const buttonnConfig: ButtonnConfig = {
  size: 14,
  fill: '#999',
  theme: 'outline'
}

const buttonnStatusTips = {
  copy: '复制全文',
  loading: '',
  success: '已复制到剪贴板！',
  error: '复制失败！'
}

/**
 * 按钮状态
 */
const buttonnStatus = ref<'copy' | 'loading' | 'success' | 'error'>('copy')

/**
 * 复制到剪切板
 * @param {string} content 复制内容
 */
const copyToClipboard = (content: string = porps.content) => {
  buttonnStatus.value = 'loading'
  navigator.clipboard
    .writeText(content)
    .then(() => setTimeout(() => (buttonnStatus.value = 'success'), 150))
    .catch(() => (buttonnStatus.value = 'error'))
    .finally(() => setTimeout(() => (buttonnStatus.value = 'copy'), 1500))
}
</script>

<style lang="less" scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.rotate {
  animation: spin 2s linear infinite;
}
</style>
