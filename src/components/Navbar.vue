<script setup lang="ts">

import { useRouter } from 'vue-router'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import NotificationDropdown from '../components/Notification/NotificationDropdown.vue'

onMounted(() => {
  window.addEventListener('closeNotificationSheet', closeMobileNotification)
})
onBeforeUnmount(() => {
  window.removeEventListener('closeNotificationSheet', closeMobileNotification)
})
const dropdownRef = ref<HTMLElement | null>(null)

const options = [
  { icon: 'create.svg', label: 'create-advertisement', path: 'create-advertisement'},
  { icon: 'messages.svg', label: 'messages', path: 'messages'},
  { icon: 'bookmark.svg', label: 'bookmarks', path: 'bookmarks' },
  { icon: 'profile.svg', label: 'profile' , path: 'profile'},
]
const showDropdown = ref(false)
let lastToggledEvent: Event | null = null

function toggleNotifications(event?: MouseEvent) {
  showDropdown.value = !showDropdown.value

  // Track the event that triggered the toggle
  lastToggledEvent = event || null

  nextTick(() => {
    setTimeout(() => {
      if (showDropdown.value) {
        document.addEventListener('click', handleClickOutside)
      } else {
        document.removeEventListener('click', handleClickOutside)
      }
    }, 0)
  })
}

function handleClickOutside(event: MouseEvent) {
  // Ignore the exact event that triggered toggle
  if (event === lastToggledEvent) {
    lastToggledEvent = null
    return
  }

  if (
    showDropdown.value &&
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    showDropdown.value = false
    document.removeEventListener('click', handleClickOutside)
  }
}
const showMobileNotification = ref(false)
function toggleMobileNotification() {
  showMobileNotification.value = !showMobileNotification.value
}

function closeMobileNotification() {
  showMobileNotification.value = false
}
const router = useRouter()

const currentRoute = router.currentRoute

const status = ref(false)

async function navigateTo(path: string) {
  if(path == '/'){
    await router.push('/')
  } else router.push('/' + path)
  status.value = false
}

function toggleMenu() {
  status.value = !status.value
  console.log(status.value)
}

const iconPath = (icon: string) => new URL(`../assets/icons/${icon}`, import.meta.url).href

</script>

<template>
  <nav class="navbar">
    <button class="logo" @click="navigateTo('/')">
      ShopIT
    </button>

    <div class="mobile-icons mobile-only">
      <button class="mobile-icon" @click="toggleMobileNotification">
        <img class="icon" :src="iconPath('notifications.svg')" alt="notifications" />
      </button>
      <button class="mobile-icon" @click="toggleMenu">
        <img class="icon" :src="status ? iconPath('exit.svg') : iconPath('burger.svg')" alt="menu" />
      </button>
    </div>

    <div class="options" :class="{'open':status}">
      <div class="notification-wrapper desktop-only">
        <button class="notification-bell" @click="toggleNotifications">
          <img class="icon" :src="iconPath('notifications.svg')" alt="notifications" />
          <span class="option-text">{{ $t('notifications') }}</span>
        </button>

        <transition name="fade-slide">
          <!-- dropdownRef must be here -->
          <div v-if="showDropdown" ref="dropdownRef" class="dropdown-position">
            <NotificationDropdown />
          </div>
        </transition>
      </div>
      <button
        v-for="option in options"
        :key="option.label"
        class="option"
        id="button-option"
        type="button"
        @click="option.label === 'notifications' ? toggleNotifications() : navigateTo(option.path)"
        >
        <img class="icon" id="option-icon" :src="iconPath(option.icon)" :alt="$t(option.label)">
        <span class="option-text"
              :class="{active: currentRoute.name == option.path}">
          {{ $t(option.label) }}
        </span>
              </button>
    </div>



  </nav>
  <div
    v-if="showMobileNotification"
    class="notification-backdrop"
    @click.self="closeMobileNotification"
  >
    <!-- The sheet itself -->
    <div class="notification-sheet">
      <div class="sheet-content">
        <NotificationDropdown />
      </div>
    </div>
  </div>

</template>

<style scoped>

.navbar{
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  box-shadow: var(--global-box-shaddow);
  place-content: space-between;
  place-items: center;

  padding-left: 2.5%;
  padding-right: 2.5%;
}

.logo{
  height: 100%;
  place-content: center;
  cursor: pointer;

  background-color: transparent;
  border: none;
}

.logo:hover{
  transform: scale(1.05);
}

.options{
  height: 60%;
  display: flex;
  flex-direction: row;
}

.option{
  display: flex;
  flex-direction: row;
  height: 100%;
  margin: 5px;
  place-items: center;
  cursor: pointer;
  background-color: transparent;
  border: none;
}

.option:hover{
  transform: scale(1.05);
  text-decoration: underline var(--global-thicc-border-size) solid var(--color-dark-orange-text);
}

.option-text.active{
  border-bottom: var(--global-thicc-border-size) solid var(--color-dark-orange-text);
}

.icon{
  height: 100%;
}
.mobile-icons {
  display: none;
}

.mobile-icon {
  background: transparent;
  border: none;
  padding: 0 8px;
  display: flex;
  align-items: center;
  height: 40px;
}
.notification-bell {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 100%;
  padding: 0;
}
.notification-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%; /* Match other options */
  margin: 5px;
}
.notification-wrapper button {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0;
}


.desktop-only {
  display: block;
}
.mobile-only {
  display: none;
}
.mobile-icons {
  display: none;
}

@media (max-width: 800px) {
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: flex;
    align-items: center;
    gap: 12px; /* space between bell and burger */
  }

  .icon {
    height: 24px;
  }

  .mobile-notification .icon{
    height: 60%;
  }

  /* Hide options by default on mobile */
  .options {
    display: none; /* Hidden unless toggled open */
  }

  /* When the menu is open, display the options */
  .options.open {
    display: flex;
    flex-direction: column;
    position: fixed;
    place-content: center;
    background-color: white;

    top: 0;
    right: 0;
    left: 0;
    height: 100 %;
    width: 100%;

    z-index: 1;
  }

  #button-option {
    justify-content: center;
    height: 7.5%;
    padding: 10px;
    margin: 0;
  }


  .options.open #option-icon {
    display: none;
  }
  .mobile-icons {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative; /* Or use position: absolute if necessary */
    z-index: 2; /* higher than .options */
  }

  .notification-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50vh;
    width: 100vw;
    background: white;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease-out;
    overflow-y: auto;
  }

  .sheet-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    height:100%;
  }
  .notification-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--vt-c-transparent-black);
    display: flex;
    justify-content: center;
    align-items: flex-end; /* aligns sheet to bottom */
    z-index: 9998; /* under sheet */
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

