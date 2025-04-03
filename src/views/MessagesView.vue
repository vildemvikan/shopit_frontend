<script setup lang="ts">

import MessageList from '@/components/Messages/ChatList.vue'
import Chat from '@/components/Messages/Chat.vue'
import { onMounted, onUnmounted, ref } from 'vue'

const currenUserMail = ref("a@a");
const currentItemId = ref(1);

</script>

<template>
  <h2>{{ $t('messages') }}</h2>

 <div class="container">
   <div class="chat-list-wrapper">
     <message-list></message-list>
   </div>
   <div class="chat-wrapper">
     <chat
       :current-user="currenUserMail"
       :item-id="currentItemId"
     ></chat>
   </div>
 </div>

</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.chat-list-wrapper, .chat-wrapper{
  width: 50%;
  max-width: 50%;
}


</style>
