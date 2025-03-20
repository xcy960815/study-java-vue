<template>
  <!-- 会话列表 -->
  <div class="flex-1 my-2 conversation-list">
    <!-- 历史会话 -->
    <div
      class="history-conversation group flex flex-col px-4 py-3 hover:bg-slate-100 rounded-lg"
      v-for="item of conversations"
      :key="item.messageId"
    >
      <div class="flex justify-between items-center mb-2">
        <div class="font-bold">{{ getRoleAlias(item.role) }}：</div>
        <chat-copy class="invisible group-hover:visible" :content="item.content" />
      </div>
      <div class="answer flex-1">
        <div class="prose text-sm text-slate-600 leading-relaxed" v-html="item.content"></div>
      </div>
    </div>
    <!-- 当前会话 -->
    <div
      class="current-conversation group flex flex-col px-4 py-3 hover:bg-slate-100 rounded-lg"
      v-if="!!conversation"
      :key="conversation.messageId"
    >
      <div class="flex justify-between items-center mb-2">
        <div class="font-bold">{{ getRoleAlias(conversation.role) }}：</div>
        <chat-copy class="invisible group-hover:visible" :content="conversation.content" />
      </div>
      <div class="answer flex-1">
        <chat-thinking v-if="getLoading(conversation)" />
        <div class="prose text-sm text-slate-600 leading-relaxed" v-html="conversation.content"></div>
      </div>
    </div>
  </div>
  <!-- 问题&发送消息按钮 -->
  <chat-input :conversation="conversation" v-bind="$attrs"></chat-input>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import ChatThinking from './chat-thinking.vue'
import ChatCopy from './chat-copy.vue'
import ChatInput from './chat-input.vue'

const props = defineProps({
  conversations: {
    type: Array as PropType<AI.Conversation[]>,
    default: () => [],
    required: true,
    validaor: (val: AI.Conversation[]) => val.length > 0
  },
  conversation: {
    type: Object as PropType<AI.Gpt.AssistantConversation | null>,
    default: () => {}
  },
  roleAlias: {
    type: Object as PropType<Record<AI.Role, string>>,
    default: () => {
      return {
        user: 'ME',
        assistant: 'ChatGPT',
        system: 'System'
      }
    }
  }
})
/* 角色别名 */
const defaultRoleAlias = { user: 'ME', assistant: 'ChatGPT', system: 'System' }

const getRoleAlias = (role: AI.Role) => {
  return props.roleAlias[role] || defaultRoleAlias[role]
}

const getLoading = (conversation: AI.Gpt.AssistantConversation) => {
  return !!conversation.thinking
}
</script>
<style lang="less" scoped></style>
