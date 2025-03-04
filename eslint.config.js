import { defineConfig } from 'eslint-define-config'

export default defineConfig({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended', // ESLint 推荐的基础配置
    'plugin:vue/vue3-recommended', // Vue 3 推荐配置
    'plugin:prettier/recommended' // Prettier 推荐配置
  ],
  rules: {
    // 自定义规则
  }
})
