<template>
  <!-- 问题输入框 & 发送按钮 -->
  <div class="flex items-center">
    <div class="flex-1 question-wrapper">
      <el-input v-model="question" :autosize="{ minRows: 4 }" class="w-full h-full text-sm rounded-md" type="textarea"
        placeholder="任意问题"></el-input>
    </div>
    <div class="right-6 p-0.5 ml-5 flex items-center gap-2">
      <el-button @click="completions" :disabled="buttonDisabled" v-if="hasCompletionsButton(conversation)" title="提交"
        class="submit-question-button rounded-lg p-0.5">
        <send theme="outline" :size="buttonnConfig.size" fill="#333" />
      </el-button>
      <el-button @click="cancelConversation" v-if="hasCancelConversationButton(conversation)" title="取消"
        class="submit-question-button rounded-lg p-0.5">
        <close-one :size="buttonnConfig.size" :fill="buttonnConfig.fill" />
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Send, CloseOne } from '@icon-park/vue-next'
import { ref, computed, watch, type PropType } from 'vue'
import { type Theme } from '@icon-park/vue-next/lib/runtime'
import { UAParser } from 'ua-parser-js'
import { useMagicKeys, useActiveElement } from '@vueuse/core'
const parser = new UAParser()
const magicKeys = useMagicKeys()
const enterCommand = magicKeys['Meta+Enter']
const enterCtrl = magicKeys['Ctrl+Enter']
interface ButtonnConfig {
  size: number
  fill: string
  theme: Theme
}
defineProps({
  conversation: {
    type: Object as PropType<AI.Gpt.AssistantConversation | null>,
    default: () => { }
  }
})

/**
 * 是否存在提交按钮
 */
const hasCompletionsButton = computed(() => (conversation: AI.Gpt.AssistantConversation | null): boolean => {
  return !conversation
})
/**
 * 是否存在取消会话按钮
 */
const hasCancelConversationButton = computed(() => (conversation: AI.Gpt.AssistantConversation | null): boolean => {
  if (conversation && !conversation.done) return true
  return !!(conversation && conversation.thinking)
})
/**
 * 按钮配置
 */
const buttonnConfig: ButtonnConfig = {
  size: 24,
  fill: '#999',
  theme: 'outline'
}
const emits = defineEmits<{
  (event: 'completions', question: string): void
  (event: 'cancel-conversation'): void
}>()
const question = ref<string>('给我写一段vue3 setup 语法糖的代码')

const buttonDisabled = computed(() => !question.value)
/**
 * 发送问题
 */
const completions = () => {
  emits('completions', question.value)
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
// console.log("isMacos-isMacos",isMacos);


const activeElement = useActiveElement()

const notUsingInput = computed(() => activeElement.value?.tagName !== 'INPUT')

watch(
  () => enterCommand.value,
  () => {
    if (!isMacos || notUsingInput.value) return
    if (!enterCommand.value) {
      emits('completions', question.value)
    }
  },
  {
    deep: true
  }
)

watch(
  () => enterCtrl.value,
  () => {
    if (isMacos || notUsingInput.value) return
    if (!enterCtrl.value) {
      emits('completions', question.value)
    }
  },
  {
    deep: true
  }
)
</script>
<style lang="less" scoped></style>
