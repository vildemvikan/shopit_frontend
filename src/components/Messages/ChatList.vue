<script setup lang="ts">
import { computed, onMounted, type Ref, ref, watch } from 'vue'
import type { ChatCardInfo, } from '@/interfaces/interfaces.ts'
import ChatCard from '@/components/Messages/ChatCard.vue'
import useEventsBus from '../../../utils/EventBus.ts'
import { fetchChatList } from '../../../utils/Messages.ts'
import { useTokenStore } from '@/stores/tokenStore.ts'
import webSocket from '../../../utils/WebSocket.ts'

const selectedChatId = ref<string | null>(null);

const chatList: Ref<ExtendedChatCardInfo[]> = ref([]);

const { emit } = useEventsBus();

export interface ExtendedChatCardInfo extends ChatCardInfo {
  hasUnreadMessage?: boolean;
}

const { bus } = useEventsBus();

watch(()=> bus.value.get('messageReceived'), async (val) => {
  chatList.value = await fetchChatList()

  const payload = JSON.parse(val[0].body)

  if (selectedChatId.value && selectedChatId.value !== payload.senderId + payload.itemId) {
    toggleNewMessage(payload.recipientId, payload.itemId, true)
  }
});

watch(()=> bus.value.get('messageSent'), async () => {
  setTimeout(async () => {
    chatList.value = await fetchChatList()
  }, 100)
});

const sortedMessages: Ref<ExtendedChatCardInfo[]> = computed(() => {
    return [...chatList.value].sort((a, b) => {
      return new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime();
    });
});

function isMobile() {
  return window.matchMedia('(max-width: 800px)').matches;
}


onMounted(async () => {
  // todo: responsive + her var det tomt gitt

  console.log("getting chat list")
  if (useTokenStore().getEmail && useTokenStore().getEmail !== null) {
    if (!webSocket.isConnected()) {
      webSocket.connect(useTokenStore().getEmail!)
    }
    chatList.value = await fetchChatList();
  }

  if (isMobile()) {
    return;
  }

  setTimeout(() => {
    if (chatList.value.length > 0) {
      emit('selectChat', {
        senderMail: chatList.value[0].senderId,
        recipientMail: chatList.value[0].recipientId,
        itemId: chatList.value[0].itemId,
      });
      document.getElementById(sortedMessages.value[0].recipientId+sortedMessages.value[0].itemId)?.classList.add('active');
    }
  }, 100)
})


const sendSelectedChat = (data: ChatCardInfo) => {
  document.querySelectorAll('.chat-list-box').forEach(item => {
    item.classList.remove('active');
  });

  toggleNewMessage(data.senderId, data.itemId, false)

  document.getElementById(data.recipientId+data.itemId)?.classList.add('active');

  selectedChatId.value = data.recipientId + data.itemId;

  emit('selectChat', {
    senderMail: data.senderId,
    recipientMail: data.recipientId,
    itemId: data.itemId,
  })
}

const toggleNewMessage = (recipientId: string, itemId: number, mode: boolean) => {
  const chat = chatList.value.find(
    c => c.senderId === recipientId && c.itemId === itemId
  );
  if (chat) {
      chat.hasUnreadMessage = mode;
  }
}

</script>

<template>
  <div class="message-cards">
    <div class="chat-list-box" :id="chat.recipientId + chat.itemId" @click="sendSelectedChat(chat)" :class="{ hasMessage : true}"
         v-for="chat in sortedMessages" :key="chat.recipientId + chat.itemId">
      <ChatCard
        :chat-card-data="chat"
      >
      </ChatCard>
    </div>
    <div class="advertisement">
      </div>
  </div>
</template>

<style scoped>
.message-cards {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  margin-right: 10px;
  padding-right: 5px;
}

.active {
  background-color: lightgray;
}

.chat-list-box:hover {
  background-color: lightgray
}

.chat-list-box {
  display: flex;
  flex-direction: row;
  width: 100%;
  border-radius: calc(var(--global-border-radius)/2);
  border: var(--global-border-size) solid var(--color-gray-divider);
  box-shadow: var(--global-box-shaddow);
  cursor: pointer;
}

</style>
