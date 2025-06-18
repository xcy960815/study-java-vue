import { onMounted, ref, watch, nextTick, onUnmounted } from 'vue'
import { throttle } from '@/plugins/function-decorator'

interface UseAutoScrollParams {
  readonly props: {
    readonly conversationList: AI.Conversation[]
    readonly roleAlias: Record<'system' | 'user' | 'assistant', string>
  }
}

/**
 *
 * @param param0
 * @returns
 */
export function useAutoScroll({ props }: UseAutoScrollParams) {
  const conversationListRef = ref<HTMLDivElement | null>(null)
  const autoScroll = ref(true)
  const isUserScrolling = ref(false)
  const lastScrollTop = ref(0)
  const scrollTimeout = ref<number | null>(null)

  /**
   * 检查是否滚动到底部
   */
  const isScrolledToBottom = () => {
    if (!conversationListRef.value) return true
    const { scrollTop, scrollHeight, clientHeight } = conversationListRef.value
    // 允许 5px 的误差
    return Math.abs(scrollHeight - scrollTop - clientHeight) < 5
  }

  /**
   * 滚动到底部
   */
  const scrollToBottom = () => {
    if (!conversationListRef.value || !autoScroll.value || isUserScrolling.value) return
    nextTick(() => {
      conversationListRef.value?.scrollTo({
        top: conversationListRef.value.scrollHeight,
        behavior: 'smooth',
      })
    })
  }

  /**
   * 监听内容变化，自动滚动
   */
  // watch(
  //   () => props.conversation?.content,
  //   () => {
  //     if (autoScroll.value && !isUserScrolling.value) {
  //       scrollToBottom()
  //     }
  //   }
  // )

  /**
   * 处理滚动事件
   */
  const handleScroll = throttle((event: Event) => {
    if (!conversationListRef.value) return

    const currentScrollTop = conversationListRef.value.scrollTop
    const isScrollingUp = currentScrollTop < lastScrollTop.value

    // 更新滚动状态
    isUserScrolling.value = true
    lastScrollTop.value = currentScrollTop

    // 清除之前的定时器
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
    }

    // 如果滚动到底部，恢复自动滚动
    if (isScrolledToBottom()) {
      autoScroll.value = true
      // 延迟重置用户滚动状态
      scrollTimeout.value = window.setTimeout(() => {
        isUserScrolling.value = false
      }, 500)
    } else if (isScrollingUp) {
      // 向上滚动时，禁用自动滚动
      autoScroll.value = false
      // 延迟重置用户滚动状态
      scrollTimeout.value = window.setTimeout(() => {
        isUserScrolling.value = false
      }, 500)
    }
  }, 100)

  /**
   * 初始化滚动事件
   */
  const initScrollEvent = () => {
    nextTick(() => {
      conversationListRef.value?.addEventListener('scroll', handleScroll, { passive: true })
    })
  }

  /**
   * 清理滚动事件
   */
  const unInitScrollEvent = () => {
    conversationListRef.value?.removeEventListener('scroll', handleScroll)
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
    }
  }

  onMounted(() => {
    initScrollEvent()
  })

  onUnmounted(() => {
    unInitScrollEvent()
  })

  return {
    conversationListRef,
  }
}
