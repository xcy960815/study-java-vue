import { ref, readonly, watchEffect, type Ref, type DeepReadonly } from 'vue'

export type AsyncComputedOnCancel = (cancelCallback: () => void) => void

export type AsyncComputedResult<T> = DeepReadonly<Ref<T>>

export function useAsyncComputed<T>(
  callback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>,
  defaultValue?: T
): AsyncComputedResult<T> {
  let counter = 0
  const currentValue = ref(defaultValue) as Ref<T>

  const evaluating = ref<boolean>(false)

  watchEffect(async (onInvalidate) => {
    counter++
    const counterAtBeginning = counter
    const hasFinished = ref(false)

    try {
      Promise.resolve().then(() => {
        evaluating.value = true
      })

      const result = await callback((cancelCallback) => {
        onInvalidate(() => {
          evaluating.value = false
          if (!hasFinished.value) {
            cancelCallback()
          }
        })
      })

      if (counterAtBeginning === counter) {
        currentValue.value = result
      }
    } finally {
      evaluating.value = false
      hasFinished.value = true
    }
  })

  return readonly(currentValue)
}
