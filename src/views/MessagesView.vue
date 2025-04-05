<script setup lang="ts">

import MessageList, { type ChatRoomInfo } from '@/components/Messages/ChatList.vue'
import Chat from '@/components/Messages/Chat.vue'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { fetchChatList } from '../../utils/Messages.ts'
import type { ChatCardInfo } from '@/interfaces/interfaces.ts'

const chatList = ref<ChatCardInfo[]>([]);
let currentChatRoomInfo = reactive<ChatRoomInfo>({
  senderMail: "",
  recipientMail: "",
  itemId: 0,
  profileImgUrl: "",
  }
);

onMounted(async ()=> {
  sessionStorage.setItem("email", "a@a");
  //todo: let currentUser = useTokenStore().email!;
  currentChatRoomInfo.senderMail = sessionStorage.getItem("email")!;
  console.log("getting chat list")
  chatList.value = await fetchChatList(currentChatRoomInfo.senderMail);
  //select top chat or last active chat - session storage
})

const onSelectedChatCard = (data: ChatRoomInfo) => {
  currentChatRoomInfo.senderMail = data.senderMail;
  currentChatRoomInfo.recipientMail = data.recipientMail;
  currentChatRoomInfo.itemId = data.itemId;
  currentChatRoomInfo.profileImgUrl = data.profileImgUrl;
}


</script>

<template>
  <h2>{{ $t('messages') }}</h2>

 <div class="container">
   <div class="chat-list-wrapper">
     <message-list
       :chat-list="chatList"
       @select-chat="onSelectedChatCard"
     ></message-list>
   </div>
   <div class="chat-wrapper">
     <Chat :current-chat-room-info="currentChatRoomInfo"
     ></Chat>
   </div>
 </div>

</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  gap: 2vh;
  background-color: var(--color-lavendel-background);
  padding: 2vh 20vh 2ch  20vh;
  border-radius: var(--global-border-radius);
}

.chat-list-wrapper, .chat-wrapper{
  width: 50%;
  max-width: 50%;
}


</style>
