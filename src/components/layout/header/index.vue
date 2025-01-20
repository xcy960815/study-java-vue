<template>
  <el-header class="layout-header-container">
    <div class="left-panel" @click="toggleClick">
      <svg
        :class="{ 'is-active': openMenuFlag }"
        class="hamburger"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
      >
        <path
          d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
        />
      </svg>
    </div>
    <div class="right-panel">
      <el-link
        class="change-theme-switch"
        @click="handleClickChangeTheme"
        :underline="false"
        type="info"
        >切换主题</el-link
      >
      <el-dropdown
        trigger="contextmenu"
        @command="handleChooseItem"
        size="default"
      >
        <div class="user-info">
          <el-avatar
            class="user-avatar"
            shape="square"
            :src="userInfo.avatar"
          />
          <span class="user-name">
            {{ userInfo.nickName }}
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="user-info"
              >个人中心</el-dropdown-item
            >
            <el-dropdown-item command="change-password"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item command="login-out"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>

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
import { type FormInstance } from 'element-plus'
import {
  computed,
  onMounted,
  reactive,
  ref,
  nextTick
} from 'vue'
import {
  useUserInfoStore,
  useSystemInfoStore
} from '@store'
import { useRouter } from 'vue-router'
import {
  generateColors,
  writeNewStyle,
  setVarStyle,
  getIndexStyle,
  getStyleTemplate
} from '@utils/theme'
const router = useRouter()
const userInfoStore = useUserInfoStore()
const userInfo = computed(() => userInfoStore.$state)
const systemInfoStore = useSystemInfoStore()
const openMenuFlag = computed(
  () => systemInfoStore.openMenuFlag
)

const toggleClick = () => {
  systemInfoStore.reversalOpenMenuFlag()
}

const handleChooseItem = (command: string) => {
  switch (command) {
    case 'user-info':
      router.push('/user/info')
      break

    case 'change-password':
      router.push('/user/password')
      break
    case 'login-out':
      console.log('退出登录')
      userInfoStore.logout()
      break
  }
}
const themeFormRef = ref<FormInstance>()
const themeDialogVisible = ref(false)
const colors = reactive({
  primary: '#409eff'
})
const handleClickChangeTheme = () => {
  themeDialogVisible.value = true
  nextTick(() => {
    themeFormRef.value?.resetFields()
  })
}
/**
 *
 */
const originalStylesheetCount = computed(() => {
  return document.styleSheets.length || -1
})
const originalStyle = ref('')
getIndexStyle().then((data) => {
  originalStyle.value = getStyleTemplate(data)
})

/**
 * 切换主题
 */
const handleConfirmTheme = () => {
  // generateColors(colors.primary)
  // console.log("colors",originalStylesheetCount.value, originalStyle.value, colors);
  // writeNewStyle(originalStylesheetCount.value, originalStyle.value, colors)
  themeDialogVisible.value = false
  setVarStyle('--el-color-primary', colors.primary)
  setVarStyle('--el-color-primary-light-9', colors.primary)
  setVarStyle('--el-color-primary-light-3', colors.primary)
}
/**
 * 重置主题
 */
const resetTheme = () => {
  themeFormRef.value?.resetFields()
}

onMounted(() => {
  userInfoStore.getUserInfo()
})
</script>
<style lang="less" scoped>
.layout-header-container {
  height: 50px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  justify-content: space-between;

  .left-panel {
    display: flex;
    align-items: center;

    .hamburger {
      cursor: pointer;
      // transition: transform 0.3s;
    }

    .hamburger.is-active {
      transform: rotate(180deg);
    }
  }

  .right-panel {
    display: flex;
    align-items: center;

    .change-theme-switch {
      position: inherit;
      margin-right: 10px;
    }

    .user-info {
      display: flex;
      align-items: center;

      .user-avatar {
        margin-right: 10px;
      }
    }
  }
}
</style>
