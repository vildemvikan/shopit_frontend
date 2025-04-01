<script setup lang="ts">

import MessageList from '@/components/Messages/ChatList.vue'
import Chat from '@/components/Messages/Chat.vue'
import { ref } from 'vue'

const selectedChat = ref('');

</script>

<template>
  <h2>{{ $t('messages') }}</h2>

 <div class="container">
   <div class="sub-containers">
     <message-list></message-list>
   </div>
   <div class="sub-container">
     <chat></chat>
   </div>
 </div>

</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.sub-container {
  width: 50%
}

</style>
