import { defineStore } from 'pinia'
import { Condition } from '@/stores/advertisementStore.ts'

export const displayStore = defineStore('display', {
  state: () => ({
    language: null as string | null,
    mode: null as string | null,
  }),

  actions: {
    updateLanguage(newLanguage: string) {
      this.language = newLanguage
    },
    updateMode(newMode: string) {
      this.mode = newMode
    },
  },
  persist: true,
})
