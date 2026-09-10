<template>
  <el-form
    ref="changePasswordFormRef"
    :model="changePasswordFormData"
    :rules="changePasswordFormRules"
    label-width="auto"
    class="change-password-form"
    status-icon
  >
    <el-form-item label="原始密码" prop="originalPassword">
      <el-input
        type="password"
        v-model="changePasswordFormData.originalPassword"
        placeholder="请输入原始密码"
        show-password
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        type="password"
        v-model="changePasswordFormData.newPassword"
        placeholder="请输入新密码"
        show-password
      />
    </el-form-item>
    <el-form-item label="确认新密码" prop="confirmNewPassword">
      <el-input
        type="password"
        v-model="changePasswordFormData.confirmNewPassword"
        placeholder="请确认新密码"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="submitting" @click="handleConfirm">确认修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { eventEmitter } from '@utils/event-emits'
import { userModule } from '@apis'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus'

interface ChangePasswordFormData {
  originalPassword: string
  newPassword: string
  confirmNewPassword: string
}

defineOptions({
  name: 'ChangePasswordForm',
})

const changePasswordFormRef = ref<FormInstance>()
const submitting = ref(false)

const changePasswordFormData = reactive<ChangePasswordFormData>({
  originalPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const changePasswordFormRules: FormRules<ChangePasswordFormData> = {
  originalPassword: [
    {
      required: true,
      message: '请输入原始密码',
      trigger: 'blur',
    },
  ],
  newPassword: [
    {
      required: true,
      message: '请输入新密码',
      trigger: 'blur',
    },
    {
      // 自定义验证
      validator: (_rule, value, callback) => {
        if (changePasswordFormData.originalPassword) {
          if (value === changePasswordFormData.originalPassword) {
            callback(new Error('新密码不能与原始密码相同'))
          } else {
            callback()
          }
        } else if (changePasswordFormData.confirmNewPassword) {
          if (value !== changePasswordFormData.confirmNewPassword) {
            callback(new Error('新密码与确认密码不相同'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
    },
  ],
  confirmNewPassword: [
    {
      required: true,
      message: '请再次输入新密码',
      trigger: 'blur',
    },
    {
      validator: (_rule, value, callback) => {
        if (changePasswordFormData.newPassword && value !== changePasswordFormData.newPassword) {
          callback(new Error('两次输入的新密码不相同'))
        } else {
          callback()
        }
      },
    },
  ],
}

/**
 * 确认修改密码
 */
const handleConfirm = async () => {
  const valid = await changePasswordFormRef.value?.validate().catch(() => false)
  if (!valid) return
  if (submitting.value) return
  submitting.value = true
  try {
    const requestParams = {
      passwordMd5: changePasswordFormData.originalPassword,
      newPasswordMd5: changePasswordFormData.newPassword,
      confirmNewPasswordMd5: changePasswordFormData.confirmNewPassword,
    }
    const result = await userModule.updateUserPassword(requestParams)
    if (result) {
      ElMessage({
        type: 'success',
        message: '修改密码成功，请重新登录',
      })
      eventEmitter.emit('logout')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="less" scoped>
.change-password-form {
  max-width: 480px;
}
</style>
