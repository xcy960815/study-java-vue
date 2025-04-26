export interface StudyJavaQuestionVo {
  id: string
  left: number
  operator: string
  right: number
  answer: number
  createTime: string
  updateTime: string
}

export interface StudyJavaWrongQuestionVo {
  id: string
  questionId: string
  wrongAnswer: number
  createTime: string
  updateTime: string
}

export interface StudyJavaProgressVo {
  id: string
  score: number
  level: number
  consecutiveCorrect: number
  createTime: string
  updateTime: string
}
