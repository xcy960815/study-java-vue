<template>
  <div class="ollama-chat">
    <div class="chat-main-card">
      <ai-chat
        :role-alias="roleAlias"
        @completions="sendMessage"
        @cancel-conversation="cancelConversation"
        :conversation-list="conversationList"
        :current-conversation="currentConversation"
      >
      </ai-chat>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

import AiChat from '@components/ai-chat/index.vue'

import { useAiChatSession } from '@/composables/useAiChatSession'
import { useCompletions } from '@/composables/useCompletions'

defineOptions({
  name: 'OllamaChat',
})
const route = useRoute()

const model = (route.query.model as string) || 'deepseek-r1:14b'
const roleAlias: Partial<Record<AI.Role, string>> = {
  user: 'ME',
  assistant: model,
  system: 'System',
}

const { Completions } = useCompletions()

const completionsModel = new Completions({
  apiKey: '',
  apiBaseUrl: import.meta.env.VITE_API_DOMAIN_PREFIX,
  completionsUrl: '/ollama/completions',
  requestParams: {
    model: model,
  },
})

const { conversationList, currentConversation, sendMessage, cancelConversation } = useAiChatSession(
  {
    model: completionsModel,
    getCompletionsOptions: () => ({
      systemMessage: '你是一个聊天机器人',
      requestParams: {
        model,
      },
    }),
    onError: (error) => {
      console.error('Ollama conversation failed:', error)
    },
  }
)
</script>
<style lang="less" scoped>
.ollama-chat {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
    overflow: auto;
  }

  .chat-messages {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 18px;
    overflow-y: auto;
    background: transparent;
    padding: 0;
  }

  .chat-message {
    max-width: 70%;
    min-width: 120px;
    border-radius: 8px;
    padding: 14px 18px;
    font-size: 16px;
    line-height: 1.7;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    word-break: break-all;
    margin-bottom: 8px;
    background: var(--el-bg-color-overlay);

    &.user {
      align-self: flex-end;
      background: linear-gradient(
        135deg,
        var(--el-color-primary-light-9) 60%,
        var(--el-color-primary-light-8) 100%
      );
      color: var(--el-text-color-primary);

      .chat-meta {
        font-weight: bold;
        color: var(--el-color-primary);
        margin-bottom: 6px;
      }
    }

    &.assistant {
      align-self: flex-start;
      background: linear-gradient(135deg, var(--el-bg-color-overlay) 60%, #f6f8fa 100%);
      color: var(--el-text-color-primary);

      .chat-meta {
        font-weight: bold;
        color: var(--el-color-success);
        margin-bottom: 6px;
      }
    }

    &.system {
      align-self: center;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-secondary);
      font-size: 14px;
      box-shadow: none;

      .chat-meta {
        color: var(--el-text-color-disabled);
      }
    }
  }
}

// 滚动条
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

// 滚动条的样式
.chat-messages::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 3px;
}
</style>
