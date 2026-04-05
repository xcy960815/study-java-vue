<template>
  <div>
    <transition-group name="conversation-fade">
      <div
        v-for="conversation of conversationList"
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
            v-html="renderContent(conversation.content)"
          ></div>
        </div>
      </div>
    </transition-group>

    <transition name="conversation-fade">
      <div
        v-if="currentConversation"
        :key="currentConversation.messageId"
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
          <chat-thinking v-if="Boolean(currentConversation.thinking)" />
          <div
            class="prose-wrapper flex flex-col text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
            v-html="renderContent(currentConversation.content)"
          />
          <img
            v-if="currentConversation.done === true && currentConversation.thinking === true"
            :src="loadingSvg"
            class="w-6 h-6 animate-pulse"
            alt="loading"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

import ChatThinking from './chat-thinking.vue'
import ChatCopy from './chat-copy.vue'

const defaultRoleAlias: Record<AI.Role, string> = {
  user: 'ME',
  assistant: 'ChatGPT',
  system: 'System',
  tool: 'Tool',
  function: 'Function',
}

const props = defineProps({
  conversationList: {
    type: Array as PropType<AI.Conversation[]>,
    default: () => [],
    required: true,
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
    required: true,
  },
  loadingSvg: {
    type: String,
    required: true,
  },
})

const getRoleAlias = (role: AI.Role): string => {
  return props.roleAlias[role] || defaultRoleAlias[role] || role
}
</script>

<style lang="scss" scoped>
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

.conversation-fade-enter-active,
.conversation-fade-leave-active {
  @apply transition-all duration-300;
}

.conversation-fade-enter-from,
.conversation-fade-leave-to {
  @apply opacity-0 transform translate-y-4;
}
</style>
