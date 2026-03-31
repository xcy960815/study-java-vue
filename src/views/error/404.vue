<template>
  <div class="not-found-page">
    <div class="not-found-page__content">
      <div class="not-found-page__code">404</div>
      <div class="not-found-page__desc">页面不存在</div>
      <div class="not-found-page__info">抱歉，您访问的页面不存在或已被删除</div>
      <el-button class="not-found-page__button" type="primary" @click="goHome">返回首页</el-button>
    </div>
    <div class="not-found-page__illustration">
      <img src="@/assets/images/404.svg" alt="404图片" class="not-found-page__image" />
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

<style lang="less" scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
  background-color: #f5f7fa;

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 40px;
  }

  &__code {
    margin-bottom: 20px;
    color: #409eff;
    font-size: 120px;
    font-weight: bold;
    line-height: 1;
  }

  &__desc {
    margin-bottom: 20px;
    color: #303133;
    font-size: 32px;
    font-weight: bold;
  }

  &__info {
    margin-bottom: 30px;
    color: #606266;
    font-size: 16px;
  }

  &__illustration {
    max-width: 400px;
  }

  &__image {
    width: 100%;
    height: auto;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;

    .not-found-page__content {
      align-items: center;
      margin-right: 0;
      margin-bottom: 30px;
    }

    .not-found-page__code {
      font-size: 80px;
    }

    .not-found-page__desc {
      font-size: 24px;
    }

    .not-found-page__illustration {
      max-width: 300px;
    }
  }
}
</style>
