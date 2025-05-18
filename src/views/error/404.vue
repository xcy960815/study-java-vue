<template>
  <div class="not-found-container">
    <div class="content">
      <div class="error-code">404</div>
      <div class="error-desc">页面不存在</div>
      <div class="error-info">抱歉，您访问的页面不存在或已被删除</div>
      <el-button type="primary" @click="goHome" class="back-btn">返回首页</el-button>
    </div>
    <div class="illustration">
      <img src="@/assets/images/404.svg" alt="404图片" class="error-img" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
  background-color: #f5f7fa;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 40px;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #409eff;
  line-height: 1;
  margin-bottom: 20px;
}

.error-desc {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}

.error-info {
  font-size: 16px;
  color: #606266;
  margin-bottom: 30px;
}

.back-btn {
  padding: 12px 25px;
  font-size: 16px;
}

.illustration {
  max-width: 400px;
}

.error-img {
  width: 100%;
  height: auto;
}

@media (max-width: 768px) {
  .not-found-container {
    flex-direction: column;
    text-align: center;
  }

  .content {
    align-items: center;
    margin-right: 0;
    margin-bottom: 30px;
  }

  .error-code {
    font-size: 80px;
  }

  .error-desc {
    font-size: 24px;
  }

  .illustration {
    max-width: 300px;
  }
}
</style>
