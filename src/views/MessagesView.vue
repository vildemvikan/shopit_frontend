<script setup lang="ts">

import MessageList from '@/components/Messages/ChatList.vue'
import Chat from '@/components/Messages/Chat.vue'
import { ref } from 'vue'

const selectedChat = ref('');
</script>

<template>
  <message-list @select="selectedChat = $event"></message-list>
  <chat :selected-chat="selectedChat"></chat>

</template>

<style scoped>

</style>
