import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'

import en from './assets/transcripts/en.json'
import no from './assets/transcripts/no.json'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const app = createApp(App)

const messages = { no, en }

const i18n = createI18n({
  locale: 'en', // default language
  fallbackLocale: 'en',
  messages
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
