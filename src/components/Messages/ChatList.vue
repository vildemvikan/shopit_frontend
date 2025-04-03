<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import useEventsBus from '../../../utils/EventBus.ts'
import { send } from 'vite'
import type { Status } from '@/enums/enums.ts'
import type { Image } from '@/interfaces/interfaces.ts'
import { fetchChatList } from '../../../utils/Messages.ts'
import { useTokenStore } from '@/stores/tokenStore.ts'
import ChatCard from '@/components/Messages/ChatCard.vue'

const { emit } = useEventsBus();

const { bus } = useEventsBus();

const currentUser = ref<string | null>(null);
const selectedChatId = ref<string | null>(null);
let chatList = ref<ChatCard[]>([]);

export interface ChatCard {
  lastMessageContent: string,
  lastMessageTimestamp: string,
  lastSenderId: string,
  senderId: string,
  recipientId: string,
  itemId: number,
  status: Status
  itemImage: Image
  itemTitle: string,
  recipientProfilePic: string,
}

/*const props = defineProps<{
  message: ChatMessageNoTimeStamp
}>()*/

// todo: Propper dette slik at message --newMessage--> children
watch(()=> bus.value.get('messageReceived'), async (val) => {
  const messageFrom = val[0].recipientId;
});

onMounted(async () => {
  sessionStorage.setItem("email", "a@a");
  //let currentUser = useTokenStore().email!;
  currentUser.value = sessionStorage.getItem("email")!;
  console.log("getting chat list")
  chatList.value = await fetchChatList(currentUser.value);
})

const sendSelectedChat = (data: ChatCard) => {
  console.log("selected data sent: ", data.itemId, data.senderId)
  selectedChatId.value = data.recipientId;
  const info = {
    senderMail: data.senderId,
    recipientMail: data.recipientId,
    itemId: data.itemId,
    profileImgUrl: "",
  }
  console.log(info)

  emit('selectChat', {
    senderMail: data.senderId,
    recipientMail: data.recipientId,
    itemId: data.itemId,
    profileImgUrl: "",
  })
}

</script>

<template>
  <div class="message-cards">
    <div class="chat-list-box" :id="chat.recipientId + chat.itemId" @click="sendSelectedChat(chat)" :class="{ hasMessage : true}"
         v-for="(chat) in chatList" :key="chat.recipientId + chat.itemId">
      {{ chat }}
    </div>
  </div>
</template>

<style scoped>
.placeholder {
  width: 50vh;
  height:50vh;
  max-width: 50%;
  background-color: white;
}

.chat-list-box {
  border: solid;
  border-radius: var(--global-border-radius);
}
</style>
