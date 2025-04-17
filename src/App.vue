<template>
  <div id="app1"></div>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in">
      <keep-alive include="userList">
              <component :is="Component" :key="routerViewKey" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { useSystemInfoStore } from '@store'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { setSystemTheme } from '@/utils/system-style'

const route = useRoute()

const systemInfoStore = useSystemInfoStore()

const keepLiveList = computed(() => systemInfoStore.getKeepLiveList)

const routerViewKey = ref(route.fullPath)

const { initTheme } = setSystemTheme()

onMounted(() => {
  initTheme()
})
</script>
<style lang="less" scoped></style>
