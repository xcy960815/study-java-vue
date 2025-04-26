<template>
  <div class="wrong-questions-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="wrong-questions-card">
          <template #header>
            <div class="card-header">
              <h2>错题本</h2>
              <el-button type="primary" @click="startReview">开始复习</el-button>
            </div>
          </template>

          <div class="wrong-questions-content">
            <el-table :data="wrongQuestions" style="width: 100%">
              <el-table-column prop="question" label="题目" width="180">
                <template #default="{ row }">
                  {{ row.left }} {{ row.operator }} {{ row.right }} = ?
                </template>
              </el-table-column>
              <el-table-column prop="correctAnswer" label="正确答案" width="120">
                <template #default="{ row }">
                  {{ row.answer }}
                </template>
              </el-table-column>
              <el-table-column prop="wrongAnswer" label="你的答案" width="120">
                <template #default="{ row }">
                  {{ row.wrongAnswer }}
                </template>
              </el-table-column>
              <el-table-column prop="date" label="日期" width="180">
                <template #default="{ row }">
                  {{ row.date }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button type="text" @click="practiceQuestion(row)">练习</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const wrongQuestions = ref([
  {
    left: 3,
    operator: '+',
    right: 2,
    answer: 5,
    wrongAnswer: 4,
    date: '2024-04-26',
  },
  {
    left: 4,
    operator: '-',
    right: 1,
    answer: 3,
    wrongAnswer: 2,
    date: '2024-04-25',
  },
])

const startReview = () => {
  router.push('/math-learning/practice')
}

const practiceQuestion = (question: any) => {
  // 这里可以跳转到练习页面，并传入特定题目
  router.push({
    path: '/math-learning/practice',
    query: { question: JSON.stringify(question) },
  })
}
</script>

<style scoped>
.wrong-questions-container {
  padding: 20px;
}

.wrong-questions-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrong-questions-content {
  margin-top: 20px;
}
</style>
