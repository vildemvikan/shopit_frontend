<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { fetchChatLog } from '../../../utils/Messages.ts'

const chatMessages = ref<any|null>();

const props = defineProps(['selectedChat'])

// on selected user, choose the user and retrieve messages from backend to display

onMounted(() => {
  chatMessages.value = fetchChatLog();
  // todo: Retrieve chat messages
})

function displayMessages() {

}

</script>

<template>

  <div class="profile-info">
  </div>

  <div v-if="selectedChat">
    <div class="chat-box">
    </div>
  </div>

</template>

<style scoped>

</style>
