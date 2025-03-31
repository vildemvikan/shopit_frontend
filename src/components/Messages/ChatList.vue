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
  <div class="placeholder">hello</div>

  <!--todo: display the top message at start. display a box if there are no chats -->
  <div class="message-cards">
    <button @click="sendSelectedChat">hello</button>
  </div>
</template>

<style scoped>
.placeholder {
  width: 50vh;
  height:50vh;
  max-width: 50%;
  background-color: white;
}
</style>
