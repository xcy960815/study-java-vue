<template>
  <div class="deepseek-chat">
    <div class="conversation-list">
      conversation-list
    </div>
    <!-- <div
      id="in-progress"
      v-show="inProgress"
      class="pl-4 pr-4 pt-2 flex items-center justify-between text-xs"
    >
      <div class="typing flex items-center">
        <span>Asking</span>
        <div class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
      </div>
      <button
        id="stop-generating-button"
        @click="cancelConversation"
        class="btn btn-primary flex items-center p-1 pr-2 rounded-md ml-5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 mr-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        停止回答
      </button>
    </div>

    <template v-for="conversation in conversations">
      <div
        class="p-4 self-end question-element relative input-background"
      >
        <h3 class="mt-0 flex items-center">
          <img
            class="h-6 w-6"
            src="../../../assets/images/user.svg"
            alt="you"
          />
        </h3>
        <div
          class="overflow-y-auto pt-1 pb-1 pl-3 pr-3 rounded-md"
        >
          {{ conversation.content }}
        </div>
      </div>
    </template> -->
    
    <seed-message
      @seed-question="completions"
    ></seed-message>
    
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { deepseekModule } from '@apis'
import { useRoute } from 'vue-router'
import seedMessage from './seed-message.vue'
defineOptions({
  name: 'deepseek-chat'
})

const route = useRoute()

const parentMessageId = ref<string>('')
const conversations = ref<AI.Conversation[]>([])

/**
 * 流式会话
 */
const completions = async (question:string) => {
  setTimeout(async () => {
    conversations.value =
      await deepseekModule.getAllConversations()
  }, 100)

  const model = route.query.model as string
  const questionOption: AI.Gpt.GetAnswerOptions = {
    parentMessageId: parentMessageId.value,
    systemMessage: '你是一个聊天机器人',
    requestParams: {
      model
    },
    onProgress(partialResponse) {
      console.log("deepSeekConfig.onProgress", partialResponse);
      
    }
  }

  const response = await deepseekModule.completions(
    question,
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

onMounted(() => {
  console.log(1111)
})
</script>
<style lang="less" scoped>
.deepseek-chat {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .conversation-list {
    flex: 1;
  }
}
</style>
