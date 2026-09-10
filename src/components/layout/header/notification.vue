<template>
  <el-popover placement="bottom-end" :width="360" trigger="click" popper-class="notification-popover">
    <template #reference>
      <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99">
        <el-button class="bell-btn" :icon="Bell" circle />
      </el-badge>
    </template>

    <div class="notification-panel">
      <div class="notification-panel__header">
        <span class="notification-panel__title">通知（{{ unreadCount }} 条未读）</span>
        <div class="notification-panel__actions">
          <el-button link type="primary" size="small" :disabled="unreadCount === 0" @click="handleMarkAllRead">
            全部已读
          </el-button>
          <el-button link type="danger" size="small" :disabled="notifications.length === 0" @click="handleClear">
            清空
          </el-button>
        </div>
      </div>

      <el-empty v-if="notifications.length === 0" description="暂无通知" :image-size="60" />

      <ul v-else class="notification-list">
        <li
          v-for="item in notifications"
          :key="item.id"
          class="notification-list__item"
          :class="{ 'is-unread': !item.read }"
          @click="handleItemClick(item)"
        >
          <span class="notification-list__dot" :class="{ 'is-visible': !item.read }"></span>
          <div class="notification-list__body">
            <p class="notification-list__title">{{ item.title }}</p>
            <p class="notification-list__content">{{ item.content }}</p>
            <p class="notification-list__time">{{ formatRelativeTime(item.createdAt) }}</p>
          </div>
        </li>
      </ul>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { Bell } from '@element-plus/icons-vue'
import { useNotificationStore } from '@store'
import { formatRelativeTime, getNotificationRoute } from '@/utils/notification'

const router = useRouter()
const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.getNotifications)
const unreadCount = computed(() => notificationStore.getUnreadCount)

const handleItemClick = (item: NotificationStore.AppNotification) => {
  notificationStore.markAsRead(item.id)
  const target = getNotificationRoute(item)
  if (target) router.push(target)
}

const handleMarkAllRead = () => {
  notificationStore.markAllAsRead()
}

const handleClear = async () => {
  try {
    await ElMessageBox.confirm('确认清空所有通知吗？', '提示', { type: 'warning' })
    notificationStore.clearNotifications()
  } catch {
    // 用户取消
  }
}
</script>

<style lang="less" scoped>
.bell-btn {
  padding: 8px;
  border: none;
  background: transparent;
  color: var(--el-text-color-regular);
  transition: all 0.3s ease;

  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }

  :deep(.el-icon) {
    font-size: 18px;
  }
}

.notification-panel {
  .notification-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .notification-panel__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .notification-list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 360px;
    overflow-y: auto;

    .notification-list__item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 4px;
      border-bottom: 1px solid var(--el-border-color-lighter);
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }

      &:last-child {
        border-bottom: none;
      }

      .notification-list__dot {
        width: 8px;
        height: 8px;
        min-width: 8px;
        margin-top: 6px;
        border-radius: 50%;
        background-color: transparent;

        &.is-visible {
          background-color: var(--el-color-primary);
        }
      }

      .notification-list__body {
        flex: 1;
        min-width: 0;

        .notification-list__title {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .notification-list__content {
          margin: 4px 0;
          font-size: 13px;
          color: var(--el-text-color-regular);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .notification-list__time {
          margin: 0;
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}
</style>
