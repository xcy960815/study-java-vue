<template>
  <div class="chat">
    <div ref="conversationRef"></div>
    <!-- <el-button @click="generate">generate</el-button> -->
    <el-button @click="generateStream"
      >generateStream
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { GptModel } from '@utils/deepseek'
import { useRoute } from 'vue-router'
const route = useRoute()

const model = ref<string>(
  (route.query.model as string) || 'deepseek-r1:14b'
)

const gptModel = new GptModel({
  apiBaseUrl: 'http://localhost:8082/dev-api',
  apiKey: '',
  requestParams: {
    model: model.value
    // prompt: '天为什么是蓝色的？',
    // stream: true
  }
})

const conversationRef = ref<HTMLDivElement>()

/**
 * 流式会话
 */
const generateStream = async () => {
  const generateRequstParamas = {
    model: model.value,
    prompt: '天为什么是蓝色的？',
    stream: true
  }
  const url = '/ollama/generateStream'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(generateRequstParamas)
  })
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let done = false
  let chunk = ''

  // 逐块读取流
  while (!done) {
    const { value, done: doneReading } =
      await reader?.read()!
    done = doneReading
    // 解码流数据并拼接
    chunk += decoder.decode(value, { stream: true })

    // 假设每次接收到完整数据时进行处理
    if (chunk.endsWith('\n')) {
      // parser.feed(chunk) // 逐段输出
      chunk = '' // 清空缓存，准备下一段数据
    }
  }
}
</script>
<style lang="less" scoped>
.chat {
  position: relative;
}
</style>
