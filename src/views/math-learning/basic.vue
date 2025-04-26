<template>
  <div class="math-basic">
    <el-card class="welcome-card" :body-style="{ padding: '20px' }">
      <div class="welcome-content">
        <div class="character">
          <span class="character-emoji">🧮</span>
        </div>
        <div class="welcome-text">
          <h2>欢迎来到数学世界！</h2>
          <p>让我们开始学习有趣的数学知识吧~</p>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" class="content-row">
      <el-col :span="12">
        <el-card class="number-card" :body-style="{ padding: '20px' }">
          <div class="number-display">
            <div v-for="(num, index) in numbers" :key="index" class="number-item">
              <span class="number">{{ num }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="example-card" :body-style="{ padding: '20px' }">
          <div class="example-display">
            <div v-for="(example, index) in examples" :key="index" class="example-item">
              <span class="example">{{ example }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="action-area">
      <el-button type="primary" size="large" @click="startPractice" class="start-button">
        <span class="button-text">开始练习</span>
        <span class="button-icon">→</span>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const numbers = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const examples = ref(['1 + 1 = 2', '2 + 2 = 4', '3 + 3 = 6', '4 + 4 = 8', '5 + 5 = 10'])

const startPractice = () => {
  router.push('/math-learning/practice')
}
</script>

<style scoped>
.math-basic {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.welcome-card {
  margin-bottom: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.character {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 2s infinite;
}

.character-emoji {
  font-size: 60px;
}

.welcome-text {
  flex: 1;
}

.welcome-text h2 {
  color: #409eff;
  margin-bottom: 10px;
  font-size: 24px;
}

.welcome-text p {
  color: #666;
  font-size: 16px;
}

.content-row {
  margin-bottom: 20px;
}

.number-card,
.example-card {
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  height: 300px;
  overflow-y: auto;
}

.number-display,
.example-display {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 10px;
}

.number-item,
.example-item {
  background: #fff;
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.number-item:hover,
.example-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.number {
  font-size: 24px;
  color: #409eff;
  font-weight: bold;
}

.example {
  font-size: 18px;
  color: #666;
}

.action-area {
  text-align: center;
  margin-top: 30px;
}

.start-button {
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 18px;
  background: linear-gradient(45deg, #409eff, #36d1dc);
  border: none;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.start-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}

.button-text {
  margin-right: 10px;
}

.button-icon {
  display: inline-block;
  animation: slide 1s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes slide {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #409eff;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #36d1dc;
}
</style>
