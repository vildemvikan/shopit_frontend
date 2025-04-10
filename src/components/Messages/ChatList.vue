<script setup lang="ts">
import { computed, onMounted, type Ref, ref, watch } from 'vue'
import type { ChatCardInfo, } from '@/interfaces/interfaces.ts'
import ChatCard from '@/components/Messages/ChatCard.vue'
import useEventsBus from '../../../utils/EventBus.ts'
import { fetchChatList } from '../../../utils/Messages.ts'
import { useTokenStore } from '@/stores/tokenStore.ts'
import webSocket from '../../../utils/WebSocket.ts'
import { a } from 'vitest/dist/chunks/suite.d.FvehnV49'

const selectedChatId = ref<string | null>(null);
const chatList: Ref<ExtendedChatCardInfo[]> = ref([]);

const { emit } = useEventsBus();
const { bus } = useEventsBus();

export interface ExtendedChatCardInfo extends ChatCardInfo {
  hasUnreadMessage?: boolean;
}

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

const sortedMessages: ref<ExtendedChatCardInfo[]> = computed(() => {
    return [...chatList.value].sort((a, b) => {
      return new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime();
    });
});

function isMobile() {
  return window.matchMedia('(max-width: 800px)').matches;
}

onMounted(async () => {
  if (!webSocket.isConnected()) {
    webSocket.connect(useTokenStore().getEmail!)
  }
  chatList.value = await fetchChatList()

  await console.log(chatList.value)

  setTimeout(() => {
    if (chatList.value.length > 0) {
      sendSelectedChat(chatList.value[0])
    }
  }, 100)
})

const sendSelectedChat = (data: ChatCardInfo) => {
  toggleNewMessage(data.senderId, data.itemId, false)
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
  if (chat) { chat.hasUnreadMessage = mode; }
}

</script>

<template>
  <div class="message-cards">
    <div class="chat-list-box"
         v-for="chat in sortedMessages"
         :key="chat.recipientId + chat.itemId"
         :id="chat.recipientId + chat.itemId"
         :class="{ hasMessage : true, active: (chat.recipientId + chat.itemId) == selectedChatId }"
         @click="sendSelectedChat(chat)">
      <ChatCard
        :chat-card-data="chat"
      />
    </div>
    <div class="advertisement">
      </div>
  </div>
</template>

<style scoped>
.message-cards {
  display: flex;
  flex-direction: column;

  height: 100%;
  width: 100%;
  gap: 1rem;
  padding-right: 10px;
}

.active {
  background-color: var(--color-active-chat);
}

.chat-list-box:hover {
  transform: scale(1.01);
}

.chat-list-box {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(100% / 4);
  border-radius: calc(var(--global-border-radius)/2);
  border: var(--global-border-size) solid var(--color-gray-divider);
  box-shadow: var(--global-box-shaddow);
  cursor: pointer;
}

@media (max-width: 800px) {

  .active{
    background-color: transparent;
  }
}

</style>
