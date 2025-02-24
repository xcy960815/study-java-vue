<template>
  <div class="ollama">
    <div ref="conversationRef"></div>
    <el-button @click="generate">generate</el-button>
    <el-button @click="generateStream"
      >generateStream</el-button
    >
    <!--     
    
    <el-button @click="tags">tags</el-button> -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ollamaModule } from '@apis'
import {
  createParser,
  type EventSourceParser
} from 'eventsource-parser'
import { useRoute } from 'vue-router'
const route = useRoute()
const model = ref<string>(
  (route.query.model as string) || 'deepseek-r1:14b'
)

const generate = async () => {
  const generateRequstParamas = {
    model: model.value,
    prompt: '为什么天空是蓝色的',
    stream: false
  }
  const result = await ollamaModule.generate(
    generateRequstParamas
  )
  console.log('result---result', result)
}

const streamAsyncIterable = async function* (
  stream: ReadableStream<Uint8Array<ArrayBufferLike>>
) {
  const reader = stream.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        return
      }
      yield value
    }
  } finally {
    reader.releaseLock()
  }
}

const parser: EventSourceParser = createParser({
  onEvent: (event) => {
    if (event.data) {
      const chatResponse = JSON.parse(event.data)
      const originalInnerText =
        conversationRef.value?.innerText || ''
      if (conversationRef.value) {
        conversationRef.value.innerText =
          (originalInnerText +
            chatResponse.response) as string
      }
    }
  }
})

const conversationRef = ref<HTMLDivElement>()

const generateStream = async () => {
  const generateRequstParamas = {
    model: model.value,
    prompt: '天为什么是蓝色的？',
    stream: true
  }
  const url =
    'http://localhost:8082/dev-api/ollama/generateStream'

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
      parser.feed(chunk) // 逐段输出
      chunk = '' // 清空缓存，准备下一段数据
    }
  }
}
</script>
<style lang="less" scoped></style>
