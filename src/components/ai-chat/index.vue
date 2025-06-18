<template>
  <div class="ai-chat-container flex flex-col h-full">
    <!-- 会话列表 -->
    <div
      ref="conversationListRef"
      class="flex-1 my-2 conversation-list overflow-y-auto"
      @scroll="handleScroll"
    >
      <!-- 历史会话 -->
      <transition-group name="conversation-fade">
        <div
          v-for="conversation of conversations"
          :key="conversation.messageId"
          class="history-conversation group flex flex-col px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg mb-2 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex justify-between items-center mb-2">
            <div class="font-bold text-slate-700 dark:text-slate-200">
              {{ getRoleAlias(conversation.role) }}：
            </div>
            <chat-copy
              class="invisible group-hover:visible transition-opacity duration-200"
              :content="conversation.content"
            />
          </div>
          <div class="answer-wrapper flex-1">
            <div
              class="prose-wrapper flex flex-col text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
              v-html="renderMarkdownText(conversation.content)"
            />
          </div>
        </div>
      </transition-group>

      <!-- 当前会话 -->
      <transition name="conversation-fade">
        <div
          v-if="currentConversation"
          class="current-conversation group flex flex-col px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg mb-2 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex justify-between items-center mb-2">
            <div class="font-bold text-slate-700 dark:text-slate-200">
              {{ getRoleAlias(currentConversation.role) }}：
            </div>
            <chat-copy
              class="invisible group-hover:visible transition-opacity duration-200"
              :content="currentConversation.content"
            />
          </div>
          <div class="answer-wrapper flex-1">
            <chat-thinking v-if="showThinking(currentConversation)" />
            <div
              class="prose-wrapper flex flex-col text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
              v-html="renderMarkdownText(currentConversation.content)"
            />
            <img
              v-if="showAsking(currentConversation)"
              :src="loadingSvg"
              class="w-6 h-6 animate-pulse"
              alt="loading"
            />
          </div>
        </div>
      </transition>
    </div>

    <!-- 问题&发送消息按钮 -->
    <chat-input :conversation="currentConversation" v-bind="$attrs" @send="handleSend" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useCopyCode } from './useCopyCode'
import { useAutoScroll } from './useAutoScroll'
import { renderMarkdownText } from '@plugins/markdown'
import type { PropType } from 'vue'
import ChatThinking from './chat-thinking.vue'
import ChatCopy from './chat-copy.vue'
import ChatInput from './chat-input.vue'
import '../../plugins/markdown.scss'
import 'highlight.js/styles/github-dark.css'

// 常量定义
const LOADING_SVG =
  "data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Ccircle cx='12' cy='12' r='0' fill='currentColor'%3E%3Canimate id='svgSpinnersPulse30' fill='freeze' attributeName='r' begin='0;svgSpinnersPulse32.begin+0.4s' calcMode='spline' dur='1.2s' keySplines='.52,.6,.25,.99' values='0;11'/%3E%3Canimate fill='freeze' attributeName='opacity' begin='0;svgSpinnersPulse32.begin+0.4s' calcMode='spline' dur='1.2s' keySplines='.52,.6,.25,.99' values='1;0'/%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='0' fill='currentColor'%3E%3Canimate id='svgSpinnersPulse31' fill='freeze' attributeName='r' begin='svgSpinnersPulse30.begin+0.4s' calcMode='spline' dur='1.2s' keySplines='.52,.6,.25,.99' values='0;11'/%3E%3Canimate fill='freeze' attributeName='opacity' begin='svgSpinnersPulse30.begin+0.4s' calcMode='spline' dur='1.2s' keySplines='.52,.6,.25,.99' values='1;0'/%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='0' fill='currentColor'%3E%3Canimate id='svgSpinnersPulse32' fill='freeze' attributeName='r' begin='svgSpinnersPulse30.begin+0.8s' calcMode='spline' dur='1.2s' keySplines='.52,.6,.25,.99' values='0;11'/%3E%3Canimate fill='freeze' attributeName='opacity' begin='svgSpinnersPulse30.begin+0.8s' calcMode='spline' dur='1.2s' keySplines='.52,.6,.25,.99' values='1;0'/%3E%3C/circle%3E%3C/svg%3E"

