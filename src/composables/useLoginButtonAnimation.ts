import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * 登录按钮躲避动画 Composable
 * @param isFormIncomplete 表单是否未完成 (Computed or Ref boolean)
 * @param buttonRef 按钮的 Vue Ref 实例
 */
export const useLoginButtonAnimation = (isFormIncomplete: Ref<boolean>, buttonRef: Ref<any>) => {
  onMounted(() => {
    const button = buttonRef.value?.$el || buttonRef.value
    if (!button) return

    const distanceBetween = (p1x: number, p1y: number, p2x: number, p2y: number) => {
      const dx = p1x - p2x
      const dy = p1y - p2y
      return Math.sqrt(dx * dx + dy * dy)
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isFormIncomplete.value) {
        button.style.transform = ''
        button.style.boxShadow = ''
        return
      }

      const radius = Math.max(button.offsetWidth * 0.75, button.offsetHeight * 0.75, 100)
      const rect = button.getBoundingClientRect()
      const bx = rect.left + rect.width / 2
      const by = rect.top + rect.height / 2

      const dist = distanceBetween(event.clientX, event.clientY, bx, by) * 2
      const angle = Math.atan2(event.clientY - by, event.clientX - bx)

      const ox = -1 * Math.cos(angle) * Math.max(radius - dist, 0)
      const oy = -1 * Math.sin(angle) * Math.max(radius - dist, 0)

      const rx = oy / 2
      const ry = -ox / 2

      button.style.transition = `all 0.1s ease`
      button.style.transform = `translate(${ox}px, ${oy}px) rotateX(${rx}deg) rotateY(${ry}deg)`
      button.style.boxShadow = `0px ${Math.abs(oy)}px ${(Math.abs(oy) / radius) * 40}px rgba(0,0,0,0.15)`
    }

    document.addEventListener('mousemove', handleMouseMove)

    onUnmounted(() => {
      document.removeEventListener('mousemove', handleMouseMove)
    })
  })
}
