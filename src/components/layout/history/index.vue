<template>
    <div class="history-list-container">
        <el-tag class="history-item cursor-pointer ml-[5px] mr-[5px]" @click="handleClickTag(historyItem)"
            :closable="allowClosable(historyItem)" @close="handleCloseTag(historyItem)" :type="tagType(historyItem)"
            v-for="historyItem in historyList">
            {{ historyItem.meta.title }}
        </el-tag>
    </div>
</template>

<script lang='ts' setup>

import { useRouter,useRoute, onBeforeRouteUpdate, type RouteLocationNormalizedLoadedGeneric } from "vue-router"
import { onMounted, computed } from "vue"
import { useSystemInfoStore } from "@store"

const router = useRouter()
const route = useRoute()
const systemInfoStore = useSystemInfoStore()

const historyList = computed(() => systemInfoStore.historyList)


onBeforeRouteUpdate((to) => {
    systemInfoStore.addHistoryItem(to)
    systemInfoStore.addKeepLiveItem(to)
})

const allowClosable = (historyItem: RouteLocationNormalizedLoadedGeneric) => {
    return historyList.value.length !== 1
}

/**
 * 标签类型
 * @param {RouteLocationNormalizedLoadedGeneric} historyItem 
 */
const tagType = (historyItem: RouteLocationNormalizedLoadedGeneric) => {
    return historyItem.path === router.currentRoute.value.path ? 'success' : 'info'
}

/**
 * 点击历史记录
 * @param {RouteLocationNormalizedLoadedGeneric} historyItem 
 */
const handleClickTag = (historyItem: RouteLocationNormalizedLoadedGeneric) => {
    router.push(historyItem)
}

/**
 * 移除历史记录
 * @param historyItem {RouteLocationNormalizedLoadedGeneric}
 */
const handleCloseTag = (historyItem: RouteLocationNormalizedLoadedGeneric) => {
    systemInfoStore.removeHistoryItem(historyItem)
    // router.push(historyItem)
}

onMounted(() => {

    systemInfoStore.addHistoryItem(route)
})

</script>
<style lang='less' scoped>
.history-list-container {
    padding: 10px 20px 0 20px;
    cursor: pointer;

    .history-item:first-child {
        margin-left: 0px;
    }
}
</style>