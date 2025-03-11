<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in">
      <keep-alive include="userList">
        <component :is="Component" :key="routerViewKey"/>
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router"
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

onBeforeRouteLeave((to) => {
  // console.log("onBeforeRouteLeave--onBeforeRouteLeave");

  systemInfoStore.addKeepLiveItem(to)
})

onBeforeRouteUpdate((to) => {
  // console.log("onBeforeRouteUpdate--onBeforeRouteUpdate");
})

watch(route, (to) => {
  systemInfoStore.addKeepLiveItem(to)
})

// const componentKey = ref()


onMounted(() => {
  initTheme()
})

</script>
<style lang="less" scoped></style>
