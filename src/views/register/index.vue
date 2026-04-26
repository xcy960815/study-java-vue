<template>
  <div class="register-container w-screen h-screen flex items-center justify-center">
    <canvas class="register-backage" id="cvs"></canvas>
    <el-form ref="registerFormRef" :model="registerFormData" class="register-form">
      <h3 class="register-title">用户注册</h3>
      <el-form-item prop="username">
        <el-input
          v-model="registerFormData.username"
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
          v-model="registerFormData.password"
          :type="passwordInputType"
          size="large"
          auto-complete="off"
          placeholder="密码"
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

      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerFormData.confirmPassword"
          :type="passwordInputType"
          size="large"
          auto-complete="off"
          placeholder="确认密码"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <Lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="captcha">
        <el-input
          class="captcha-input flex-1"
          v-model="registerFormData.captcha"
          size="large"
          placeholder="验证码"
          @keyup.enter.native="handleRegister"
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

      <div class="flex justify-between items-center mb-[25px] text-sm">
        <router-link to="/login" class="text-blue-500 hover:text-blue-600 ml-auto leading-loose"
          >已有账号? 去登录</router-link
        >
      </div>

      <el-form-item style="width: 100%">
        <el-button
          ref="registerButtonRef"
          :disabled="registerButtonDisabled"
          :loading="registering"
          size="default"
          type="primary"
          style="width: 100%"
          @click="handleRegister"
        >
          <span v-if="!registering">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, ButtonInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Lock, User, View, Hide } from '@element-plus/icons-vue'
import { initBackground } from '../login/background'
import { loginModule } from '@apis'
import { useLoginButtonAnimation } from '@/composables/useLoginButtonAnimation'
import type { RegisterRequestDto } from '@/apis/login'

initBackground()

const router = useRouter()
const registering = ref(false)

const registerFormData = reactive<RegisterRequestDto>({
  username: '',
  password: '',
  confirmPassword: '',
  captchaId: '',
  captcha: '',
})

const passwordInputType = ref('password')

const showHideIcon = computed(() => passwordInputType.value === 'text')
const showVievIcon = computed(() => passwordInputType.value === 'password')

const registerButtonDisabled = computed(() => {
  return (
    !registerFormData.username ||
    !registerFormData.password ||
    !registerFormData.confirmPassword ||
    !registerFormData.captcha ||
    registerFormData.captcha.length !== 4
  )
})

const handleClickPasswordIcon = () => {
  passwordInputType.value = passwordInputType.value === 'password' ? 'text' : 'password'
}

const registerFormRef = ref<FormInstance>()
const registerButtonRef = ref<ButtonInstance>()

/**
 * 注册
 */
const handleRegister = async () => {
  if (registerFormData.password !== registerFormData.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  registering.value = true
  const registerData = { ...registerFormData }

  try {
    await loginModule.register(registerData)
    ElMessage.success('注册成功，请登录')
    router.replace('/login')
  } catch (err) {
    handleGetCaptcha()
  } finally {
    registering.value = false
  }
}

const captchaUrl = ref('')
const captchaLoading = ref(false)
const handleGetCaptcha = async () => {
  captchaLoading.value = true
  const captchaRes = await loginModule.getCaptcha().finally(() => {
    captchaLoading.value = false
  })

  registerFormData.captchaId = captchaRes.captchaId
  captchaUrl.value = captchaRes.captchaImage
}

useLoginButtonAnimation(registerButtonDisabled, registerButtonRef)

onMounted(() => {
  handleGetCaptcha()
})
</script>
<style lang="less" scoped>
.register-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .register-form {
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

    .register-title {
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

  .register-backage {
    z-index: -1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
