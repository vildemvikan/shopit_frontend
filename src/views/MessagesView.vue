<script setup lang="ts">

import MessageList from '@/components/Messages/ChatList.vue'
import Chat from '@/components/Messages/Chat.vue'
import { computed, onMounted, onUnmounted, reactive, type Ref, ref, watch } from 'vue'
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

const isChatEmpty = computed (()=> {
  return chatList.value.length === 0;
})

watch(()=> bus.value.get('messageReceived'), async () => {
  chatList.value = await fetchChatList(currentChatRoomInfo.senderMail)
});

watch(()=> bus.value.get('messageSent'), async () => {
  setTimeout(async () => {
    chatList.value = await fetchChatList(currentChatRoomInfo.senderMail)
  }, 100)
});

const sortedMessages: Ref<ChatCardInfo[]> = computed(() => {
  return [...chatList.value].sort((a, b) => {
    return new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime();
  });
});

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

const isUpdated = ref(false);

watch(()=> bus.value.get('selectChat'), (val) => {
  {
    currentChatRoomInfo.senderMail = val[0].senderMail;
    currentChatRoomInfo.recipientMail = val[0].recipientMail;
    currentChatRoomInfo.itemId = val[0].itemId;
  }
})

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
   <div v-if="!isChatEmpty" class="chat-list-wrapper">
     <message-list
       :chat-list="sortedMessages"
       @select-chat="onSelectedChatCard"
     ></message-list>
   </div>
   <div v-if="!isChatEmpty"class="chat-wrapper">
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

@media (max-width: 1000px) {

  .chat-list-wrapper, .chat-wrapper{
    width: 100%;
    max-width: 100%;
  }
}


</style>
