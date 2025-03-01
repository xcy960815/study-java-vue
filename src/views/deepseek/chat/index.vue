<template>
  <div ref="deepseekChatRef"></div>
  <el-input type="text" v-model="question"></el-input>
  <el-button @click="completions">completions</el-button>
  <el-button @click="cancelConversation"
    >停止回答</el-button
  >
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { deepseekModule } from '@apis'
const question = ref<string>('天为什么是蓝色的？')
const parentMessageId = ref<string>('')
const deepseekChatRef = ref<HTMLElement | null>(null)

/**
 * 流式会话
 */
const completions = async () => {
  const questionOption: AI.Gpt.GetAnswerOptions = {
    parentMessageId: parentMessageId.value,
    systemMessage: '你是一个聊天机器人',
    onProgress(partialResponse) {
      if (deepseekChatRef.value) {
        deepseekChatRef.value.innerHTML =
          partialResponse.content
      }
    }
  }

  const response = await deepseekModule.completions(
    question.value,
    questionOption
  )
  parentMessageId.value = response.parentMessageId
}

const cancelConversation = () => {
  deepseekModule.cancelConversation()
}

onMounted(() => {})
</script>
<style lang="less" scoped>
.sse-stream {
  position: relative;
}
</style>
