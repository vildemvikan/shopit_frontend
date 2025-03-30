<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { fetchChatList } from 'utils/Messages.ts'

const chatList = ref<any|null>('');

const emit = defineEmits(['select'])

onMounted(() => {
  fetchChats()
})

function sendSelectedChat() {
  emit('select', { itemId: 1, recipientId: "a@a"})
}

async function fetchChats() {
  fetchChatList()
}

</script>

<template>
  <h2>{{ $t('messages') }}</h2>

  <!--todo: display the top message at start. display a box if there are no chats -->
  <div class="message-cards">


  </div>

</template>

<style scoped>

</style>
