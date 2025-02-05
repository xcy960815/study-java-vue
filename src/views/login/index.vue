<template>
  <div
    class="login-page w-screen h-screen flex items-center justify-center"
  >
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

      <el-form-item prop="captcha">
        <el-input
          class="captcha-input flex-1"
          v-model="loginFormData.captcha"
          size="large"
          placeholder="验证码"
          @keyup.enter.native="handleLogin"
        >
        </el-input>
        <el-image
          @click="handleGetCaptcha"
          class="captcha-image flex-1 ml-1 rounded"
          fill="fill"
          :src="captchaUrl"
        />
      </el-form-item>
      <el-checkbox
        class="remember-checkbox mb-[25px]"
        v-model="loginFormData.rememberMe"
        >记住密码</el-checkbox
      >
      <el-form-item style="width: 100%">
        <el-button
          :loading="logining"
          size="default"
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
import { useLoginStore } from '@/store'
import type { FormRules, FormInstance } from 'element-plus'
import { onMounted, reactive, ref, computed } from 'vue'
import { Lock, User, View } from '@element-plus/icons-vue'
import MD5 from 'MD5'
import { initBackground } from './background'
import { loginModule } from '@apis'
initBackground()

const viteAppTitle = import.meta.env.VITE_APP_TITLE

const logining = ref(false)

const loginFormData = reactive<LoginRequestVo>({
  username: '13700002703',
  password: '123456',
  captcha: '',
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

const loginFormRules: FormRules<LoginRequestVo> = {
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
  ],
  captcha: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    }
  ]
}

const loginStore = useLoginStore()
/**
 * 登入
 */
const handleLogin = async () => {
  const valid = await loginFormRef.value
    ?.validate()
    .catch(() => false)
  if (!valid) return
  logining.value = true
  const loginData = { ...loginFormData }

  loginData.password = loginData.password
    ? MD5(loginFormData.password)
    : loginData.password

  loginStore.login(loginData).finally(() => {
    logining.value = false
  })
}

const captchaUrl = ref('')

const handleGetCaptcha = async () => {
  const result = await loginModule.getCaptcha()
  if (result.code === 200) {
    captchaUrl.value = result.data
  }
}

onMounted(() => {
  handleGetCaptcha()
})
</script>
<style lang="less" scoped>
.login-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

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