// Props 定义
const props = defineProps({
  conversations: {
    type: Array as PropType<AI.Conversation[]>,
    default: () => [],
    required: true,
    validator: (val: AI.Conversation[]) => Array.isArray(val),
  },
  conversation: {
    type: Object as PropType<AI.Gpt.AssistantConversation | null>,
    default: () => null,
  },
  roleAlias: {
    type: Object as PropType<Record<AI.Role, string>>,
    default: () => ({
      user: 'ME',
      assistant: 'ChatGPT',
      system: 'System',
    }),
  },
})

// Emits 定义
const emit = defineEmits<{
  (e: 'send', message: string): void
  (e: 'scroll', event: Event): void
}>()

// 计算属性
const currentConversation = computed(() => props.conversation)
const loadingSvg = computed(() => LOADING_SVG)

// 默认角色别名
const defaultRoleAlias: Record<AI.Role, string> = {
  user: 'ME',
  assistant: 'ChatGPT',
  system: 'System',
}

// 方法定义
const getRoleAlias = (role: AI.Role): string => {
  return props.roleAlias[role] || defaultRoleAlias[role]
}

const showThinking = (conversation: AI.Gpt.AssistantConversation): boolean => {
  return Boolean(conversation.thinking)
}

const showAsking = (conversation: AI.Gpt.AssistantConversation): boolean => {
  return !conversation.done && !conversation.thinking
}

const handleScroll = (event: Event) => {
  emit('scroll', event)
}

const handleSend = (message: string) => {
  emit('send', message)
}

// 生命周期钩子
const { conversationListRef } = useAutoScroll({ props })
useCopyCode()

onMounted(() => {
  // 初始化逻辑
})

onUnmounted(() => {
  // 清理逻辑
})
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

.prose-wrapper {
  @apply max-w-none;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-bold text-slate-800 dark:text-slate-200 mb-4;
  }

  h1 {
    @apply text-2xl;
  }
  h2 {
    @apply text-xl;
  }
  h3 {
    @apply text-lg;
  }
  h4 {
    @apply text-base;
  }
  h5 {
    @apply text-sm;
  }
  h6 {
    @apply text-xs;
  }

  ul,
  ol {
    @apply pl-6 space-y-1 my-4;
  }

  li {
    @apply leading-7 list-disc;

    > code {
      @apply bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm;
    }
  }

  p {
    @apply leading-7 my-4;

    > code {
      @apply bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm;
    }

    img {
      @apply inline-block max-w-full my-2;
    }
  }

  blockquote {
    @apply pl-4 border-l-4 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 my-4;
  }

  a {
    @apply text-blue-600 dark:text-blue-400 font-medium underline;
  }

  table {
    @apply w-full border-collapse my-4;
  }

  th,
  td {
    @apply p-2 text-left border border-slate-300 dark:border-slate-600;
  }

  th {
    @apply bg-slate-100 dark:bg-slate-800 font-bold;
  }

  tr {
    @apply hover:bg-slate-50 dark:hover:bg-slate-700/50;
  }

  pre {
    @apply bg-slate-800 dark:bg-slate-900 text-slate-100 p-4 rounded-lg my-4 overflow-x-auto;
  }

  code {
    @apply font-mono text-sm;
  }

  hr {
    @apply my-6 border-t border-slate-200 dark:border-slate-700;
  }
}

// 动画
.conversation-fade-enter-active,
.conversation-fade-leave-active {
  @apply transition-all duration-300;
}

.conversation-fade-enter-from,
.conversation-fade-leave-to {
  @apply opacity-0 transform translate-y-4;
}
</style>
