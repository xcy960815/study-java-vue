<template>
  <div class="practice-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="practice-card">
          <template #header>
            <div class="card-header">
              <h2>数学练习</h2>
              <div class="stats-display">
                <span class="stat-item">得分: {{ score }}</span>
                <span class="stat-item">连续正确: {{ consecutiveCorrect }}</span>
                <span class="stat-item">本题用时: {{ formatTime(currentQuestionTime) }}</span>
              </div>
            </div>
          </template>

          <div class="practice-content">
            <div class="question-display">
              <h3>问题 {{ currentQuestion + 1 }}/{{ questions.length }}</h3>
              <div class="question">
                <span class="number">{{ questions[currentQuestion].left }}</span>
                <span class="operator">{{ questions[currentQuestion].operator }}</span>
                <span class="number">{{ questions[currentQuestion].right }}</span>
                <span class="equals">=</span>
                <el-input-number
                  v-model="userAnswer"
                  :min="0"
                  :max="10"
                  @keyup.enter="checkAnswer"
                />
              </div>
            </div>

            <div class="visualization">
              <div class="left-side">
                <span
                  v-for="i in questions[currentQuestion].left"
                  :key="'left' + i"
                  class="dot"
                  :class="{ highlight: showVisualization }"
                >
                </span>
              </div>
              <div class="operator">{{ questions[currentQuestion].operator }}</div>
              <div class="right-side">
                <span
                  v-for="i in questions[currentQuestion].right"
                  :key="'right' + i"
                  class="dot"
                  :class="{ highlight: showVisualization }"
                >
                </span>
              </div>
            </div>

            <div class="feedback" v-if="showFeedback">
              <el-alert
                :title="feedbackMessage"
                :type="isCorrect ? 'success' : 'error'"
                :closable="false"
                show-icon
              />
            </div>

            <div class="actions">
              <el-button type="primary" @click="checkAnswer">提交答案</el-button>
              <el-button @click="showVisualization = !showVisualization">
                {{ showVisualization ? '隐藏' : '显示' }}可视化
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getQuestions, submitAnswer, updateProgress } from '@/apis'
import type { StudyJavaQuestionVo, StudyJavaProgressVo } from '@/types/math'

// 定义答题记录接口
interface AnswerRecord {
  questionId: string
  left: number
  operator: string
  right: number
  correctAnswer: number
  userAnswer: number
  timeSpent: number
  isCorrect: boolean
  timestamp: number
}

const questions = ref<StudyJavaQuestionVo[]>([])
const currentQuestion = ref(0)
const userAnswer = ref(0)
const score = ref(0)
const consecutiveCorrect = ref(0)
const showFeedback = ref(false)
const showVisualization = ref(false)
const isCorrect = ref(false)
const currentQuestionTime = ref(0)
let questionTimer: number | null = null

// 存储所有答题记录
const answerRecords = ref<AnswerRecord[]>([])
// 存储练习开始时间
const practiceStartTime = ref<number>(0)
// 存储当前进度
const currentProgress = ref<StudyJavaProgressVo>({
  id: 'default',
  score: 0,
  level: 1,
  consecutiveCorrect: 0,
  createTime: new Date().toISOString(),
  updateTime: new Date().toISOString(),
})

const feedbackMessage = computed(() => {
  if (isCorrect.value) {
    return '回答正确！太棒了！'
  } else {
    return `回答错误。正确答案是 ${questions.value[currentQuestion.value].answer}`
  }
})

const startQuestionTimer = () => {
  currentQuestionTime.value = 0
  questionTimer = window.setInterval(() => {
    currentQuestionTime.value++
  }, 1000)
}

const stopQuestionTimer = () => {
  if (questionTimer) {
    clearInterval(questionTimer)
    questionTimer = null
  }
}

// 获取题目
const fetchQuestions = async () => {
  try {
    const response = await getQuestions(currentProgress.value.level)
    questions.value = response.data
    currentQuestion.value = 0
    userAnswer.value = 0
    startQuestionTimer()
  } catch (error) {
    ElMessage.error('获取题目失败，请重试')
    console.error('获取题目失败:', error)
  }
}

