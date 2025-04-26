import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMathLearningStore = defineStore('mathLearning', () => {
  const score = ref(0)
  const wrongQuestions = ref<any[]>([])
  const currentLevel = ref(1)
  const consecutiveCorrect = ref(0)

  const addWrongQuestion = (question: any) => {
    wrongQuestions.value.push({
      ...question,
      date: new Date().toISOString().split('T')[0],
    })
  }

  const updateScore = (points: number) => {
    score.value += points
  }

  const updateLevel = () => {
    if (consecutiveCorrect.value >= 5) {
      currentLevel.value += 1
      consecutiveCorrect.value = 0
    }
  }

  const resetProgress = () => {
    score.value = 0
    currentLevel.value = 1
    consecutiveCorrect.value = 0
  }

  return {
    score,
    wrongQuestions,
    currentLevel,
    consecutiveCorrect,
    addWrongQuestion,
    updateScore,
    updateLevel,
    resetProgress,
  }
})
