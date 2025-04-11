<script setup lang="ts">
import { computed, onMounted, type Ref, ref, watch } from 'vue'
import type { ChatCardInfo, } from '@/interfaces/interfaces.ts'
import ChatCard from '@/components/Messages/ChatCard.vue'
import useEventsBus from '../../../utils/EventBus.ts'
import { fetchChatList } from '../../../utils/Messages.ts'
import { useTokenStore } from '@/stores/tokenStore.ts'
import webSocket from '../../../utils/WebSocket.ts'
import Pagination from '@/components/Pagination.vue'
import { useRoute } from 'vue-router'

const selectedChatId = ref<string | null>(null);
const chatList: Ref<ExtendedChatCardInfo[]> = ref([]);

const { emit } = useEventsBus();
const { bus } = useEventsBus();
const route = useRoute();

export interface ExtendedChatCardInfo extends ChatCardInfo {
  hasUnreadMessage?: boolean;
}

watch(()=> bus.value.get('messageReceived'), async (val) => {
  await fetchChatRooms()
  const payload = JSON.parse(val[0].body)
  if (selectedChatId.value && selectedChatId.value !== payload.senderId + payload.itemId) {
    toggleNewMessage(payload.recipientId, payload.itemId, true)
  }
});

watch(()=> bus.value.get('messageSent'), async () => {
  setTimeout(async () => {
    await fetchChatRooms()
  }, 100)
});

onMounted(async () => {
  if (!webSocket.isConnected()) {
    webSocket.connect(useTokenStore().getEmail!)
  }
  await fetchChatRooms();

  setTimeout(() => {
    if (chatList.value.length > 0) {
      if(route.query.itemId && route.query.recipientId){
        const recipientId = route.query.recipientId
        const itemId = route.query.itemId
        sendSelectedChat({
          recipientId: recipientId,
          itemId:itemId,
          senderId: useTokenStore().getEmail
        })
      } else {
        sendSelectedChat(chatList.value[0])
      }
    }
  }, 100)
})

const page = ref<number>(0)
const SIZE:number = 4
const pages = ref<number>(0)



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

async function changePage(newPage:number){
  page.value = newPage
  await fetchChatRooms()
}

async function fetchChatRooms(){
  try{
    const result = await fetchChatList(SIZE, page.value);
    pages.value = result.totalPages
    chatList.value = result.content
  } catch (error){
    console.error(error)
  }
}

</script>

<template>
  <div class="message-cards">
    <div class="chats">
      <div class="chat-list-box"
           v-for="chat in chatList"
           :key="chat.recipientId + chat.itemId"
           :id="chat.recipientId + chat.itemId"
           :class="{ hasMessage : true, active: (chat.recipientId + chat.itemId) == selectedChatId }"
           @click="sendSelectedChat(chat)">
        <ChatCard
          :chat-card-data="chat"
        />
      </div>
    </div>
    <div class="pages">
      <Pagination
        @page-change="changePage"
        :total-pages="pages"
        :current-page="page"/>
    </div>
  </div>

</template>

<style scoped>
.message-cards {
  display: flex;
  flex-direction: column;

  height: 100%;
  width: 100%;

  padding-right: 10px;
  place-content: space-between;
  align-items: center;
}

.chats{
  display: flex;
  flex-direction: column;
  height: 90%;
  width: 100%;
  gap: 10px;
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
  height: calc(calc(100% - 3*10px) / 4);
  border-radius: calc(var(--global-border-radius)/2);
  border: var(--global-border-size) solid var(--color-gray-divider);
  box-shadow: var(--global-box-shaddow);
  cursor: pointer;
}

.pagination{
  width: 100%;
}

@media (max-width: 800px) {

  .active{
    background-color: transparent;
  }
}

</style>
