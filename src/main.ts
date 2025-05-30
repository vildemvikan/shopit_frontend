import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'

import en from './assets/transcripts/en.json'
import no from './assets/transcripts/no.json'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useTokenStore } from '@/stores/tokenStore.ts'

const app = createApp(App)

const messages = { no, en }

const i18n = createI18n({
  locale: 'en', // default language
  fallbackLocale: 'en',
  messages,
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(Toast, {
  position: 'bottom-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnHover: true,
})

app.use(pinia)
app.use(router)
app.use(i18n)

const tokenStore = useTokenStore()
tokenStore.initializeTimer()

app.mount('#app')
