<template>
  <div class="ollama-chat">
    <div class="chat-main-card">
      <ai-chat
        :role-alias="roleAlias"
        @completions="completions"
        @cancel-conversation="cancelConversation"
        :conversations="conversations"
        :conversation="conversation"
      >
      </ai-chat>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AiChat from '@components/ai-chat/index.vue'
import { RoleEnum } from '@enums'
import { cloneDeep } from 'lodash'
import { useCompletions } from '@/composables/useCompletions'
defineOptions({
  name: 'ollama-chat',
})
const route = useRoute()

const model = (route.query.model as string) || 'deepseek-r1:14b'
/**
 * 角色别名
 */
const roleAlias = ref<Record<AI.Role, string>>({
  user: 'ME',
  assistant: model,
  system: 'System',
})

/**
 * 会话列表
 */
const conversations = ref<AI.Conversation[]>([])

/**
 * 当前会话
 */
const conversation = ref<AI.Gpt.AssistantConversation | null>(null)

const { Completions } = useCompletions()
const ollamaModel = new Completions({
  apiKey: '',
  apiBaseUrl: import.meta.env.VITE_API_DOMAIN_PREFIX,
  completionsUrl: '/ollama/completions',
  requestParams: {
    model: model,
  },
})

const parentMessageId = ref('')

/**
 * 流式会话
 */
const completions = async (question: string) => {
  setTimeout(async () => {
    conversations.value = await ollamaModel.getAllConversations()
    console.log('conversations', conversations.value)
  })
  const response = await ollamaModel.completions(question, {
    parentMessageId: parentMessageId.value,
    systemMessage: '你是一个聊天机器人',
    requestParams: {
      model,
    },
    onProgress(partialResponse) {
      if (conversations.value.length > 0) {
        conversations.value[conversations.value.length - 1] = cloneDeep(partialResponse)
      }
    },
  })
  if (!!response.done) {
    conversations.value = await ollamaModel.getAllConversations()
    parentMessageId.value = response.parentMessageId
  }
}
/**
 * 取消当前会话
 */
const cancelConversation = () => {
  ollamaModel.cancelConversation('用户手动取消会话')
}
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
    background: #fff;
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

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 3px;
}
</style>
