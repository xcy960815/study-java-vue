<template>
  <div class="ollama">
    <div ref="conversationRef"></div>
    <el-button @click="generate">generate</el-button>
    <el-button @click="generateStream"
      >generateStream</el-button
    >
    <el-button @click="fluxStream">fluxStream</el-button>
    <el-button @click="models">models</el-button>
    <el-button @click="version">version</el-button>
    <el-button @click="tags">tags</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ollamaModule } from '@apis'
import {
  createParser,
  type EventSourceParser
} from 'eventsource-parser'
const generate = async () => {
  const generateRequstParamas = {
    model: 'deepseek-r1:14b',
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

const generateStreamLocal = async () => {
  const url = 'http://localhost:11434/api/generate'
  const generateRequstParamas = {
    model: 'deepseek-r1:14b',
    prompt: '你好',
    stream: true
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(generateRequstParamas)
  })
  const body = response.body

  for await (const chunk of await streamAsyncIterable(
    body!
  )) {
    const chunkString = new TextDecoder().decode(chunk)
    const chatResponse = JSON.parse(chunkString)
    const originalInnerText =
      conversationRef.value?.innerText || ''
    if (conversationRef.value) {
      conversationRef.value.innerText = (originalInnerText +
        chatResponse.response) as string
    }
  }
}

const fluxStream = async () => {
  const generateRequstParamas = {
    model: 'deepseek-r1:14b',
    prompt: '你好',
    stream: true
  }
  const url =
    'http://localhost:8082/dev-api/ollama/fluxStream'
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const body = response.body
  // for await (const chunk of await streamAsyncIterable(
  //   body!
  // )) {
  //   const chunkString = new TextDecoder().decode(chunk)
  //   parser.feed(chunkString)
  // }
}

const generateStream = async () => {
  const generateRequstParamas = {
    model: 'deepseek-r1:14b',
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
  // @ts-ignore
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let done = false
  let chunk = ''

  // 逐块读取流
  while (!done) {
    const { value, done: doneReading } = await reader.read()
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

const models = async () => {
  const result = await ollamaModule.models()
  console.log('result---result', result)
}
const version = async () => {
  const result = await ollamaModule.version()
  console.log('result---result', result)
}
const tags = async () => {
  const result = await ollamaModule.tags()
  console.log('result---result', result)
}
</script>
<style lang="less" scoped></style>
