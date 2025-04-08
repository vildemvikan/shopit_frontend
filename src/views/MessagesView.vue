<script setup lang="ts">

import MessageList from '@/components/Messages/ChatList.vue'
import Chat from '@/components/Messages/Chat.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { fetchChatList } from '../../utils/Messages.ts'
import type { ChatCardInfo, ChatRoomInfo } from '@/interfaces/interfaces.ts'

const chatList = ref<ChatCardInfo[]>([]);
let currentChatRoomInfo = reactive<ChatRoomInfo>({
  senderMail: "",
  recipientMail: "",
  itemId: 0,
  }
);

const hasSelectedMessage = ref(false);

const isChatEmpty = computed (()=> {
  return chatList.value.length === 0;
})

onMounted(async ()=> {
  currentChatRoomInfo.senderMail = sessionStorage.getItem("email")!;
  chatList.value = await fetchChatList(currentChatRoomInfo.senderMail);
})

</script>

<template>
  <h2>{{ $t('messages') }}</h2>

 <div class="container">
   <div v-if="!isChatEmpty" class="chat-list-wrapper">
     <message-list
       :current-user="currentChatRoomInfo.senderMail"
     ></message-list>
   </div>
   <button>back</button>
   <div v-if="!isChatEmpty" class="chat-wrapper">
     <Chat></Chat>
   </div>
 </div>

</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  gap: 2vh;
  background-color: var(--color-lavendel-background);
  padding: 2vh 2vh;
  border-radius: var(--global-border-radius);
  min-height: 85vh;
  max-height: 85vh;
  height: 85vh;
  justify-content: center;
}

.chat-list-wrapper, .chat-wrapper{
  width: 50%;
  max-width: 50%;
}

@media (max-width: 8000px) {

  .chat-list-wrapper, .chat-wrapper{
    width: 100%;
    max-width: 100%;
  }
}


</style>
