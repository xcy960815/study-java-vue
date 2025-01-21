<template>
  <!-- 切换主题按钮 -->
  <el-link
    class="change-theme-switch"
    @click="handleClickChangeTheme"
    :underline="false"
    type="info"
    >切换主题</el-link
  >

  <!-- 切换主题dialog -->
  <el-dialog
    center
    v-model="themeDialogVisible"
    title="切换主题"
    width="400px"
  >
    <el-form
      :model="colors"
      ref="themeFormRef"
      class="theme-form"
      label-width="70px"
    >
      <el-form-item label="主题色" prop="primary">
        <el-color-picker
          v-model="colors.primary"
        ></el-color-picker>
      </el-form-item>
      <el-form-item class="color-buttons">
        <el-button
          type="primary"
          @click="handleConfirmTheme"
          >切换</el-button
        >
        <el-button @click="resetTheme">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { setSystemTheme } from '@/utils/style'
const {
  handleConfirmTheme,
  resetTheme,
  themeDialogVisible,
  colors,
  handleClickChangeTheme
} = setSystemTheme()
</script>

<style lang="less" scoped>
.change-theme-switch {
  position: inherit;
  margin-right: 10px;
}
</style>
