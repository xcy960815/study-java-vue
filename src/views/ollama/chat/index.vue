<template>
  <div class="ollama-chat">
    <ai-chat :role-alias="roleAlias" @completions="completions" :conversations="conversations"
      :conversation="conversation">
    </ai-chat>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { OllamaModel, RoleEnum } from '@utils/ai'
import { useRoute } from 'vue-router'
import AiChat from "@components/ai-chat/index.vue"

defineOptions({
  name: 'ollama-chat'
})
const route = useRoute()

const model = ref<string>(
  (route.query.model as string) || 'deepseek-r1:14b'
)

/**
 * 角色别名
 */
const roleAlias = ref<Record<AI.Role, string>>({
  user: "ME",
  assistant: "Ollama",
  system: "System"
})

/**
 * 会话列表
 */
const conversations = ref<AI.Conversation[]>([])

/**
 * 当前会话
 */
const conversation = ref<AI.Gpt.AssistantConversation | null>(null)

const ollamaModel = new OllamaModel({
  apiKey: '',
  apiBaseUrl: import.meta.env.VITE_API_DOMAIN_PREFIX,
  completionsUrl: "/ollama/completions",
  // markdown2Html:true,
  requestParams: {
    model: model.value,
  }
})

const parentMessageId = ref('')

/**
 * 流式会话
 */
const completions = async (question: string) => {

  setTimeout(async () => {
    conversations.value = await ollamaModel.getAllConversations()
    const userMessage = conversations.value[conversations.value.length - 1]
    conversation.value = ollamaModel.buildConversation(RoleEnum.ASSISTANT, "", userMessage)
  })

  const model = route.query.model as string

  const questionOption: AI.Gpt.GetAnswerOptions = {
    parentMessageId: parentMessageId.value,
    systemMessage: '你是一个聊天机器人',
    requestParams: {
      model
    },
    onProgress(partialResponse) {
      conversation.value = JSON.parse(JSON.stringify(partialResponse))
    }
  }

  const response = await ollamaModel.getAnswer(
    question,
    questionOption
  )
  if (!!response.done) {
    conversation.value = null
    conversations.value = await ollamaModel.getAllConversations()
    parentMessageId.value = response.parentMessageId
  }
}


</script>
<style lang="less" scoped>
.ollama-chat {
  position: relative;
  height: 100%;

  .ollama-chat {
    display: flex;
    flex-direction: column;
  }
}
</style>
