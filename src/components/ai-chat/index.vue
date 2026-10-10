<template>
  <div class="ai-chat-container flex flex-col h-full">
    <div
      ref="conversationListRef"
      class="flex-1 my-2 conversation-list overflow-y-auto"
      @scroll="handleScroll"
    >
      <chat-message-list
        :conversation-list="conversationList"
        :render-content="renderContent"
        :role-alias="roleAlias"
      />
    </div>
    <chat-input
      :conversation="currentConversation"
      v-bind="$attrs"
      @send="handleSend"
      @cancel-conversation="handleCancelConversation"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

import { useCopyCode } from './useCopyCode'
import { useAutoScroll } from './useAutoScroll'
import { defaultChatMessageRenderer } from './chat-message-renderer'

import ChatInput from './chat-input.vue'
import ChatMessageList from './chat-message-list.vue'

import '../../plugins/markdown.scss'
import 'highlight.js/styles/github-dark.css'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  conversationList: {
    type: Array as PropType<AI.Conversation[]>,
    default: () => [],
    required: true,
    validator: (val: AI.Conversation[]) => Array.isArray(val),
  },
  currentConversation: {
    type: Object as PropType<AI.Gpt.AssistantConversation | null>,
    default: null,
  },
  roleAlias: {
    type: Object as PropType<Partial<Record<AI.Role, string>>>,
    default: () => ({
      user: 'ME',
      assistant: 'ChatGPT',
      system: 'System',
    }),
  },
  renderContent: {
    type: Function as PropType<AI.ContentTransformer>,
    default: defaultChatMessageRenderer,
  },
})

// Emits 定义
const emit = defineEmits<{
  (e: 'completions', message: string): void
  (e: 'cancel-conversation'): void
  (e: 'scroll', event: Event): void
}>()

const handleScroll = (event: Event) => {
  emit('scroll', event)
}

const handleSend = (message: string) => {
  emit('completions', message)
}

const handleCancelConversation = () => {
  emit('cancel-conversation')
}

const { conversationListRef } = useAutoScroll({ props })

useCopyCode()
</script>

<style lang="scss" scoped>
.ai-chat-container {
  @apply h-full flex flex-col;
}

.conversation-list {
  &::-webkit-scrollbar {
    @apply w-2;
  }

  &::-webkit-scrollbar-track {
    @apply bg-transparent;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-slate-300 dark:bg-slate-600 rounded-full;
  }
}
</style>
