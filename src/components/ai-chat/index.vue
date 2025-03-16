<template>
    <div class="flex-1 mx-2 mt-20 mb-2 conversation-list">
        <div class="group flex flex-col px-4 py-3 hover:bg-slate-100 rounded-lg" v-for="item of conversations">
            <div class="flex justify-between items-center mb-2">
                <div class="font-bold">{{ getRoleAlias(item.role) }}：</div>
                <chat-copy class="invisible group-hover:visible" :content="item.content" />
            </div>
            <div class="answer flex-1">
                <chat-loading v-if="getLoading(item.content)" />
                <div v-else class="prose text-sm text-slate-600 leading-relaxed" v-html="item.content">
                </div>
            </div>
        </div>
    </div>
    <!-- 发送消息按钮 -->
    <chat-input v-bind="$attrs"></chat-input>
</template>

<script lang='ts' setup>
import { type PropType } from "vue"
import ChatLoading from "./chat-loading.vue"
import ChatCopy from "./chat-copy.vue"
import ChatInput from "./chat-input.vue"

defineProps({
    conversations: {
        type: Array as PropType<AI.Conversation[]>,
        default: () => []
    }
})

const roleAlias = { user: "ME", assistant: "ChatGPT", system: "System" };

const getRoleAlias = (role: AI.Role) => roleAlias[role]

const getLoading = (content: string) => {
    return !!!content
}

</script>
<style lang='less' scoped></style>