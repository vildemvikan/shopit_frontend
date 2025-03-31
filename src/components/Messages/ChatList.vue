<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchChatList } from 'utils/Messages.ts'
import useEventsBus from '../../../utils/EventBus.ts'
import { send } from 'vite'

const { emit } = useEventsBus();

const chatList = ref<any | null>('');
const selectedChat = ref<ChatElementIdentifier|null>();

onMounted(() => {
  fetchChats()
})


async function fetchChats() {
  // fetchChatList
}

interface ChatElementIdentifier{
  senderMail: string,
  recipientMail: string,
  itemId: number
}


function sendSelectedChat() {
  emit('selectChat', {senderMail: "a@a", recipientMail: "b@b", itemId: 1})
}

</script>

<template>
  <h2>{{ $t('messages') }}</h2>

  <!--todo: display the top message at start. display a box if there are no chats -->
  <div class="message-cards">
    <button @click="sendSelectedChat">hello</button>
  </div>
</template>

<style scoped></style>
