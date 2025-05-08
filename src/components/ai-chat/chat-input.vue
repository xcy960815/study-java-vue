<template>
  <!-- 问题输入框 & 发送按钮 -->
  <div
    class="chat-input-container flex flex-col gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg"
  >
    <div class="flex-1 question-wrapper">
      <el-input
        v-model="question"
        :autosize="{ minRows: 4, maxRows: 8 }"
        class="w-full h-full text-sm rounded-xl"
        type="textarea"
        :maxlength="2000"
        show-word-limit
        :placeholder="placeholder"
        @keydown.enter.prevent="(e: Event) => handleEnterKey(e as KeyboardEvent)"
      />
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <span class="flex items-center gap-1">
          <i class="i-carbon:code text-base"></i>
          <span>支持代码高亮</span>
        </span>
        <span class="mx-2">|</span>
        <span class="flex items-center gap-1">
          <i class="i-carbon:information text-base"></i>
          <span>支持 Markdown 格式</span>
        </span>
        <span class="mx-2">|</span>
        <span class="flex items-center gap-1">
          <i class="i-carbon:keyboard text-base"></i>
          <span>按 Enter 发送，Shift + Enter 换行</span>
        </span>
      </div>
      <div class="flex items-center gap-3">
        <el-button
          @click="handleSubmit"
          :disabled="buttonDisabled"
          v-if="hasCompletionsButton(conversation)"
          type="primary"
          class="submit-question-button rounded-xl px-6 py-2.5"
        >
          <send theme="filled" :size="buttonnConfig.size" fill="#fff" class="mr-1.5" />
          <span class="text-sm font-medium">发送</span>
        </el-button>
        <el-button
          @click="cancelConversation"
          v-if="hasCancelConversationButton(conversation)"
          class="cancel-button rounded-xl px-6 py-2.5"
        >
          <close-one :size="buttonnConfig.size" :fill="buttonnConfig.fill" class="mr-1.5" />
          <span class="text-sm font-medium">取消</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Send, CloseOne } from '@icon-park/vue-next'
import { ref, computed, watch, type PropType } from 'vue'
import { type Theme } from '@icon-park/vue-next/lib/runtime'
import { UAParser } from 'ua-parser-js'
import { useMagicKeys, useActiveElement } from '@vueuse/core'
import { ElMessage } from 'element-plus'

const parser = new UAParser()
const magicKeys = useMagicKeys()
const enterCommand = magicKeys['Meta+Enter']
const enterCtrl = magicKeys['Ctrl+Enter']

interface ButtonnConfig {
  size: number
  fill: string
  theme: Theme
}

const props = defineProps({
  conversation: {
    type: Object as PropType<AI.Gpt.AssistantConversation | null>,
    default: () => null,
  },
  placeholder: {
    type: String,
    default: '请输入您的问题...',
  },
})

/**
 * 是否存在提交按钮
 */
const hasCompletionsButton = computed(
  () =>
    (conversation: AI.Gpt.AssistantConversation | null): boolean => {
      return !conversation
    }
)

/**
 * 是否存在取消会话按钮
 */
const hasCancelConversationButton = computed(
  () =>
    (conversation: AI.Gpt.AssistantConversation | null): boolean => {
      if (conversation && !conversation.done) return true
      return !!(conversation && conversation.thinking)
    }
)

/**
 * 按钮配置
 */
const buttonnConfig: ButtonnConfig = {
  size: 18,
  fill: '#666',
  theme: 'filled',
}

const emits = defineEmits<{
  (event: 'completions', question: string): void
  (event: 'cancel-conversation'): void
}>()

const question = ref<string>('')

/**
 * 按钮是否禁用
 */
const buttonDisabled = computed(() => {
  const trimmedQuestion = question.value.trim()
  return !trimmedQuestion || trimmedQuestion.length < 2
})

/**
 * 处理回车键
 */
const handleEnterKey = (event: KeyboardEvent) => {
  if (event.shiftKey) return // 允许 Shift + Enter 换行
  if (buttonDisabled.value) return
  handleSubmit()
}

/**
 * 发送问题
 */
const handleSubmit = () => {
  const trimmedQuestion = question.value.trim()
  if (trimmedQuestion.length < 2) {
    ElMessage.warning('问题太短了，请至少输入2个字符')
    return
  }
  emits('completions', trimmedQuestion)
  question.value = '' // 清空输入框
}

/**
 * 取消会话
 */
const cancelConversation = () => {
  emits('cancel-conversation')
}

/**
 * 判断是否为 MacOS
 */
const isMacos = computed(() => {
  const os = parser.getOS()
  if (!os) return false
  return os.name?.includes?.('macos')
})

const activeElement = useActiveElement()
const notUsingInput = computed(() => activeElement.value?.tagName !== 'INPUT')

// 监听 MacOS 快捷键
watch(
  () => enterCommand.value,
  () => {
    if (!isMacos.value || notUsingInput.value) return
    if (!enterCommand.value) {
      handleSubmit()
    }
  },
  { deep: true }
)

// 监听 Windows/Linux 快捷键
watch(
  () => enterCtrl.value,
  () => {
    if (isMacos.value || notUsingInput.value) return
    if (!enterCtrl.value) {
      handleSubmit()
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.chat-input-container {
  @apply border border-slate-200 dark:border-slate-700;
  @apply transition-all duration-300;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 2px 16px 0 rgba(30, 58, 138, 0.04);
  &:focus-within {
    @apply border-blue-500 dark:border-blue-400;
    box-shadow: 0 4px 24px 0 rgba(59, 130, 246, 0.08);
  }
}

.question-wrapper {
  :deep(.el-textarea__inner) {
    /* 强力覆盖 Element Plus 默认样式 */
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    resize: none !important;
    color: #334155 !important;
    font-size: 1rem !important;
    border-radius: 0.75rem !important;
    padding: 1.25rem 1rem !important;
    min-height: 96px !important;
    transition:
      background 0.3s,
      color 0.3s;

    &:hover,
    &:focus {
      background: #f1f5f9 !important;
      color: #1e293b !important;
    }
    &::placeholder {
      color: #94a3b8 !important;
      opacity: 1;
      font-size: 1rem;
    }
  }
  :deep(.el-input__count) {
    background: transparent !important;
    color: #cbd5e1 !important;
    font-size: 0.85rem !important;
    right: 1.5rem !important;
    bottom: 1rem !important;
  }
}

.submit-question-button {
  @apply bg-gradient-to-r from-blue-500 to-blue-600;
  @apply hover:from-blue-600 hover:to-blue-700;
  @apply dark:from-blue-600 dark:to-blue-700;
  @apply dark:hover:from-blue-700 dark:hover:to-blue-800;
  @apply border-0 transition-all duration-300;
  @apply flex items-center justify-center;
  @apply shadow-sm shadow-blue-500/20;
  border-radius: 0.75rem;
  padding: 0.625rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  &:hover {
    @apply shadow-md shadow-blue-500/30;
    transform: translateY(-2px);
  }
  &:disabled {
    @apply from-slate-300 to-slate-400;
    @apply dark:from-slate-600 dark:to-slate-700;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
}

.cancel-button {
  @apply bg-slate-100 hover:bg-slate-200;
  @apply dark:bg-slate-700 dark:hover:bg-slate-600;
  @apply border-0 transition-all duration-300;
  @apply flex items-center justify-center;
  @apply text-slate-600 dark:text-slate-300;
  @apply shadow-sm shadow-slate-200/20;
  border-radius: 0.75rem;
  padding: 0.625rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  &:hover {
    @apply shadow-md shadow-slate-300/30;
    transform: translateY(-2px);
  }
}
</style>
