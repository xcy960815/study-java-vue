<template>
  <div ref="serverSendEventRef" class="sse-stream"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ollamaModule } from '@apis'
import { GptModel } from '@utils/deepseek'

const handleGetOllamaModels = async () => {
  const result = await ollamaModule.getModels()
  console.log('result', result)
}

onMounted(() => {
  handleGetOllamaModels()
  ollamaModule.getGenerate()
})
</script>
<style lang="less" scoped>
.sse-stream {
  position: relative;
}
</style>
