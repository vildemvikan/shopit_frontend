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
  height: 7.5%;
  min-height: 50px;
}

.view{
  width: 100%;
  height: 100%;
  padding-left: 2.5%;
  padding-right: 2.5%;
  padding-top: 2vh;
}

</style>
