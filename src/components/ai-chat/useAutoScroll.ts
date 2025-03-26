import { onMounted, ref, watch, nextTick, onUnmounted } from "vue"
import { throttle } from "@/plugins/function-decorator"
interface UseAutoScrollParams {
    readonly props: {
        readonly conversations: AI.Conversation[];
        readonly conversation: AI.Gpt.AssistantConversation | null;
        readonly roleAlias: Record<"system" | "user" | "assistant", string>;
    }
}

/**
 * 
 * @param param0 
 * @returns 
 */
export function useAutoScroll({ props }: UseAutoScrollParams) {

    const conversationListRef = ref<HTMLDivElement | null>(null)

    /**
     * 滚动到最底部
     */
    watch(() => props.conversation?.content, () => {
        const currentConversationNode = conversationListRef.value?.lastChild as HTMLDivElement
        if (!currentConversationNode || !autoScroll.value) return
        currentConversationNode.scrollIntoView && currentConversationNode.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
        });
    })

    const autoScroll = ref(true)

    /**
     * 监听用户滚动事件 如果用户手动参与滚动 那么不自动滚动
     * @param {WheelEvent | TouchEvent} event 
     */
    const scrollEvent = (_event: WheelEvent | TouchEvent) => {
        if (conversationListRef.value) {
            // 判断是否滚动到底
            if (conversationListRef.value.scrollTop + conversationListRef.value.clientHeight >= conversationListRef.value.scrollHeight) {
                // 到底了
                autoScroll.value = true
                console.log("到底了");
            } else {
                // 没到底
                autoScroll.value = false
                console.log("没到底");
            }
        } else {
            autoScroll.value = true
        }
    }

    /**
     * 初始化滚动事件
     */
    const initScrollEvent = () => {
        nextTick(() => {
            conversationListRef.value?.addEventListener("wheel", throttle(scrollEvent, 50), { passive: true });
            conversationListRef.value?.addEventListener("touchmove", throttle(scrollEvent, 50), { passive: true });
        })
    }

    const unInitScrollEvent = () => {
        conversationListRef.value?.removeEventListener("wheel", scrollEvent);
        conversationListRef.value?.removeEventListener("touchmove", scrollEvent);
    }
    onMounted(() => {
        initScrollEvent()
    })
    onUnmounted(() => {
        unInitScrollEvent()
    })
    return {
        conversationListRef
    }
}