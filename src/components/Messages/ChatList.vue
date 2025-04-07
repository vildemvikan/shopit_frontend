<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { ChatCardInfo, ChatRoomInfo } from '@/interfaces/interfaces.ts'
import ChatCard from '@/components/Messages/ChatCard.vue'
import useEventsBus from '../../../utils/EventBus.ts'

const isUpdated = ref(false);
const selectedChatId = ref<string | null>(null);

const props = defineProps<{
  chatList: ChatCardInfo[],
}>();

const emit = defineEmits<{
  'selectChat': [chatInfo: ChatRoomInfo];
}>();

onMounted(() => {
  // todo: ref a boolean and check with watch
  if (props.chatList.length > 0) {
    emit('selectChat', {
      senderMail: props.chatList[0].senderId,
      recipientMail: props.chatList[0].recipientId,
      itemId: props.chatList[0].itemId,
    })
  }
})

const sendSelectedChat = (data: ChatCardInfo) => {
  document.querySelectorAll('.chat-list-box').forEach(item => {
    item.classList.remove('active');
  });

  document.getElementById(data.recipientId+data.itemId)?.classList.add('active');

  console.log("selected data sent: ", data.itemId, data.senderId)
  selectedChatId.value = data.recipientId;

  emit('selectChat', {
    senderMail: data.senderId,
    recipientMail: data.recipientId,
    itemId: data.itemId,
  })
}

</script>

<template>
  <div class="message-cards">
    <div class="chat-list-box" :id="chat.recipientId + chat.itemId" @click="sendSelectedChat(chat)" :class="{ hasMessage : true}"
         v-for="chat in chatList" :key="chat.recipientId + chat.itemId">
      <ChatCard
        :chat-card-data="chat">
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
