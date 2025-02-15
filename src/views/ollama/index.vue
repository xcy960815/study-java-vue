<template>
  <div class="ollama">
    <el-button @click="generate">generate</el-button>
    <el-button @click="generateStream"
      >generateStream</el-button
    >
    <el-button @click="models">models</el-button>
    <el-button @click="version">version</el-button>
    <el-button @click="tags">tags</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ollamaModule } from '@apis'

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
    prompt: '为什么天空是蓝色的',
    stream: true
  }
  const result = await ollamaModule.generateStream(
    generateRequstParamas
  )
  console.log('result---result', result)
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
