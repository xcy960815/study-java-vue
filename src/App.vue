<template>
  <keep-alive :include="keepLiveList">
    <router-view :key="routerViewKey"></router-view>
  </keep-alive>
</template>

<script lang="ts" setup>
import { useSystemInfoStore } from '@store'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { setSystemTheme } from '@/utils/system-theme'
const route = useRoute()

const systemInfoStore = useSystemInfoStore()

const { initTheme } = setSystemTheme()

const keepLiveList = computed(
  () => systemInfoStore.getKeepLiveList
)

const routerViewKey = ref(route.fullPath)

watch(route, (to, from) => {
  systemInfoStore.addKeepLiveList(to)
})
onMounted(() => {
  initTheme()
})
</script>
<style lang="less" scoped></style>
