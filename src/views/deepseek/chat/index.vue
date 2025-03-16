<template>
  <div class="deepseek-chat">
    <ai-chat @completions="completions" :conversations="conversations"></ai-chat>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { deepseekModule } from '@apis'
import { useRoute } from 'vue-router'
import AiChat from "@components/ai-chat/index.vue"
defineOptions({
  name: 'deepseek-chat'
})


const route = useRoute()

const parentMessageId = ref<string>('')

const conversations = ref<AI.Conversation[]>([])

const completions = async (question:string) => {
  setTimeout(async () => {
    conversations.value = await deepseekModule.getAllConversations()
  })

  const model = route.query.model as string

  const questionOption: AI.Gpt.GetAnswerOptions = {
    parentMessageId: parentMessageId.value,
    systemMessage: '你是一个聊天机器人',
    requestParams: {
      model
    },
    onProgress(partialResponse) {
      conversations.value[conversations.value.length - 1].content = partialResponse.content
    }
  }

  const response = await deepseekModule.completions(
    question,
    questionOption
  )

  parentMessageId.value = response.parentMessageId

}
/**
 * 取消会话
 */
const cancelConversation = () => {
  deepseekModule.cancelConversation()
}

</script>
<style lang="less" scoped>
.deepseek-chat {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .conversation-list {
    flex: 1;
  }
}
</style>
