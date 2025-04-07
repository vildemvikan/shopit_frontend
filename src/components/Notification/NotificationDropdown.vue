<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getNotification } from '../../../utils/Notification.ts'
const deleteIcon = new URL('@/assets/icons/x.svg', import.meta.url).href
const refreshIcon = new URL('@/assets/icons/refresh2.svg', import.meta.url).href
const perPage = 3
const visibleCount = ref(perPage)
dayjs.extend(relativeTime)
dayjs.locale('nb')

// Drag state refs
const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)

function onTouchStart(e: TouchEvent) {
  startY.value = e.touches[0].clientY
  isDragging.value = true
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  currentY.value = e.touches[0].clientY
  const deltaY = currentY.value - startY.value

  // Optional: move the sheet down visually
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
    // emit event or call method to close it
    window.dispatchEvent(new CustomEvent('closeNotificationSheet'))
  } else {
    // Reset position if not dragged far enough
    if (dropdown) {
      dropdown.style.transform = 'translateY(0)'
    }
  }

  isDragging.value = false
}

onMounted(() => {
  const dropdown = document.querySelector('.dropdown')
  dropdown?.addEventListener('touchstart', onTouchStart)
  dropdown?.addEventListener('touchmove', onTouchMove)
  dropdown?.addEventListener('touchend', onTouchEnd)
})

onBeforeUnmount(() => {
  const dropdown = document.querySelector('.dropdown')
  dropdown?.removeEventListener('touchstart', onTouchStart)
  dropdown?.removeEventListener('touchmove', onTouchMove)
  dropdown?.removeEventListener('touchend', onTouchEnd)
})
async function refreshNotifications() {
  const result = await getNotification()
  if (Array.isArray(result)) {
    notifications.value = result
    visibleCount.value = perPage // reset visible items
  }
}
const notifications = ref([
  {
    id: 1,
    type: 'BID_PLACED',
    args: { user: 'John Doe', item: 'iPhone 13' },
    createdAt: '2025-04-06T12:00:00Z',
    link: '/items/1'
  },
  {
    id: 2,
    type: 'ITEM_BOUGHT',
    args: { user: 'Alice Smith Smith Smith Smith Smith Smith', item: 'Stol' },
    createdAt: '2025-04-05T08:00:00Z',
    link: '/items/2'
  },
  {
    id: 3,
    type: 'BID_PLACED',
    args: { user: 'Carlos Vega', item: 'MacBook Pro' },
    createdAt: '2025-04-04T15:30:00Z',
    link: '/items/3'
  },
  {
    id: 4,
    type: 'ITEM_BOUGHT',
    args: { user: 'Emma Johnson', item: 'PS5' },
    createdAt: '2025-04-03T11:00:00Z',
    link: '/items/4'
  },
  {
    id: 5,
    type: 'BID_PLACED',
    args: { user: 'Liam Chen', item: 'AirPods' },
    createdAt: '2025-04-02T09:00:00Z',
    link: '/items/5'
  },
  {
    id: 6,
    type: 'ITEM_BOUGHT',
    args: { user: 'Sophia Lee', item: 'Samsung TV' },
    createdAt: '2025-04-01T20:00:00Z',
    link: '/items/6'
  },
  {
    id: 7,
    type: 'BID_PLACED',
    args: { user: 'Noah Patel', item: 'Gaming Chair' },
    createdAt: '2025-03-31T14:00:00Z',
    link: '/items/7'
  },
  {
    id: 8,
    type: 'ITEM_BOUGHT',
    args: { user: 'Ava Müller', item: 'Wireless Mouse' },
    createdAt: '2025-03-30T10:00:00Z',
    link: '/items/8'
  },
  {
    id: 9,
    type: 'BID_PLACED',
    args: { user: 'Lucas Wang', item: 'GoPro Hero' },
    createdAt: '2025-03-29T17:00:00Z',
    link: '/items/9'
  },
  {
    id: 10,
    type: 'ITEM_BOUGHT',
    args: { user: 'Mia Rossi', item: 'Smart Watch' },
    createdAt: '2025-03-28T13:00:00Z',
    link: '/items/10'
  }
])
const deleteNotification = async (id: number) => {
  try {
    await deleteNotification(id)
    notifications.value = notifications.value.filter(n => n.id !== id)
  } catch (e) {
    console.error('Failed to delete notification', e)
  }
}

const { locale } = useI18n()
dayjs.locale(locale.value)
watch(locale, (newLocale) => {
  dayjs.locale(newLocale)
})
function timeAgo(date: string): string {
  return dayjs(date).fromNow()
}


const visibleNotifications = computed(() =>
  notifications.value.slice(0, visibleCount.value)
)

function loadMore() {
  visibleCount.value += perPage
}
</script>

<template>
  <div class="dropdown">
    <div class="mobile-drag-bar" />
    <div class="dropdown-header">
      <h4>Varslinger</h4>
      <button @click="refreshNotifications" class="refresh-btn" aria-label="Refresh notifications">
        <img :src="refreshIcon" alt="Refresh"  class="icon"/>
      </button>
    </div>

    <div class="notification-list">
      <div v-for="notification in visibleNotifications" :key="notification.id" class="item">
        <div class="msg">
          {{ $t(`notification.${notification.type}`, notification.args) }}
        </div>
        <div class="time">{{ timeAgo(notification.createdAt) }}</div>
        <router-link v-if="notification.link" :to="notification.link" class="link">
          {{ $t('notification.readMore') }}
        </router-link>
        <button class="delete-btn" @click="deleteNotification(notification.id)">
          <img :src="deleteIcon" alt="Delete" class="icon" />
        </button>
      </div>
    </div>
    <div v-if="visibleCount < notifications.length" class="load-more-wrapper">
      <button class="load-more-btn" @click="loadMore">{{ $t(`notification.showMore`) }}</button>
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
  background: var(--color-white-background);
  width: 300px;
  border: var(--global-border-size) solid var(--color-black-border);
  border-radius: var(--global-border-radius);
  padding: var(--spacing-sm);
  z-index: 1000;
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
.items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
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
    right: 0;
    width: 100%;
    max-height: 100%;
    padding: var(--spacing-md);
    border-radius: 12px 12px 0 0;
    border: none;
    z-index: 100;
    animation: slideUp 0.3s ease-out;
    background: white;
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

  /* 👇 Wrap scrollable items inside a wrapper */
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
    background-color: #ccc;
    border-radius: 4px;
    margin: 0 auto var(--spacing-sm);
  }
}
</style>
