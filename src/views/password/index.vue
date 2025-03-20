<template>
  <el-form
    ref="changePasswordFormRef"
    :model="changePasswordFormData"
    :rules="changePasswordFormRules"
    label-width="auto"
    class="password-form"
    status-icon
  >
    <el-form-item label="原始密码" prop="originalPassword">
      <el-input type="password" v-model="changePasswordFormData.originalPassword" placeholder="请输入原始密码" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input type="password" v-model="changePasswordFormData.newPassword" placeholder="请输入新密码" />
    </el-form-item>
    <el-form-item label="确认新密码" prop="confirmNewPasswordMd5">
      <el-input type="password" v-model="changePasswordFormData.confirmNewPasswordMd5" placeholder="请确认新密码" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import Md5 from 'MD5'
import { eventEmitter } from '@utils/event-emits'
import { userModule } from '@apis'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus'
import { ref, reactive, nextTick } from 'vue'

interface ChangePasswordFormData {
  originalPassword: string
  newPassword: string
  confirmNewPasswordMd5: string
}

const changePasswordFormRef = ref<FormInstance>()

const changePasswordFormData = reactive<ChangePasswordFormData>({
  originalPassword: '123456',
  newPassword: '12345678',
  confirmNewPasswordMd5: '12345678'
})

const changePasswordFormRules: FormRules<ChangePasswordFormData> = {
  originalPassword: [
    {
      required: true,
      message: '请输入原始密码',
      trigger: 'blur'
    }
  ],

  newPassword: [
    {
      required: true,
      message: '请输入新密码',
      trigger: 'blur'
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
        } else if (changePasswordFormData.confirmNewPasswordMd5) {
          if (value !== changePasswordFormData.confirmNewPasswordMd5) {
            callback(new Error('新密码与确认密码不相同'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
  ],

  confirmNewPasswordMd5: [
    {
      required: true,
      message: '请再次输入新密码',
      trigger: 'blur'
    }
  ]
}

/**
 * 确认修改密码
 */
const handleChangePasswordConfirm = async () => {
  const valid = await changePasswordFormRef.value?.validate().catch(() => false)
  if (!valid) return
  const requestParams = {
    passwordMd5: Md5(changePasswordFormData.originalPassword),
    newPasswordMd5: Md5(changePasswordFormData.newPassword),
    confirmNewPasswordMd5: Md5(changePasswordFormData.confirmNewPasswordMd5)
  }
  const result = await userModule.updateUserPassword(requestParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '修改密码成功'
    })
    eventEmitter.emit('logout')
  }
}
</script>
<style lang="less" scoped>
.password-form {
  position: relative;
  width: 600px;
  padding: 25px;
  margin: auto;
  margin-top: 100px;
}
</style>
