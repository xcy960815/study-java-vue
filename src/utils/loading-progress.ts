export function updateLoadingProgress(progress: number) {
  const progressBar = document.querySelector('.progress-bar-inner') as HTMLElement
  const progressPercentage = document.querySelector('.progress-percentage') as HTMLElement
  const progressText = document.querySelector('.progress-text') as HTMLElement

  if (progressBar && progressPercentage && progressText) {
    progressBar.style.width = `${progress}%`
    progressPercentage.textContent = `${Math.round(progress)}%`

    // 根据进度更新文本
    if (progress < 30) {
      progressText.textContent = '正在加载基础资源...'
    } else if (progress < 60) {
      progressText.textContent = '正在加载应用模块...'
    } else if (progress < 90) {
      progressText.textContent = '正在初始化应用...'
    } else {
      progressText.textContent = '即将完成...'
    }
  }
}

// 模拟资源加载进度
export function simulateLoadingProgress() {
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 10
    if (progress >= 100) {
      progress = 100
      clearInterval(interval)
    }
    updateLoadingProgress(progress)
  }, 200)
}
