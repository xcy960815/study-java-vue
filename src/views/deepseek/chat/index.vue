<template>
  <div class="deepseek-chat">
    <div class="chat-main-card">
      <ai-chat
        :role-alias="roleAlias"
        @completions="completions"
        @cancel-conversation="cancelConversation"
        :conversation-list="conversationList"
        :current-conversation="currentConversation"
      ></ai-chat>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCompletions } from '@/composables/useCompletions'
import { ref } from 'vue'
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

const conversationList = ref<AI.Conversation[]>([])

const { Completions } = useCompletions()
/**
 * deepseek 模型
 */
const deepseekModel = new Completions({
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
  assistant: 'DeepSeek',
  system: 'System',
})

const currentConversation = ref<AI.Conversation | null>(null)
/**
 * 流式会话
 * @param {string} question
 */
const completions = async (question: string) => {
  setTimeout(async () => {
    conversationList.value = await deepseekModel.getAllConversations()
    currentConversation.value = deepseekModel.buildConversation(RoleEnum.Assistant, '', {})
  })

  const questionOption: AI.Gpt.CompletionsOptions = {
    parentMessageId: parentMessageId.value,
    systemMessage: '你是一个聊天机器人',
    requestParams: {
      model,
    },
    onProgress(partialResponse) {
      currentConversation.value = cloneDeep(partialResponse)
    },
  }

  const response = await deepseekModel.completions(question, questionOption)

  if (!!response.done) {
    currentConversation.value = null
    conversationList.value = await deepseekModel.getAllConversations()
    parentMessageId.value = response.parentMessageId
  }
}
/**
 * 取消会话
 */
const cancelConversation = () => {
  deepseekModel.cancelConversation()
}
</script>
<style lang="less" scoped>
.deepseek-chat {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);

  .chat-main-card {
    flex: 1;
    margin: 24px 24px 0 24px;
    background: var(--el-bg-color);
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
    padding: 32px 32px 24px 32px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .conversation-list {
    flex: 1;
  }
}
</style>
