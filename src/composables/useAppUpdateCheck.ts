import { onBeforeUnmount, ref } from 'vue'

/** 轮询间隔（毫秒） */
const CHECK_INTERVAL_MS = 60_000
/** 基线捕获失败后的重试间隔（毫秒） */
const BASELINE_RETRY_MS = 30_000
/** index.html 主入口脚本的文件名模式（构建产物唯一 hash 即版本指纹，React 版同源） */
const ENTRY_PATTERN = /index(?:-es)?-[A-Za-z0-9_-]+\.js/
/** 开发环境预览更新提示使用的查询参数 */
const PREVIEW_QUERY = 'versionNoticePreview'
const PREVIEW_VALUE = '1'

/** 拉取当前 index.html 并提取主入口 token，网络失败返回 null（不判定为有更新） */
async function fetchCurrentEntryToken(): Promise<string | null> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}index.html?h=${Date.now()}`, {
      cache: 'no-store',
    })
    if (!response.ok) {
      return null
    }
    const html = await response.text()
    return html.match(ENTRY_PATTERN)?.[0] ?? null
  } catch {
    return null
  }
}

/**
 * 应用更新检测 Composable（与 React 版同源的版本指纹轮询）：
 * 以页面加载时 index.html 的主入口 hash 为基线，周期比对；发现差异即认为有新版本，
 * 由右上角脉冲圆点提示用户刷新。支持 ?versionNoticePreview=1 预览。
 */
export const useAppUpdateCheck = () => {
  const hasUpdate = ref(
    new URLSearchParams(window.location.search).get(PREVIEW_QUERY) === PREVIEW_VALUE
  )
  /** 首次采样到的主入口 token，作为版本基线 */
  const baseline = ref<string | null>(null)

  let intervalId: number | null = null
  let retryId: number | null = null
  let disposed = false

  function startPolling(entryToken: string): void {
    if (disposed) {
      return
    }
    baseline.value = entryToken
    intervalId = window.setInterval(async () => {
      if (document.hidden || disposed) {
        return
      }
      const latest = await fetchCurrentEntryToken()
      if (latest && !disposed && baseline.value && latest !== baseline.value) {
        hasUpdate.value = true
      }
    }, CHECK_INTERVAL_MS)
  }

  onBeforeUnmount(() => {
    disposed = true
    if (intervalId !== null) {
      window.clearInterval(intervalId)
    }
    if (retryId !== null) {
      window.clearTimeout(retryId)
    }
  })

  void (async () => {
    const current = await fetchCurrentEntryToken()
    if (disposed) {
      return
    }
    if (current) {
      startPolling(current)
      return
    }
    // 网络失败只影响首次基线捕获，延迟重试；不把失败误判为「有更新」
    retryId = window.setTimeout(async () => {
      const retry = await fetchCurrentEntryToken()
      if (!disposed && retry) {
        startPolling(retry)
      }
    }, BASELINE_RETRY_MS)
  })()

  return { hasUpdate }
}
