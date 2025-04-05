<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import useEventsBus from '../../../utils/EventBus.ts'
import type { ChatCardInfo } from '@/interfaces/interfaces.ts'
import ChatCard from '@/components/Messages/ChatCard.vue'

const { bus } = useEventsBus();

const selectedChatId = ref<string | null>(null);

const props = defineProps<{
  chatList: ChatCardInfo[],
}>();

const emit = defineEmits<{
  'selectChat': [chatInfo: ChatRoomInfo];
}>();

// todo: Propper dette slik at message --newMessage--> children
watch(()=> bus.value.get('messageReceived'), async (val) => {
  const messageFrom = val[0].recipientId;
});

/*
onMounted(async () => {
  sessionStorage.setItem("email", "a@a");
  //todo: let currentUser = useTokenStore().email!;
  currentUser.value = sessionStorage.getItem("email")!;
  console.log("getting chat list")
  chatList.value = await fetchChatList(currentUser.value);
})*/

const sendSelectedChat = (data: ChatCardInfo) => {
  console.log("selected data sent: ", data.itemId, data.senderId)
  selectedChatId.value = data.recipientId;

  emit('selectChat', {
    senderMail: data.senderId,
    recipientMail: data.recipientId,
    itemId: data.itemId,
    profileImgUrl: "",
  })
}

export interface ChatRoomInfo {
  senderMail: string
  recipientMail: string
  itemId: number
  profileImgUrl: string,
}

</script>

<template>
  <div class="message-cards">
    <div class="chat-list-box" :id="chat.recipientId + chat.itemId" @click="sendSelectedChat(chat)" :class="{ hasMessage : true}"
         v-for="(chat) in chatList" :key="chat.recipientId + chat.itemId">
      {{ chat }}
    </div>
    <ChatCard>
    </ChatCard>
  </div>
</template>

<style scoped>
.message-cards {
  display: flex;
  flex-direction: column;
}

.chat-list-box:hover {
  background-color: lightgray;
}

.placeholder {
  width: 50vh;
  height:50vh;
  max-width: 50%;
  background-color: white;
}

.chat-list-box {
  border: solid;
  border-bottom: none;
}
</style>
