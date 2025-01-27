<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { setSystemTheme } from '@/utils/style'
const { initTheme } = setSystemTheme()
onMounted(() => {
  // initTheme()
})
</script>
<style lang="less" scoped></style>
