<template>
  <div class="deepseek-chat">
    <ai-chat
      :role-alias="roleAlias"
      @completions="completions"
      :conversation="conversation"
      @cancel-conversation="cancelConversation"
      :conversations="conversations"
    ></ai-chat>
  </div>
</template>

<script lang="ts" setup>
import { OllamaModel } from '@utils/ai'
import { renderMarkdownText } from '@plugins/markdown'
import { ref } from 'vue'
// import { deepseekModule } from '@apis'
import { useRoute } from 'vue-router'
import AiChat from '@components/ai-chat/index.vue'
import { RoleEnum } from '@enums'
import { cloneDeep } from 'lodash'
defineOptions({
  name: 'deepseek-chat',
})

const route = useRoute()

const model = route.query.model as string

const parentMessageId = ref<string>('')

const conversations = ref<AI.Conversation[]>([])
/**
 * 当前会话
 */
const conversation = ref<AI.Gpt.AssistantConversation | null>(null)

/**
 * ollama 模型
 */
const ollamaModel = new OllamaModel({
  apiKey: '',
  apiBaseUrl: import.meta.env.VITE_API_DOMAIN_PREFIX,
  completionsUrl: '/deepseek/completions',
  requestParams: {
    model: model,
  },
})

/**
 * 角色别名
 */
const roleAlias = ref<Record<AI.Role, string>>({
  user: 'ME',
  assistant: 'Ollama',
  system: 'System',
})

/**
 * 流式会话
 * @param {string} question
 */
const completions = async (question: string) => {
  setTimeout(async () => {
    conversations.value = await ollamaModel.getAllConversations()
    const userMessage = conversations.value[conversations.value.length - 1]
    conversation.value = ollamaModel.buildConversation(RoleEnum.Assistant, '', userMessage)
  })

  const questionOption: AI.Gpt.CompletionsOptions = {
    parentMessageId: parentMessageId.value,
    systemMessage: '你是一个聊天机器人',
    requestParams: {
      model,
    },
    onProgress(partialResponse) {
      conversation.value = cloneDeep(partialResponse)
    },
  }

  const response = await ollamaModel.completions(question, questionOption)

  if (!!response.done) {
    conversation.value = null
    conversations.value = await ollamaModel.getAllConversations()
    parentMessageId.value = response.parentMessageId
  }
}
/**
 * 取消会话
 */
const cancelConversation = () => {
  ollamaModel.cancelConversation()
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
