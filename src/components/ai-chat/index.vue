<template>
  <!-- 会话列表 -->
  <div class="flex-1 my-2 conversation-list overflow-y-scroll">
    <!-- 历史会话 -->
    <div class="history-conversation group flex flex-col px-4 py-3 hover:bg-slate-100 rounded-lg"
      v-for="conversation of conversations" :key="conversation.messageId">
      <div class="flex justify-between items-center mb-2">
        <div class="font-bold">{{ getRoleAlias(conversation.role) }}：</div>
        <chat-copy class="invisible group-hover:visible" :content="conversation.content" />
      </div>
      <div class="answer-wrapper flex-1">
        <div class="prose-wrapper flex flex-col text-sm text-slate-600 leading-relaxed"
          v-html="renderMarkdownText(conversation.content)">
        </div>
      </div>
    </div>
    <!-- 当前会话 -->
    <div class="current-conversation group flex flex-col px-4 py-3 hover:bg-slate-100 rounded-lg" v-if="!!conversation"
      :key="conversation.messageId">
      <div class="flex justify-between items-center mb-2">
        <div class="font-bold">{{ getRoleAlias(conversation.role) }}：</div>
        <chat-copy class="invisible group-hover:visible" :content="conversation.content" />
      </div>
      <div class="answer-wrapper flex-1">
        <chat-thinking v-if="showThinking(conversation)" />
        <div class="prose-wrapper flex flex-col text-sm text-slate-600 leading-relaxed"
          v-html="renderMarkdownText(conversation.content)">
        </div>
      </div>
    </div>
  </div>
  <!-- 问题&发送消息按钮 -->
  <chat-input :conversation="conversation" v-bind="$attrs"></chat-input>
</template>

<script lang="ts" setup>
import { renderMarkdownText } from '@plugins/markdown'
import { type PropType } from 'vue'
import ChatThinking from './chat-thinking.vue'
import ChatCopy from './chat-copy.vue'
import ChatInput from './chat-input.vue'

import "../../plugins/markdown.scss"
import "highlight.js/styles/github-dark.css"
const props = defineProps({
  conversations: {
    type: Array as PropType<AI.Conversation[]>,
    default: () => [],
    required: true,
    validaor: (val: AI.Conversation[]) => val.length > 0
  },
  conversation: {
    type: Object as PropType<AI.Gpt.AssistantConversation | null>,
    default: () => { }
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

/**
 * 是否显示 think 动画
 * @param {AI.Gpt.AssistantConversation} conversation 会话
 */
const showThinking = (conversation: AI.Gpt.AssistantConversation) => {
  return !!conversation.thinking
}
</script>
<style lang="scss" scoped>
.prose-wrapper {

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.25em;
  }

  h4 {
    font-size: 1em;
  }

  h5 {
    font-size: 0.875em;
  }

  h6 {
    font-size: 0.85em;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 auto;
    line-height: 1.25;
  }

  & ul,
  ol {
    padding-left: 1.5em;
    line-height: 0.8;
  }

  & ul,
  li,
  ol {
    list-style-position: outside;
    white-space: normal;
  }

  li {
    line-height: 1.7;

    &>code {
      --at-apply: 'bg-#e5e5e5';
      --at-apply: whitespace-pre m-2px px-6px py-2px rounded-5px;
    }
  }

  ol ol {
    padding-left: 20px;
  }

  ul ul {
    padding-left: 20px;
  }

  hr {
    margin: 16px 0;
  }

  a {
    // color: $color-default;
    color: #536fec;
    font-weight: bolder;
    text-decoration: underline;
    padding: 0 3px;
  }

  p {
    line-height: 1.4;

    &>code {
      --at-apply: 'bg-#e5e5e5';
      --at-apply: whitespace-pre mx-4px px-6px py-3px rounded-5px;
    }


    img {
      display: inline-block;
    }
  }

  li>p {
    line-height: 2
  }

  blockquote {
    padding: 10px;
    margin: 20px 0;
    border-left: 5px solid #ccc;
    background-color: #f9f9f9;
    color: #555;

    &>p {
      margin: 0;
    }
  }

  .katex {
    --at-apply: c-primary;
  }

  kbd {
    --at-apply: inline-block align-middle p-0.1em p-0.3em;
    --at-apply: bg-#fcfcfc text-#555;
    --at-apply: border border-solid border-#ccc border-b-#bbb;
    --at-apply: rounded-0.2em shadow-[inset_0_-1px_0_#bbb] text-0.9em;
  }

  table {
    --at-apply: w-fit border-collapse my-16;
  }

  th,
  td {
    --at-apply: p-7 text-left border border-solid border-#ccc;
  }

  th {
    --at-apply: bg-#f2f2f2 font-bold;
  }

  tr:nth-child(even) {
    --at-apply: bg-#f9f9f9;
  }

  tr:hover {
    --at-apply: bg-#f1f1f1;
  }

  // Deepseek 深度思考 Wrapper

  .think-wrapper {
    --at-apply: pl-13 text-14 c-#8b8b8b;
    --at-apply: b-l-2 b-l-solid b-#e5e5e5;

    p {
      --at-apply: line-height-26;
    }
  }
}
</style>
