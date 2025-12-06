<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useSystemTheme } from '@/utils/system-style'

const { initTheme } = useSystemTheme()

onMounted(() => {
  // initTheme()
})
</script>
<style lang="less" scoped></style>
