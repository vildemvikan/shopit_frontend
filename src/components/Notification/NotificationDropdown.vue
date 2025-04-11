<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getNotification, deleteNotification } from '../../../utils/Notification'
import { useTokenStore } from '@/stores/tokenStore.ts'
import router from '@/router'
const deleteIcon = new URL('@/assets/icons/x.svg', import.meta.url).href
const refreshIcon = new URL('@/assets/icons/refresh2.svg', import.meta.url).href

const emit = defineEmits<{
  (e: 'close-dropdown'): void;
}>()

// Configuration for pagination (set as you prefer)
const perPage = 3
const currentPage = ref(0)    // current page index to fetch from backend

const notifications = ref([] as any[])

const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)
const hasMore = ref(true)
const totalPages = ref(0)

dayjs.extend(relativeTime)
dayjs.locale('nb')


async function fetchNotifications(page: number, reset = false) {
  const res = await getNotification(page, perPage)
  if (res && res.content) {
    totalPages.value = res.totalPages

    if (reset) {
      notifications.value = res.content
      currentPage.value = page
    } else {
      notifications.value = [...notifications.value, ...res.content]
    }

    hasMore.value = page < res.totalPages - 1
  }
}

async function refreshNotifications() {
  try {
    await fetchNotifications(0, true)
  } catch (e) {
    console.error('Failed to refresh notifications', e)
  }
}

async function loadMore() {
  const nextPage = currentPage.value + 1
  await fetchNotifications(nextPage)
  currentPage.value = nextPage
}

const removeNotification = async (id: number) => {
  try {
    const res = await deleteNotification(id)
    if (res === true) {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }
  } catch (e) {
    console.error('Failed to delete notification', e)
  }
}

onMounted(async() => {
  const tokenStore = useTokenStore()
  if (!tokenStore.isAuthenticated) {
    await router.push('/auth/login')
    emit('close-dropdown')
    return
  }
  const dropdown = document.querySelector('.dropdown')
  dropdown?.addEventListener('touchstart', onTouchStart)
  dropdown?.addEventListener('touchmove', onTouchMove)
  dropdown?.addEventListener('touchend', onTouchEnd)
  refreshNotifications()
})

onBeforeUnmount(() => {
  const dropdown = document.querySelector('.dropdown')
  dropdown?.removeEventListener('touchstart', onTouchStart)
  dropdown?.removeEventListener('touchmove', onTouchMove)
  dropdown?.removeEventListener('touchend', onTouchEnd)
})

function onTouchStart(e: TouchEvent) {
  startY.value = e.touches[0].clientY
  isDragging.value = true
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  currentY.value = e.touches[0].clientY
  const deltaY = currentY.value - startY.value
  const dropdown = document.querySelector('.dropdown') as HTMLElement
  if (dropdown && deltaY > 0) {
    dropdown.style.transform = `translateY(${deltaY}px)`
  }
}

function onTouchEnd() {
  const deltaY = currentY.value - startY.value
  const threshold = 80
  const dropdown = document.querySelector('.dropdown') as HTMLElement
  if (dropdown) {
    dropdown.style.transition = 'transform 0.2s ease'
  }
  if (deltaY > threshold) {
    window.dispatchEvent(new CustomEvent('closeNotificationSheet'))
  } else {
    if (dropdown) {
      dropdown.style.transform = 'translateY(0)'
    }
  }
  isDragging.value = false
}

const { locale } = useI18n()
dayjs.locale(locale.value)
watch(locale, (newLocale) => {
  dayjs.locale(newLocale)
})

function timeAgo(date: string): string {
  return dayjs(date).fromNow()
}
</script>

<template>
  <div class="dropdown">
    <div class="mobile-drag-bar" />
    <div class="dropdown-header">
      <h4>{{$t('title-notifications')}}</h4>
      <button @click="refreshNotifications" class="refresh-btn" aria-label="Refresh notifications">
        <img :src="refreshIcon" alt="Refresh" class="invertible-icon" />
      </button>
    </div>
    <div class="notification-list">
      <template v-if="notifications.length > 0">
        <div v-for="notification in notifications" :key="notification.id" class="item">
          <div class="msg">
            {{ $t(`notification.${notification.type}`, notification.args) }}
          </div>
          <div class="time">{{ timeAgo(notification.createdAt) }}</div>
          <router-link v-if="notification.link" :to="notification.link" class="link">
            {{ $t('notification.readMore') }}
          </router-link>
          <button class="delete-btn" @click="removeNotification(notification.id)">
            <img :src="deleteIcon" alt="Delete" class="icon" />
          </button>
        </div>
      </template>
      <div v-else class="empty-state">
        {{ $t('notification.empty') || 'No notifications' }}
      </div>
    </div>
    <div v-if="notifications.length >= (currentPage + 1) * perPage" class="load-more-wrapper">
      <button class="load-more-btn" @click="loadMore">
        {{ $t(`notification.showMore`) }}
      </button>
    </div>
  </div>
</template>


<style scoped>
.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.refresh-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
  transition: transform 0.2s;
}
.refresh-btn img {
  width: 30px;
  height: 30px;
}

.refresh-btn:hover img {
  transform: rotate(90deg);
}
.dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  background: var(--color-background);
  width: 300px;
  border: var(--global-border-size) solid var(--color-text);
  border-radius: var(--global-border-radius);
  padding: var(--spacing-sm);
  z-index: 1;
  box-shadow: var(--global-box-shaddow);
  font-family: inherit;
  overflow-y: auto;
  max-height: 450px;
}

h4 {
  text-align: left;
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-md);
  font-weight: var(--heading-weight);
  border-bottom: var(--global-border-size) solid var(--color-black-border);
  padding-bottom: var(--spacing-sm);
}

.item {
  text-align: left;
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  border-bottom: var(--global-border-size) solid var(--color-black-border);
}

.item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.msg {
  font-size: var(--font-size-sm);
  margin-bottom: 0;
  font-weight: 500;
}

.time {
  font-size: var(--font-size-xs);
  color: var(--vt-c-text-light-2);
  margin-bottom: var(--spacing-sm);
}

.link {
  font-size: var(--font-size-xs);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.empty-state {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--vt-c-text-light-2);
  padding: var(--spacing-sm);
}
.load-more-wrapper {
  text-align: center;
  margin-top: var(--spacing-sm);
}

.load-more-btn {
  background-color: var(--color-light-blue-button);
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.load-more-btn:hover {
  background-color: var(--color-blue-button);
}
.delete-btn {
  background: none;
  border: none;
  color: var(--color-error-text);
  font-size: var(--font-size-lg);
  cursor: pointer;
  float: right;
}

.icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.delete-button:hover .icon {
  filter: brightness(0.6);
}

@media (max-width: 768px) {
  .dropdown {
    position: static;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: 100%;
    padding: var(--spacing-md);
    border-radius: 12px 12px 0 0;
    border: none;
    z-index: 100;
    animation: slideUp 0.3s ease-out;
    background: var(--color-background);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: var(--spacing-sm);
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  .dropdown-header {
    flex-shrink: 0;
  }

  .item {
    flex-shrink: 0;
  }

  .notification-list {
    overflow-y: auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  .mobile-drag-bar {
    width: 40px;
    height: 4px;
    background-color: var(--color-background);
    border-radius: 4px;
    margin: 0 auto var(--spacing-sm);
  }
}
</style>
