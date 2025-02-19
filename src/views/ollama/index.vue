<template>
  <div class="ollama">
    <div ref="conversationRef"></div>
    <el-button @click="generate">generate</el-button>
    <el-button @click="generateStream"
      >generateStream</el-button
    >
    <el-button @click="generateStreamLocal"
      >generateStreamLocal</el-button
    >
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

const parseBinaryStream = async (
  stream: ReadableStream<Uint8Array<ArrayBufferLike>>
) => {
  const reader = stream.getReader()
  const chunks = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  return chunks
}

const parser: EventSourceParser = createParser({
  onEvent: (event) => {
    console.log('event.data', event)
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

  for await (const chunk of await parseBinaryStream(
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

const generateStream = async () => {
  const generateRequstParamas = {
    model: 'deepseek-r1:14b',
    prompt: '你好',
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
  const body = response.body
  for await (const chunk of await parseBinaryStream(
    body!
  )) {
    const chunkString = new TextDecoder().decode(chunk)
    parser.feed(chunkString)
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
