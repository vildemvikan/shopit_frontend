<script setup lang="ts">
import { onMounted, reactive, type Ref, ref, type UnwrapRef, watch } from 'vue'
import { fetchChatMessages, fetchProfileInfo } from '../../../utils/Messages.ts'
import useEventsBus from '../../../utils/EventBus.ts'
import type { ChatMessage } from '@/interfaces/interfaces.ts'
import websocketService from '../../../utils/WebSocket.ts'
import type { ChatRoomInfo } from '@/components/Messages/ChatList.vue'

const { bus } = useEventsBus();

const chatMessageInfo: Ref<ChatMessage[]>= ref([]);

const props = defineProps<{
  currentChatRoomInfo: ChatRoomInfo
}>();

const profileInfo = ref();
const messageText = ref('');

watch(props.currentChatRoomInfo, async (newVal) => {
  await displayMessages(newVal)
  displayProfile(newVal.profileImgUrl, newVal.recipientMail)
});

watch(()=> bus.value.get('message'), async (val) => {
  chatMessageInfo.value.push(val[0])
});

const displayMessages = async (chatRoomInfo: ChatRoomInfo) => {
  chatMessageInfo.value = await fetchChatMessages(chatRoomInfo.senderMail, chatRoomInfo.recipientMail, chatRoomInfo.itemId);

  /*for (let i = 0; i < chatMessageInfo.value.length; i++)  {
    console.log(chatMessageInfo.value[i])
  }*/
}

const displayMessage = (senderMail: string, recipientMail: string, itemId: number, content: string) => {
  const newChatMsg: ChatMessage = {
    senderId: senderMail,
    recipientId: recipientMail,
    itemId,
    content,
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
  websocket.sendMessage(props.currentChatRoomInfo.senderMail, props.currentChatRoomInfo.recipientMail, props.currentChatRoomInfo.itemId, message);
  //todo: send message
  displayMessage(props.currentChatRoomInfo.senderMail!, props.currentChatRoomInfo.recipientMail, props.currentChatRoomInfo.itemId, message);
  console.log("text :", message)
  messageText.value.innerText= "";
}

const isActive = () => {
  return props.currentChatRoomInfo.senderMail !== "";
}
</script>

<template>
  <div class="chat-container">
    <div class="profile">
      <img src="/src/assets/icons/profile.svg" alt="profile-pic">
    </div>
    <div class="message-box" :class="{ hidden : false}">
      <div
        v-for="info in chatMessageInfo"
        :class="['message', info.senderId !== props.currentChatRoomInfo.senderMail ? 'receiver' : 'sender']">
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
      <span style="color:red">error message?</span>
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
