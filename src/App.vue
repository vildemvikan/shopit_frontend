<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { onMounted } from 'vue'
import Footer from '@/components/Footer.vue'
import { useI18n } from 'vue-i18n'
import { displayStore } from '@/stores/displayStore'

const store = displayStore()
const { locale } = useI18n()
onMounted(() => {
  if (store.language) {
    locale.value = store.language
  }
  if (store.mode) {
    document.documentElement.classList.add(store.mode)
  }
})
</script>

<template>
  <div class="header">
    <navbar></navbar>
  </div>
  <div class="view">
    <router-view></router-view>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.header {
  width: 100%;
  min-width: 350px;
  height: 7%;
  min-height: 50px;
}

.view {
  position: relative;
  width: 100%;
  min-width: 350px;
  min-height: calc(816px - 50px);
  height: 100vh;
  padding: 2vh 2.5% 2vh 2.5%;
  overflow: scroll;
}

.footer {
  position: absolute;
  left: 0;
  margin-top: 15px;
  height: 7%;
  min-height: 50px;
  width: 100%;
}
</style>
