<template>
  <div class="deepseek-chat">
    <!-- gpt 回答的答案的动画  -->
    <div id="in-progress" v-show="inProgress" class="pl-4 pr-4 pt-2 flex items-center justify-between text-xs">
      <div class="typing flex items-center">
        <span>Asking</span>
        <div class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
      </div>
      <!-- gpt 停止回答的答案的按钮 -->
      <button id="stop-generating-button" @click="cancelConversation"
        class="btn btn-primary flex items-center p-1 pr-2 rounded-md ml-5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-5 h-5 mr-2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        停止回答
      </button>
    </div>

    <template v-for="conversation in conversations">
      <!-- 用户问题 -->
      <div class="p-4 self-end question-element relative input-background">
        <h3 class="mt-0 flex items-center">
          <img class="h-6 w-6" src="../../../assets/images/user.svg" alt="you" />
        </h3>
        <div class="overflow-y-auto pt-1 pb-1 pl-3 pr-3 rounded-md">
          {{ conversation.content }}
        </div>
      </div>
    </template>

    <!-- 问题输入框 -->
    <div class="flex items-center">
      <div class="flex-1 question-wrapper">
        <!-- 问题输入框 -->
        <el-input v-model="question" :autosize="{ minRows: 2}" class="w-full h-full text-sm rounded-md" type="textarea"
          placeholder="任意问题"></el-input>
      </div>
      <!-- 发送问题按钮 -->
      <div class="right-6 p-0.5 ml-5 flex items-center gap-2">
        <el-button @click="completions" title="提交" class="submit-question-button rounded-lg p-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </el-button>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { deepseekModule } from '@apis'
import { useRoute } from 'vue-router'
const route = useRoute()
const question = ref<string>('天为什么是蓝色的？')
const parentMessageId = ref<string>('')
const conversations = ref<AI.Conversation[]>([])
const inProgress = ref<boolean>(false)
/**
 * 流式会话
 */
const completions = async () => {
  setTimeout(async () => {
    conversations.value =
      await deepseekModule.getAllConversations()
    console.log(
      'conversations.value--conversations.value',
      conversations.value
    )
  }, 100)

  const model = route.query.model as string
  const questionOption: AI.Gpt.GetAnswerOptions = {
    parentMessageId: parentMessageId.value,
    systemMessage: '你是一个聊天机器人',
    requestParams: {
      model
    },
    onProgress(partialResponse) { }
  }

  const response = await deepseekModule.completions(
    question.value,
    questionOption
  )
  parentMessageId.value = response.parentMessageId
}
/**
 * 取消会话
 */
const cancelConversation = () => {
  deepseekModule.cancelConversation()
}
</script>
<style lang="less" scoped>
.deepseek-chat {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
