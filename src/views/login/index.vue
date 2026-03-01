<template>
  <div class="login-container w-screen h-screen flex items-center justify-center">
    <canvas class="login-backage" id="cvs"></canvas>
    <el-form ref="loginFormRef" :model="loginFormData" :rules="loginFormRules" class="login-form">
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
            <el-icon class="el-input__icon_view" @click="handleClickPasswordIcon">
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
          class="captcha-image cursor-pointer h-10 flex-1 ml-1"
          fill="fill"
          :src="captchaUrl"
        >
          <template #error>
            <span>图片加载失败</span>
          </template>
        </el-image>
      </el-form-item>
      <!-- 记住密码 -->
      <el-checkbox class="remember-checkbox mb-[25px]" v-model="loginFormData.rememberMe"
        >记住密码</el-checkbox
      >
      <el-form-item style="width: 100%">
        <el-button
          ref="loginButtonRef"
          :disabled="loginButtonDisabled"
          :loading="logining"
          size="default"
          type="primary"
          style="width: 100%"
          @click="handleLogin"
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
import { onMounted, onUnmounted, reactive, ref, computed } from 'vue'
import { Lock, User, View, Hide } from '@element-plus/icons-vue'
// import { useEncryptByRsa } from '@/composables/useEncryption'
import MD5 from 'MD5'
import { initBackground } from './background'
import { loginModule } from '@apis'

initBackground()

const viteAppTitle = import.meta.env.VITE_APP_TITLE

const logining = ref(false)

const loginFormData = reactive<LoginRequestDto>({
  username: '13700002703',
  password: '123456',
  captcha: '',
  rememberMe: false,
})

const passwordInputType = ref('password')

const showHideIcon = computed(() => passwordInputType.value === 'text')
const showVievIcon = computed(() => passwordInputType.value === 'password')

const loginButtonDisabled = computed(() => {
  return (
    loginFormData.username === '' ||
    loginFormData.password === '' ||
    loginFormData.captcha === '' ||
    loginFormData.captcha.length !== 4
  )
})

const handleClickPasswordIcon = () => {
  passwordInputType.value = passwordInputType.value === 'password' ? 'text' : 'password'
}

const loginFormRef = ref<FormInstance>()
const loginButtonRef = ref()

const loginFormRules: FormRules<LoginRequestDto> = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur', 'change'],
    },
  ],
  captcha: [
    {
      required: true,
      message: '请输入验证码',
      trigger: ['blur', 'change'],
    },
  ],
}

const loginStore = useLoginStore()
/**
 * 登入
 */
const handleLogin = async () => {
  const valid = await loginFormRef.value?.validate().catch(() => false)
  if (!valid) return
  logining.value = true
  const loginData = { ...loginFormData }

  // loginData.password = encryptByRsa(loginFormData.password) || loginData.password

  loginData.password = loginData.password ? MD5(loginFormData.password) : loginData.password

  loginStore.login(loginData).finally(() => {
    logining.value = false
  })
}

const captchaUrl = ref('')
const captchaLoading = ref(false)
const handleGetCaptcha = async () => {
  captchaLoading.value = true
  const captchaRes = await loginModule.getCaptcha().finally(() => {
    captchaLoading.value = false
  })

  captchaUrl.value = captchaRes
}

onMounted(() => {
  handleGetCaptcha()

  const button = loginButtonRef.value?.$el || loginButtonRef.value
  if (!button) return

  const distanceBetween = (p1x: number, p1y: number, p2x: number, p2y: number) => {
    const dx = p1x - p2x
    const dy = p1y - p2y
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!loginButtonDisabled.value) {
      button.style.transform = ''
      button.style.boxShadow = ''
      return
    }

    const radius = Math.max(button.offsetWidth * 0.75, button.offsetHeight * 0.75, 100)
    const rect = button.getBoundingClientRect()
    const bx = rect.left + rect.width / 2
    const by = rect.top + rect.height / 2

    const dist = distanceBetween(event.clientX, event.clientY, bx, by) * 2
    const angle = Math.atan2(event.clientY - by, event.clientX - bx)

    const ox = -1 * Math.cos(angle) * Math.max(radius - dist, 0)
    const oy = -1 * Math.sin(angle) * Math.max(radius - dist, 0)

    const rx = oy / 2
    const ry = -ox / 2

    button.style.transition = `all 0.1s ease`
    button.style.transform = `translate(${ox}px, ${oy}px) rotateX(${rx}deg) rotateY(${ry}deg)`
    button.style.boxShadow = `0px ${Math.abs(oy)}px ${(Math.abs(oy) / radius) * 40}px rgba(0,0,0,0.15)`
  }

  document.addEventListener('mousemove', handleMouseMove)

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
  })
})
</script>
<style lang="less" scoped>
.login-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;

    .captcha-image {
      border-radius: 2px;
    }

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
