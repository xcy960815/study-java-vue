<template>
  <!-- 切换主题按钮 -->
  <el-link class="change-theme-color-switch" @click="handleClickChangeThemeColor" :underline="false" type="info"
    >切换主题色
  </el-link>
  <el-link class="change-theme-switch" @click="handleClickChangeTheme" :underline="false" type="info"
    >{{ isDark ? '浅色主题' : '深色主题' }}
  </el-link>

  <!-- 切换主题dialog -->
  <el-dialog center v-model="themeDialogVisible" title="切换主题" width="400px">
    <el-form :model="themeConfig" ref="themeFormRef" class="theme-form" label-width="70px">
      <el-form-item label="主色：">
        <el-color-picker v-model="themeConfig.colors.primary" />
      </el-form-item>
      <el-form-item label="消息色">
        <el-color-picker v-model="themeConfig.colors.info" />
      </el-form-item>
      <el-form-item label="成功色">
        <el-color-picker v-model="themeConfig.colors.success" />
      </el-form-item>
      <el-form-item label="警告色">
        <el-color-picker v-model="themeConfig.colors.warning" />
      </el-form-item>
      <el-form-item label="危险色">
        <el-color-picker v-model="themeConfig.colors.danger" />
      </el-form-item>
      <el-form-item class="color-buttons">
        <el-button type="primary" @click="handleConfirmTheme">切换</el-button>
        <el-button @click="resetTheme">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { setSystemTheme } from '@/utils/system-style'
const {
  isDark,
  handleConfirmTheme,
  resetTheme,
  themeDialogVisible,
  themeConfig,
  handleClickChangeThemeColor,
  handleClickChangeTheme
} = setSystemTheme()
</script>

<style lang="less" scoped>
.change-theme-color-switch {
  position: inherit;
  margin-right: 10px;
}

.change-theme-switch {
  position: inherit;
  margin-right: 10px;
}
</style>
