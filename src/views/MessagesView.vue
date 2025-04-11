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
    const result = await fetchChatList(4, 0);
    chatList.value = result.content
  }
})

</script>

<template>
  <div class="messages-view">
    <h1 class="title"
        :class="!hasSelectedMessage ? 'selected' : 'unselected'">
      {{ $t('messages') }}</h1>

    <div class="container" :class="{select: hasSelectedMessage}" v-if="!isChatEmpty">
      <div class="chat-list-wrapper"
           :class="!hasSelectedMessage ? 'selected' : 'unselected'">
        <message-list
          :current-user="currentChatRoomInfo.senderMail"
        />
      </div>

      <div v-if="!isChatEmpty"
           class="chat-wrapper"
           :class="hasSelectedMessage ? 'selected' : 'unselected'">
        <Chat
          @close="hasSelectedMessage = false"
        />
      </div>
    </div>
    <div class="container" v-else id="no-chats">
      <label>{{$t('placeholder-no-chatrooms')}}</label>
    </div>
  </div>

</template>

<style scoped>

.messages-view{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.button{
  display: none;
}
.title{
  text-decoration: underline;
}
.container {
  display: flex;
  flex-direction: row;
  padding: 10px 0;
  height: 95%;
  width: 100%;
  justify-content: center;
}

.chat-list-wrapper, .chat-wrapper{
  width: 50%;
  height: 100%;
}

#no-chats{
  display: flex;
  flex-direction: column;
  border: var(--global-border-size) solid var(--color-gray-divider);
  border-radius: var(--global-border-radius);
  place-content: center;
  align-items: center;
  margin-top: 20px;
}

@media (max-width: 800px) {

  .container{
    height: 100%;
  }

  .chat-list-wrapper{
    height: 95%;
  }

  .selected {
    width: 100%;
  }

  .unselected {
    display:none
  }
}



</style>
