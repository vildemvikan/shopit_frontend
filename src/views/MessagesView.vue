<script setup lang="ts">

import MessageList from '@/components/Messages/ChatList.vue'
import Chat from '@/components/Messages/Chat.vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { fetchChatList } from '../../utils/Messages.ts'
import type { ChatCardInfo, ChatRoomInfo } from '@/interfaces/interfaces.ts'
import useEventsBus from '../../utils/EventBus.ts'
import { useTokenStore } from '@/stores/tokenStore.ts'
import webSocket from '../../utils/WebSocket.ts'

const chatList = ref<ChatCardInfo[]>([]);
const currentChatRoomInfo = reactive<ChatRoomInfo>({
  senderMail: "",
  recipientMail: "",
  itemId: 0,
  }
);

const hasSelectedMessage = ref(false);

const { bus } = useEventsBus();

watch(()=> bus.value.get('selectChat'), () => {
  hasSelectedMessage.value = true;
})

watch(()=> bus.value.get('closeChat'), () => {
  hasSelectedMessage.value = false;
})

const isChatEmpty = computed (()=> {
  return chatList.value.length === 0;
})

onMounted(async ()=> {
  if (useTokenStore().getEmail && useTokenStore().getEmail !== null) {
    if (!webSocket.isConnected()) {
      webSocket.connect(useTokenStore().getEmail!)
    }
    currentChatRoomInfo.senderMail = useTokenStore().getEmail!;
    chatList.value = await fetchChatList();
  }
})

</script>

<template>
  <h2>{{ $t('messages') }}</h2>

 <div class="container">
   <div v-if="!isChatEmpty" class="chat-list-wrapper"
        :class="!hasSelectedMessage ? 'selected' : 'unselected'">
     <message-list
       :current-user="currentChatRoomInfo.senderMail"
     ></message-list>
   </div>
   <button @click="hasSelectedMessage = false"></button>
   <div v-if="!isChatEmpty" class="chat-wrapper"
        :class="hasSelectedMessage ? 'selected' : 'unselected'">
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

@media (max-width: 800px) {
  .selected {
    width: 100%;
    max-width: 100%;
  }
  .unselected {
    display:none
  }
}
</style>
