<template>
  <div ref="deepseekChatRef"></div>
  <el-input type="text" v-model="question"></el-input>
  <el-button @click="generateStream"
    >generateStream</el-button
  >
  <el-button @click="stopConversation">停止回答</el-button>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ollamaModule } from '@apis'
import { Gpt } from '@/utils/ai'
const question = ref<string>('天为什么是蓝色的？')
const model = ref<string>('deepseek-chat')
const parentMessageId = ref<string>('')
const gptModel = new Gpt({
  apiKey: '',
  apiBaseUrl: import.meta.env.VITE_API_DOMAIN_PREFIX,
  markdown2Html: true,
  requestParams: {
    model: model.value
  }
})

const deepseekChatRef = ref<HTMLElement | null>(null)

/**
 * 流式会话
 */
const generateStream = async () => {
  const response = await gptModel.getAnswer(
    question.value,
    {
      parentMessageId: parentMessageId.value,
      systemMessage: '你是一个聊天机器人',
      onProgress(partialResponse) {
        if (deepseekChatRef.value) {
          deepseekChatRef.value.innerHTML =
            partialResponse.content
        }
      }
    }
  )
  parentMessageId.value = response.parentMessageId
}

const stopConversation = () => {
  gptModel.cancelConversation()
}

onMounted(() => {})
</script>
<style lang="less" scoped>
.sse-stream {
  position: relative;
}
</style>
