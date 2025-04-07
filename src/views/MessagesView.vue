<script setup lang="ts">

import MessageList from '@/components/Messages/ChatList.vue'
import Chat from '@/components/Messages/Chat.vue'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { fetchChatList } from '../../utils/Messages.ts'
import type { ChatCardInfo, ChatMessage, ChatRoomInfo } from '@/interfaces/interfaces.ts'
import useEventsBus from '../../utils/EventBus.ts'

const chatList = ref<ChatCardInfo[]>([]);
let currentChatRoomInfo = reactive<ChatRoomInfo>({
  senderMail: "",
  recipientMail: "",
  itemId: 0,
  }
);

const { bus } = useEventsBus();

watch(()=> bus.value.get('messageReceived'), async () => {
  chatList.value = await fetchChatList(currentChatRoomInfo.senderMail)
});

watch(()=> bus.value.get('messageSent'), async () => {
  chatList.value = await fetchChatList(currentChatRoomInfo.senderMail)
});

// todo: computed property that sorts chatlist based on last message timestamp

onMounted(async ()=> {
  //sessionStorage.setItem("email", "a@a");
  //todo: let currentUser = useTokenStore().email!;
  currentChatRoomInfo.senderMail = sessionStorage.getItem("email")!;
  console.log("getting chat list")
  chatList.value = await fetchChatList(currentChatRoomInfo.senderMail);

  // select top chat
  if (chatList.value.length > 0) {
    onSelectedChatCard({
      senderMail: chatList.value[0].senderId,
      recipientMail: chatList.value[0].recipientId,
      itemId: chatList.value[0].itemId,
    })
  }
  //select top chat or last active chat - session storage*/
})

watch(() => sessionStorage.getItem("email"), async (val) => {
  console.log("change in current user")
  currentChatRoomInfo.senderMail = sessionStorage.getItem("email")!;
  chatList.value = await fetchChatList(currentChatRoomInfo.senderMail);
})

watch(()=> bus.value.get('messageReceived'), async (val) => {
  const payload = JSON.parse(val[0].body)
  console.log(payload)
  //chatList.value.push(payload)
});

const isUpdated = ref(false);

const onSelectedChatCard = (data: ChatRoomInfo) => {
  isUpdated.value = false;
  currentChatRoomInfo.senderMail = data.senderMail;
  currentChatRoomInfo.recipientMail = data.recipientMail;
  currentChatRoomInfo.itemId = data.itemId;
  isUpdated.value = true;
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
