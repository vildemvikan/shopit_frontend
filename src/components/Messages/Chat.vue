<script setup lang="ts">
import { onMounted, reactive, type Ref, ref, type UnwrapRef, watch } from 'vue'
import { fetchChatMessages } from '../../../utils/Messages.ts'
import useEventsBus from '../../../utils/EventBus.ts'
import type { ChatMessage } from '@/interfaces/interfaces.ts'
import type { UserInfo } from '@/interfaces/interfaces.ts'

const { bus } = useEventsBus();

let chatMessageInfo: ChatMessage[] = reactive([]);
let profileInfo = ref();

watch(()=> bus.value.get('selectChat'), async (val) => {
  const userInfo = val[0];
  await displayMessages(userInfo)
  await fetchProfileInfo(userInfo)
});

async function displayMessages(userInfo: UserInfo) {
  chatMessageInfo = await fetchChatMessages(userInfo.senderMail, userInfo.recipientMail, userInfo.itemId);
  console.log(chatMessageInfo)
}

async function fetchProfileInfo(info) {
}

</script>

<template>
  <div class="profile-info">
    {{chatMessageInfo}}
  </div>

  <div class="message-box">
    <div>

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
  width: 50%;
  border: 1px solid #e4e7ec;
  border-radius: 20px;
  background-color: #f9fafb;
  padding: 0.5em; /* the container will keep the padding untouched */
  max-height: 7em; /* added padding to the height of the .message-text */
}

[contentEditable=true]:empty:not(:focus):before {
  content: attr(placeholder-text)
}

</style>
