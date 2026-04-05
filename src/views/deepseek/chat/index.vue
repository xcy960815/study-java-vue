<template>
  <div class="deepseek-chat">
    <div class="chat-main-card">
      <ai-chat
        :role-alias="roleAlias"
        @completions="sendMessage"
        @cancel-conversation="cancelConversation"
        :conversation-list="conversationList"
        :current-conversation="currentConversation"
      ></ai-chat>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

import AiChat from '@components/ai-chat/index.vue'

import { useAiChatSession } from '@/composables/useAiChatSession'
import { useCompletions } from '@/composables/useCompletions'

defineOptions({
  name: 'DeepseekChat',
})

const route = useRoute()

const model = route.query.model as string

const { Completions } = useCompletions()
const deepseekModel = new Completions({
  apiKey: '',
  apiBaseUrl: import.meta.env.VITE_API_DOMAIN_PREFIX,
  completionsUrl: '/deepseek/completions',
  requestParams: {
    model: model,
  },
})

const roleAlias: Partial<Record<AI.Role, string>> = {
  user: 'ME',
  assistant: 'DeepSeek',
  system: 'System',
}

const { conversationList, currentConversation, sendMessage, cancelConversation } = useAiChatSession(
  {
    model: deepseekModel,
    getCompletionsOptions: () => ({
      systemMessage: '你是一个聊天机器人',
      requestParams: {
        model,
      },
    }),
    onError: (error) => {
      console.error('DeepSeek conversation failed:', error)
    },
  }
)
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