// 记录答题数据
const recordAnswer = () => {
  const record: AnswerRecord = {
    questionId: questions.value[currentQuestion.value].id,
    left: questions.value[currentQuestion.value].left,
    operator: questions.value[currentQuestion.value].operator,
    right: questions.value[currentQuestion.value].right,
    correctAnswer: questions.value[currentQuestion.value].answer,
    userAnswer: userAnswer.value,
    timeSpent: currentQuestionTime.value,
    isCorrect: isCorrect.value,
    timestamp: Date.now(),
  }
  answerRecords.value.push(record)
}

const checkAnswer = async () => {
  const question = questions.value[currentQuestion.value]
  try {
    const response = await submitAnswer(question.id, userAnswer.value)
    isCorrect.value = response.data

    if (isCorrect.value) {
      score.value += 10
      consecutiveCorrect.value += 1
      currentProgress.value.score += 10
      currentProgress.value.consecutiveCorrect += 1

      // 连续答对3题提升难度
      if (currentProgress.value.consecutiveCorrect >= 3) {
        currentProgress.value.level += 1
        currentProgress.value.consecutiveCorrect = 0
      }
    } else {
      consecutiveCorrect.value = 0
      currentProgress.value.consecutiveCorrect = 0
    }

    showFeedback.value = true
    stopQuestionTimer()

    // 记录答题数据
    recordAnswer()

    // 更新进度
    await updateProgress(currentProgress.value)

    setTimeout(async () => {
      if (currentQuestion.value < questions.value.length - 1) {
        currentQuestion.value += 1
        userAnswer.value = 0
        showFeedback.value = false
        showVisualization.value = false
        startQuestionTimer()
      } else {
        // 练习结束，获取新题目
        await fetchQuestions()
        showFeedback.value = false
        showVisualization.value = false
      }
    }, 2000)
  } catch (error) {
    ElMessage.error('提交答案失败，请重试')
    console.error('提交答案失败:', error)
  }
}

// 监听题目变化，重置计时器
watch(currentQuestion, () => {
  stopQuestionTimer()
  startQuestionTimer()
})

onMounted(async () => {
  // 设置练习开始时间
  practiceStartTime.value = Date.now()

  // 获取初始题目
  await fetchQuestions()
})

onUnmounted(() => {
  stopQuestionTimer()
})

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<style lang="less" scoped>
// 定义变量
@primary-color: #409eff;
@success-color: #67c23a;
@spacing-base: 20px;
@font-size-large: 24px;
@border-radius-base: 8px;
@transition-base: all 0.3s;

// 定义混合
.flex-center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

.stat-item() {
  padding: 5px 10px;
  background: rgba(@primary-color, 0.1);
  border-radius: @border-radius-base;
  font-weight: 500;
  min-width: 100px;
  text-align: center;
}

.practice-container {
  padding: @spacing-base;

  .practice-card {
    margin-bottom: @spacing-base;

    .card-header {
      .flex-center();
      justify-content: space-between;

      .stats-display {
        .flex-center();
        gap: @spacing-base;
      }

      .stat-item {
        .stat-item();
      }
    }

    .practice-content {
      text-align: center;

      .question-display {
        margin-bottom: 30px;

        .question {
          .flex-center();
          gap: 10px;
          margin-top: @spacing-base;

          .number,
          .operator,
          .equals {
            font-size: @font-size-large;
          }
        }
      }

      .visualization {
        .flex-center();
        gap: @spacing-base;
        margin: 30px 0;

        .left-side,
        .right-side {
          display: flex;
          gap: 10px;
        }

        .dot {
          width: 30px;
          height: 30px;
          background-color: @primary-color;
          border-radius: 50%;
          transition: @transition-base;

          &.highlight {
            background-color: @success-color;
            transform: scale(1.2);
          }
        }
      }

      .feedback {
        margin: @spacing-base 0;
      }

      .actions {
        margin-top: 30px;
        .flex-center();
        gap: @spacing-base;
      }
    }
  }
}
</style>
