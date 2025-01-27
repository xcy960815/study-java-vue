<template>
  <div ref="serverSendEventRef" class="sse-stream"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { serverSendEventModule } from '@apis'

const serverSendEventRef = ref<HTMLDivElement>()
onMounted(() => {
  serverSendEventModule.serverSendEvent(
    serverSendEventRef.value
  )
})
</script>
<style lang="less" scoped>
.sse-stream {
  position: relative;
}
</style>
