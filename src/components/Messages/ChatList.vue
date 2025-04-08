<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { ChatCardInfo, ChatMessage, ChatRoomInfo } from '@/interfaces/interfaces.ts'
import ChatCard from '@/components/Messages/ChatCard.vue'
import useEventsBus from '../../../utils/EventBus.ts'

const selectedChatId = ref<string | null>(null);

const props = defineProps<{
  chatList: ExtendedChatCardInfo[],
}>();

const { emit } = useEventsBus();

interface ExtendedChatCardInfo extends ChatCardInfo {
  hasUnreadMessage?: boolean;
}


const { bus } = useEventsBus();
watch(()=> bus.value.get('messageReceived'), async (val) => {
  const payload = JSON.parse(val[0].body)
  console.log(payload)

  if (selectedChatId && selectedChatId.value !== payload.recipientId + payload.itemId) {
    toggleNewMessage(payload.recipientId, payload.itemId, true)
  }
});

onMounted(() => {
  // todo: ref a boolean and check with watch
  setTimeout(() => {
    if (props.chatList.length > 0) {
      emit('selectChat', {
        senderMail: props.chatList[0].senderId,
        recipientMail: props.chatList[0].recipientId,
        itemId: props.chatList[0].itemId,
      });
      document.getElementById(props.chatList[0].recipientId+props.chatList[0].itemId)?.classList.add('active');
    }
  }, 30)
})


const sendSelectedChat = (data: ChatCardInfo) => {
  document.querySelectorAll('.chat-list-box').forEach(item => {
    item.classList.remove('active');
  });

  toggleNewMessage(data.recipientId, data.itemId, false)

  document.getElementById(data.recipientId+data.itemId)?.classList.add('active');

  console.log("selected data sent: ", data.itemId, data.senderId)
  selectedChatId.value = data.recipientId + data.itemId;

  emit('selectChat', {
    senderMail: data.senderId,
    recipientMail: data.recipientId,
    itemId: data.itemId,
  })
}

const toggleNewMessage = (recipientId: string, itemId: number, mode: boolean) => {
  const chat = props.chatList.find(
    c => c.recipientId === recipientId && c.itemId === itemId
  );
  if (chat) {
    chat.hasUnreadMessage = mode;
  }
}

</script>

<template>
  <div class="message-cards">
    <div class="chat-list-box" :id="chat.recipientId + chat.itemId" @click="sendSelectedChat(chat)" :class="{ hasMessage : true}"
         v-for="chat in chatList" :key="chat.recipientId + chat.itemId">
      <ChatCard
        :chat-card-data="chat"
        :has-unread-msg="chat.hasUnreadMessage || false"
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
