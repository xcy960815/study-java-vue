<template>
  <router-view />
</template>

<script lang="ts" setup>
// 引入主题引擎：system-style 模块级单例在加载时即恢复偏好并写入 CSS 变量（先于其余组件使用）
import '@/utils/system-style'
</script>
<style lang="less" scoped></style>
