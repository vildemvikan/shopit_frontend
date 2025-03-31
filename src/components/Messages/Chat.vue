<script setup lang="ts">
import { onMounted, reactive, type Ref, ref, type UnwrapRef, watch } from 'vue'
import { fetchChatMessages } from '../../../utils/Messages.ts'
import useEventsBus from '../../../utils/EventBus.ts'
import type { ChatMessage } from '@/interfaces/interfaces.ts'
import type { UserInfo } from '@/interfaces/interfaces.ts'

const { bus } = useEventsBus();

let chatMessageInfo: Ref<ChatMessage[]>= ref([]);
let currentUser: Ref<string> = ref('')
let profileInfo = ref();

watch(()=> bus.value.get('selectChat'), async (val) => {
  const userInfo = val[0];
  currentUser = userInfo.senderMail
  await displayMessages(userInfo)
  await fetchProfileInfo(userInfo)
});

async function displayMessages(userInfo: UserInfo) {
  chatMessageInfo.value = await fetchChatMessages(userInfo.senderMail, userInfo.recipientMail, userInfo.itemId);
  console.log("chatmessageinfo value: ", chatMessageInfo.value)
  for (let i = 0; i < chatMessageInfo.value.length; i++)  {
    //chatMessageInfo.value[i].content = "hello"
    console.log(chatMessageInfo.value[i])
  }
}



async function fetchProfileInfo(info) {
}

</script>

<template>
  <div class="profile-info">
    Current user: {{ currentUser }}
  </div>

  <div class="message-box">
    <div
      v-for="info in chatMessageInfo"
      :key="info.id"
      :class="['message', info.senderId === currentUser ? 'sender' : 'receiver']">
      <p>{{info.content}}</p>
    </div>
  </div>

  <div class="chat-box"></div>
  <div class="input">
    <div class="message-wrapper">
      <div class="message-text" contentEditable="true" :placeholder-text="$t('chat-message-placeholder')"></div>
      <button>Send</button>
    </div>
  </div>
</template>

<style scoped>
.message-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.message {
  margin: 1px;
  border-radius: 10px;
  max-width: 80%;

  overflow-y: auto;
  overflow-x: hidden;
  max-height: 7em;
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

.input {
  width: 100%;
}

.message-text {
  min-height: 1em; /* prevent height collapsing when there is no text */
  max-height: 5em;
  width: 100%;
  align-content: center;
  outline: none;
  overflow-y: auto;
  overflow-x: hidden
}

.message-wrapper {
  width: 100%;
  border: 1px solid #e4e7ec;
  border-radius: var(--global-border-radius);
  background-color: #f9fafb;
  padding: 0.5em; /* the container will keep the padding untouched */
  max-height: 7em; /* added padding to the height of the .message-text */
}

[contentEditable=true]:empty:not(:focus):before {
  content: attr(placeholder-text)
}

</style>
