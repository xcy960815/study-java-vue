<template>
  <div class="math-learning-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <h2>欢迎来到数学学习乐园</h2>
            </div>
          </template>
          <div class="welcome-content">
            <p>让我们一起开始有趣的数学学习之旅吧！</p>
            <el-button type="primary" @click="startLearning">开始学习</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-4">
      <el-col :span="8">
        <el-card class="feature-card">
          <template #header>
            <div class="card-header">
              <h3>基础学习</h3>
            </div>
          </template>
          <div class="feature-content">
            <p>学习1-5的数字和基本数学概念</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="feature-card">
          <template #header>
            <div class="card-header">
              <h3>错题重做</h3>
            </div>
          </template>
          <div class="feature-content">
            <p>通过错题库强化记忆</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="feature-card">
          <template #header>
            <div class="card-header">
              <h3>随机练习</h3>
            </div>
          </template>
          <div class="feature-content">
            <p>通过随机题目巩固知识</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startLearning = () => {
  router.push('/math-learning/basic')
}
</script>

<style lang="less" scoped>
@padding-base: 20px;
@margin-base: 1rem;
@card-header-height: 100%;

.math-learning-container {
  padding: @padding-base;

  .welcome-card {
    margin-bottom: @padding-base;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .welcome-content {
      text-align: center;
      padding: @padding-base;
    }
  }

  .feature-card {
    height: @card-header-height;

    .feature-content {
      padding: @padding-base / 2;
    }
  }

  .mt-4 {
    margin-top: @margin-base;
  }
}
</style>
