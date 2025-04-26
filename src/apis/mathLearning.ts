import { request } from '@/utils/request'

export interface Question {
  left: number
  operator: string
  right: number
  answer: number
}

export interface WrongQuestion extends Question {
  wrongAnswer: number
  date: string
}

export const getQuestions = (level: number) => {
  return request({
    url: '/api/math/questions',
    method: 'get',
    params: { level },
  })
}

export const submitAnswer = (questionId: string, answer: number) => {
  return request({
    url: '/api/math/submit',
    method: 'post',
    data: { questionId, answer },
  })
}

export const getWrongQuestions = () => {
  return request({
    url: '/api/math/wrong-questions',
    method: 'get',
  })
}

export const updateProgress = (progress: {
  score: number
  level: number
  consecutiveCorrect: number
}) => {
  return request({
    url: '/api/math/progress',
    method: 'post',
    data: progress,
  })
}
