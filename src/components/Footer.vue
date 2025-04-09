<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { displayStore } from '@/stores/displayStore.ts'
const { t, locale } = useI18n()

const display = displayStore()

const theme = ref<'manual-light' | 'manual-dark'>('manual-light')

function toggleTheme(newTheme: 'manual-light' | 'manual-dark') {
  display.updateMode(newTheme)
  theme.value = newTheme
}

function changeLanguage(lang: string) {
  display.updateLanguage(lang)
  locale.value = lang
}

watch(theme, (newTheme) => {
  const root = document.documentElement
  root.classList.remove('manual-light', 'manual-dark')
  root.classList.add(newTheme)
})
</script>

<template>
  <div class="content">

    <div class="modes">
      <div class="mode" id="dark-mode">
        <img src="@/assets/icons/dark.svg"
             alt="dark mode"
             class="icon"
             @click="toggleTheme('manual-dark')"
        >
      </div>
      <div class="mode" id="light">
        <img src="@/assets/icons/light.svg"
             alt="light mode"
             class="icon"
             @click="toggleTheme('manual-light')"
        >
      </div>
    </div>
    <div class="languages">
      <img src="@/assets/icons/norwegian.svg.webp"
           v-if="locale == 'no'"
           alt="norwegian"
           class="icon"
           @click="changeLanguage('en')"
      >
      <img src="@/assets/icons/english.svg.webp"
           v-if="locale == 'en'"
           alt="english"
           class="icon"
           @click="changeLanguage('no')"
      >
    </div>

  </div>

</template>

<style scoped>
.content{
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  background-color: var(--color-lavendel-background);
  align-items: center;
  place-content: end;
  gap: 20px;
  padding: 0 20px;
}

.languages{
  display: flex;
  flex-direction: row;
  height: 50%;
}

.modes{
  display: flex;
  flex-direction: row;
  height: 80%;
}

.mode{
  height: 100%;
  aspect-ratio: 1/1;
  padding: 5px;
}

#dark-mode{
  border-right: 2px solid black;
}

.icon{
  height: 100%;
}

.icon:hover{
  transform: scale(1.05);
  cursor: pointer;
}

</style>
