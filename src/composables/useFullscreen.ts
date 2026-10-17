import { onBeforeUnmount, ref } from 'vue'

/**
 * 浏览器全屏状态 Hook（React 版同源逻辑）：返回当前是否全屏与切换函数。
 * 组件卸载时自动移除监听，避免状态残留。
 */
export const useFullscreen = () => {
  const fullscreen = ref(Boolean(document.fullscreenElement))

  const syncFullscreenState = () => {
    fullscreen.value = Boolean(document.fullscreenElement)
  }

  document.addEventListener('fullscreenchange', syncFullscreenState)
  document.addEventListener('mozfullscreenchange', syncFullscreenState)
  document.addEventListener('webkitfullscreenchange', syncFullscreenState)
  document.addEventListener('MSFullscreenChange', syncFullscreenState)

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', syncFullscreenState)
    document.removeEventListener('mozfullscreenchange', syncFullscreenState)
    document.removeEventListener('webkitfullscreenchange', syncFullscreenState)
    document.removeEventListener('MSFullscreenChange', syncFullscreenState)
  })

  async function toggleFullscreen(): Promise<void> {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      return
    }
    await document.documentElement.requestFullscreen()
  }

  return { fullscreen, toggleFullscreen }
}
