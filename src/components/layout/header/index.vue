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
      <!-- 新版本提示 -->
      <update-dot></update-dot>
      <!-- 通知中心 -->
      <layout-notification></layout-notification>
      <!-- 主题 / 全屏快捷入口 -->
      <theme></theme>
      <el-dropdown trigger="click" popper-class="user-dropdown" @command="handleChooseItem" size="default">
        <div class="user-info">
          <el-avatar class="user-avatar" shape="square" :src="userInfo.avatar" />
          <span class="user-name">
            {{ userInfo.nickName }}
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>
              <div class="user-profile-card">
                <el-avatar :size="40" shape="square" :src="userInfo.avatar" />
                <div class="user-profile-card__identity">
                  <span class="user-profile-card__name">{{ userInfo.nickName }}</span>
                  <span class="user-profile-card__account">@{{ userInfo.loginName }}</span>
                </div>
                <el-tag
                  :type="isAdmin ? 'danger' : 'info'"
                  size="small"
                  class="user-profile-card__tag"
                >
                  {{ isAdmin ? '管理员' : '普通用户' }}
                </el-tag>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided command="user-info">个人中心</el-dropdown-item>
            <el-dropdown-item command="change-password">修改密码</el-dropdown-item>
            <el-dropdown-item command="theme-settings">个性化设置</el-dropdown-item>
            <el-dropdown-item command="login-out">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <PersonalizationDrawer></PersonalizationDrawer>
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useUserInfoStore, useSystemInfoStore, useLoginStore } from '@store'
import { useRouter } from 'vue-router'
import { setStyleProperty, CSS_VARIABLES, useSystemTheme } from '@/utils/system-style'
import Theme from './themen.vue'
import LayoutNotification from './notification.vue'
import UpdateDot from './update-dot.vue'
import PersonalizationDrawer from './personalization-drawer.vue'

const router = useRouter()
const userInfoStore = useUserInfoStore()
const userInfo = computed(() => userInfoStore.$state)
const systemInfoStore = useSystemInfoStore()
const openMenuFlag = computed(() => systemInfoStore.getOpenMenuFlag)
const systemTheme = useSystemTheme()

/** 超级权限视为管理员（与 React 版判定一致） */
const isAdmin = computed(() => userInfo.value.permissions?.includes('*:*:*') ?? false)

/**
 * 点击展开收起小图标
 */
const toggleClick = () => {
  systemInfoStore.reversalOpenMenuFlag()
  if (openMenuFlag.value) {
    const history_width = localStorage.getItem(CSS_VARIABLES.LAYOUT_SIDE_CONTAINER_WIDTH) || '300px'
    setStyleProperty(CSS_VARIABLES.LAYOUT_SIDE_CONTAINER_WIDTH, history_width)
  } else {
    setStyleProperty(CSS_VARIABLES.LAYOUT_SIDE_CONTAINER_WIDTH, '64px')
  }
}

const loginStore = useLoginStore()

const handleChooseItem = (command: string) => {
  switch (command) {
    case 'user-info':
      router.push('/user/info')
      break
    case 'change-password':
      router.push('/password')
      break
    case 'theme-settings':
      systemTheme.drawerVisible.value = true
      break
    case 'login-out':
      loginStore.logout()
      break
  }
}
</script>

<style lang="less" scoped>
.layout-header-container {
  height: 50px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  justify-content: space-between;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0 16px;

  .left-panel {
    display: flex;
    align-items: center;

    .hamburger {
      cursor: pointer;
      transition: transform 0.3s;
      color: var(--el-text-color-primary);

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .hamburger.is-active {
      transform: rotate(180deg);
    }
  }

  .right-panel {
    display: flex;
    align-items: center;
    gap: 16px;

    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }

      .user-avatar {
        margin-right: 8px;
        border: 2px solid var(--el-border-color-light);
        transition: border-color 0.3s;

        &:hover {
          border-color: var(--el-color-primary);
        }
      }

      .user-name {
        color: var(--el-text-color-primary);
        font-size: 14px;
      }
    }
  }
}
</style>

<style lang="less">
/* 用户下拉名片：popper 挂在 body 上，样式需全局书写并以 user-dropdown 归位 */
.user-dropdown.el-popper {
  .user-profile-card {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 210px;

    &__identity {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    &__name {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__account {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    &__tag {
      margin-left: auto;
      flex-shrink: 0;
    }
  }
}
</style>
