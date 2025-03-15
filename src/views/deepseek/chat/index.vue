<template>
  <div class="deepseek-chat">
    <div class="flex-1 mx-2 mt-20 mb-2 conversation-list" >
      <div
        class="group flex flex-col px-4 py-3 hover:bg-slate-100 rounded-lg"
        v-for="item of conversations"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold">{{ roleAlias[item.role] }}：</div>
          <chat-copy class="invisible group-hover:visible" :content="item.content" />
        </div>
        <div>
          <div
            class="prose text-sm text-slate-600 leading-relaxed"
            v-if="item.content"
            v-html="currentContent"
            ></div>
          <chat-loding v-else />
        </div>
      </div>
    </div>
    <!-- 发送消息按钮 -->
    <seed-message
      @seed-question="completions"
      @cancel-conversation="cancelConversation"
    ></seed-message>
    
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { deepseekModule } from '@apis'
import { useRoute } from 'vue-router'
import seedMessage from './seed-message.vue'
import ChatLoding from './chat-loding.vue'
import ChatCopy from './chat-copy.vue'
defineOptions({
  name: 'deepseek-chat'
})
const roleAlias = { user: "ME", assistant: "ChatGPT", system: "System" };

const route = useRoute()

const parentMessageId = ref<string>('')
const conversations = ref<AI.Conversation[]>([])
const currentContent = ref<string>('')
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
      currentContent.value = partialResponse.content
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
