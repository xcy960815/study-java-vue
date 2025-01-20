<template>
  <div class="login-page">
    <canvas class="login-backage" id="cvs"></canvas>
    <el-form
      ref="loginFormRef"
      :model="loginFormData"
      :rules="loginFormRules"
      class="login-form"
    >
      <h3 class="login-title">{{ viteAppTitle }}</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginFormData.username"
          type="text"
          auto-complete="off"
          size="large"
          placeholder="账号"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginFormData.password"
          :type="passwordInputType"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <Lock />
            </el-icon>
          </template>
          <template #suffix>
            <el-icon
              class="el-input__icon_view"
              @click="handleClickPasswordIcon"
            >
              <View v-show="showVievIcon" />
              <Hide v-show="showHideIcon" />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-checkbox
        v-model="loginFormData.rememberMe"
        style="margin: 0px 0px 25px 0px"
        >记住密码</el-checkbox
      >
      <el-form-item style="width: 100%">
        <el-button
          :loading="logining"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!logining">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useUserInfoStore } from '@/store'
import type { FormRules, FormInstance } from 'element-plus'
import { onMounted, reactive, ref, computed } from 'vue'
import { Lock, User, View } from '@element-plus/icons-vue'
import MD5 from 'MD5'
import { initBackground } from './background'
interface LoginFormData {
  username: string
  password: string
  rememberMe: boolean
}

initBackground()
const viteAppTitle = import.meta.env.VITE_APP_TITLE

const userInfoStore = useUserInfoStore()
const logining = ref(false)

const loginFormData = reactive({
  username: '13700002703',
  password: '123456',
  rememberMe: false
})

const passwordInputType = ref('password')
const showHideIcon = computed(
  () => passwordInputType.value === 'text'
)
const showVievIcon = computed(
  () => passwordInputType.value === 'password'
)

const handleClickPasswordIcon = () => {
  passwordInputType.value =
    passwordInputType.value === 'password'
      ? 'text'
      : 'password'
}

const loginFormRef = ref<FormInstance>()

const loginFormRules: FormRules<LoginFormData> = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ]
}
/**
 * 登入
 */
const handleLogin = async () => {
  const valid = await loginFormRef.value
    ?.validate()
    .catch(() => false)
  if (!valid) return
  const loginData = { ...loginFormData }

  loginData.password = MD5(loginFormData.password)
  userInfoStore.login(loginData)
}

onMounted(() => {})
</script>
<style lang="less" scoped>
.login-page {
  position: relative;
  height: inherit;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  // background-image: url('@/assets/images/login.jpg');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;

    .el-input__icon_view {
      cursor: pointer;
    }

    .login-title {
      margin: 0px auto 30px auto;
      text-align: center;
      color: #707070;
    }

    :deep(.el-form-item__label) {
      color: white;
      font-size: 16px;
      font-style: italic;
    }
  }

  .login-backage {
    z-index: -1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
