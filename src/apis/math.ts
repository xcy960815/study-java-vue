import { request } from '@/utils/request'
import type {
  StudyJavaQuestionVo,
  StudyJavaWrongQuestionVo,
  StudyJavaProgressVo,
} from '@/types/math'

// 获取题目
export function getQuestions(level: number) {
  return request.get<StudyJavaQuestionVo[]>('/math/questions', {
    params: { level },
  })
}

// 提交答案
export function submitAnswer(questionId: string, answer: number) {
  return request.post<boolean>('/math/submit', {
    questionId,
    answer,
  })
}

// 获取错题
export function getWrongQuestions() {
  return request.get<StudyJavaWrongQuestionVo[]>('/math/wrong-questions')
}

// 更新进度
export function updateProgress(progress: StudyJavaProgressVo) {
  return request.post<void>('/math/progress', progress)
}
