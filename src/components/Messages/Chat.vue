<script setup lang="ts">
import { onMounted, reactive, type Ref, ref, type UnwrapRef, watch } from 'vue'
import { fetchChatMessages, fetchProfileInfo } from '../../../utils/Messages.ts'
import useEventsBus from '../../../utils/EventBus.ts'
import type { ChatMessage } from '@/interfaces/interfaces.ts'
import type { UserInfo } from '@/interfaces/interfaces.ts'
import websocketService from '../../../utils/WebSocket.ts'

const { bus } = useEventsBus();

const chatMessageInfo: Ref<ChatMessage[]>= ref([]);
const selectedUser: Ref<string | null> = ref(null);
const itemId: Ref<number> = ref(0);

const props = defineProps({
  currentUser: String,
  //itemId: Number,
  //selectedUser: String
})
const profileInfo = ref();
const messageText = ref('');

watch(()=> bus.value.get('selectChat'), async (val) => {
  console.log("selected data received: ", val[0])
  const userInfo = val[0];
  selectedUser.value = userInfo.recipientMail
  itemId.value = userInfo.itemId;
  await displayMessages(userInfo)
  displayProfile(userInfo.profileImgUrl, userInfo.recipientMail)
});

watch(()=> bus.value.get('message'), async (val) => {
  chatMessageInfo.value.push(val[0])
});

const displayMessages = async (userInfo: UserInfo) => {
  chatMessageInfo.value = await fetchChatMessages(userInfo.senderMail, userInfo.recipientMail, userInfo.itemId);
  for (let i = 0; i < chatMessageInfo.value.length; i++)  {
    console.log(chatMessageInfo.value[i])
  }
}

const displayMessage = (senderMail: string, recipientMail: string, itemId: number, content: string, timestamp: Date) => {
  const newChatMsg: ChatMessage = {
    senderId: senderMail,
    recipientId: recipientMail,
    itemId,
    content,
    timestamp
  }
  chatMessageInfo.value.push(newChatMsg)
}

const displayProfile = (url: string, profileMail: string) => {
  profileInfo.value = { url: url, firstName: "hello", lastName: "world"}
  profileInfo.value.url = "/src/assets/icons/profile.svg";
}

const sendMessage = (e: Event) => {
  console.log(e)
  // prevent line break on ENTER key press
  e.preventDefault()
  // todo:set character length limit
  if (messageText.value.innerText.trim() === "") return;
  const message = messageText.value.innerText.trimEnd();

  const websocket = websocketService;
  websocket.sendMessage(props.currentUser!, selectedUser.value!, itemId.value!, message, new Date(8.64e15));
  //todo: send message
  displayMessage(props.currentUser!, selectedUser.value!, itemId.value!, message, Date.prototype);
  console.log("text :", message)
  messageText.value.innerText= "";
}

const isActive = () => {
  return selectedUser.value !== null;
}
</script>

<template>
  <div class="chat-container">
    <div class="profile">
      <img src="/src/assets/icons/profile.svg" alt="profile-pic">
      selected: {{selectedUser}} current logged in: {{ props.currentUser}} item: {{props.itemId}}
    </div>
    <div class="message-box" :class="{ hidden : false}">
      <div
        v-for="info in chatMessageInfo"
        :class="['message', info.senderId === selectedUser ? 'receiver' : 'sender']">
        <p>{{info.content}}</p>
      </div>
    </div>

    <div class="input">
      <div class="message-wrapper">
        <div
          ref="messageText"
          class="message-text"
          contentEditable="true"
          @keydown.enter="sendMessage($event)"
          :placeholder-text="$t('chat-message-placeholder')"></div>
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hidden {
  display: none;
}

.profile img {
  max-width: 20px;
  max-height: 20px;
}

.message-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.message {
  margin: 1px;
  border-radius: calc(var(--global-border-radius)*1.5);
  max-width: 80%;

  overflow-y: auto;
  overflow-x: hidden;
  max-height: 7em;

  padding: 0.25rem 0.6rem;
}

.message p {
  word-wrap: break-word;
}

.sender {
  align-self: flex-end;
  background: dodgerblue;
}

.receiver {
  align-self: start;
  background: grey;
}

.chat-container {
  border: solid;
  border-radius: var(--global-border-radius);
  display: flex;
  flex-direction: column;
}

.input {
  width: 100%;
  height: 60vh;
}

.message-text {
  min-height: 1em; /* prevent height collapsing when there is no text */
  max-height: 5em;
  width: 100%;
  align-content: center;
  outline: none;
  overflow-y: auto;
  overflow-x: hidden;
}

.message-wrapper {
  width: 100%;
  border: 1px solid #e4e7ec;
  border-radius: var(--global-border-radius);
  background-color: #f9fafb;
  padding: 0.5em; /* the container will keep the padding untouched */
  max-height: 7em; /* added padding to the height of the .message-text */
  display: flex;
  position: relative;
  bottom: 10px;
}

.message-wrapper button {
  border-radius: var(--global-border-radius);
  color: blue;
}

[contentEditable=true]:empty:not(:focus):before {
  content: attr(placeholder-text);
  color: lightgray;
  pointer-events: none;
}

</style>
