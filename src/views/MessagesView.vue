<script setup lang="ts">

import MessageList from '@/components/Messages/ChatList.vue'
import Chat from '@/components/Messages/Chat.vue'
import { ref } from 'vue'

const selectedChat = ref('');

</script>

<template>
  <message-list></message-list>
  <chat></chat>

</template>

<style scoped>

</style>
