<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div class="header">
      <navbar></navbar>
  </div>
  <div class="view">
    <router-view></router-view>
  </div>
</template>

<style scoped>

.header{
  width: 100%;
  min-width: 350px;
  height: 7%;
  min-height: 50px;
}

.view{
  width: 100%;
  min-width: 350px;
  min-height: 93%;
  padding: 2vh 2.5% 2vh 2.5%;
}

@media (max-width: 1000px) {
  .view{
    height: fit-content;
    overflow: scroll;
  }
}

</style>
