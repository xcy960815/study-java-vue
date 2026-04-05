<template>
  <div class="ai-chat-container flex flex-col h-full">
    <div
      ref="conversationListRef"
      class="flex-1 my-2 conversation-list overflow-y-auto"
      @scroll="handleScroll"
    >
      <chat-message-list
        :conversation-list="conversationList"
        :current-conversation="currentConversation"
        :loading-svg="loadingSvg"
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
import { computed } from 'vue'
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

// 常量定义
const LOADING_SVG =
  "data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Ccircle cx='12' cy='12' r='0' fill='currentColor'%3E%3Canimate id='svgSpinnersPulse30' fill='freeze' attributeName='r' begin='0;svgSpinnersPulse32.begin+0.4s' calcMode='spline' dur='1.2s' keySplines='.52,.6,.25,.99' values='0;11'/%3E%3Canimate fill='freeze' attributeName='opacity' begin='0;svgSpinnersPulse32.begin+0.4s' calcMode='spline' dur='1.2s' keySplines='.52,.6,.25,.99' values='1;0'/%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='0' fill='currentColor'%3E%3Canimate id='svgSpinnersPulse31' fill='freeze' attributeName='r' begin='svgSpinnersPulse30.begin+0.4s' calcMode='spline' dur='1.2s' keySplines='.52,.6,.25,.99' values='0;11'/%3E%3Canimate fill='freeze' attributeName='opacity' begin='svgSpinnersPulse30.begin+0.4s' calcMode='spline' dur='1.2s' keySplines='.52,.6,.25,.99' values='1;0'/%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='0' fill='currentColor'%3E%3Canimate id='svgSpinnersPulse32' fill='freeze' attributeName='r' begin='svgSpinnersPulse30.begin+0.8s' calcMode='spline' dur='1.2s' keySplines='.52,.6,.25,.99' values='0;11'/%3E%3Canimate fill='freeze' attributeName='opacity' begin='svgSpinnersPulse30.begin+0.8s' calcMode='spline' dur='1.2s' keySplines='.52,.6,.25,.99' values='1;0'/%3E%3C/circle%3E%3C/svg%3E"

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

/**
 * 加载动画
 */
const loadingSvg = computed(() => LOADING_SVG)

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
