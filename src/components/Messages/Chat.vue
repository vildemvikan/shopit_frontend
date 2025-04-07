<script setup lang="ts">
import { computed, onMounted, reactive, type Ref, ref, type UnwrapRef, watch } from 'vue'
import { fetchChatMessages, fetchProfileInfo } from '../../../utils/Messages.ts'
import useEventsBus from '../../../utils/EventBus.ts'
import type { ChatMessage, ChatRoomInfo } from '@/interfaces/interfaces.ts'
import websocketService from '../../../utils/WebSocket.ts'

interface ExtendedChatMessage extends ChatMessage {
  showTimestamp?: boolean;
}

const { bus } = useEventsBus();
const chatMessageInfo: Ref<ExtendedChatMessage[]>= ref([]);
const props = defineProps<{
  currentChatRoomInfo: ChatRoomInfo
}>();

const profileInfo = ref();
const messageText = ref('')

const MAX_CHARS = 250
const charCount = ref(0)
const lastText = ref('')
const isExceeded = computed(() => charCount.value > MAX_CHARS);

watch(props.currentChatRoomInfo, async (newVal) => {
  if (newVal.itemId === 0) return;

  const test = await displayMessages(newVal)
  const messageList = document.querySelector("#message-list")
  messageList!.scrollTop = messageList!.scrollHeight;
  await displayProfile(newVal.recipientMail)
});

watch(()=> bus.value.get('messageReceived'), async (val) => {
  const payload = JSON.parse(val[0].body)
  displayMessage(payload.senderId, payload.recipientId, payload.itemId, payload.content, payload.timestamp);
});

const displayMessages = async (chatRoomInfo: ChatRoomInfo) => {
  // Fetch messages from backend
  const messages = await fetchChatMessages(chatRoomInfo.senderMail, chatRoomInfo.recipientMail, chatRoomInfo.itemId);

  // Parse ISO timestamp strings from backend into JavaScript Date objects
  const messagesWithTime = messages.map(msg => {
    return {
      ...msg,
      // Parse the timestamp string into a Date object
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
    };
  });

  // Process messages to determine which should show timestamps
  chatMessageInfo.value = processMessages(messagesWithTime);

  const messageList = document.querySelector("#message-list");
  if (messageList) {
    messageList.scrollTop = messageList.scrollHeight;
  }
}

const displayMessage = (senderMail: string, recipientMail: string, itemId: number, content: string, timestamp: Date) => {
  const newChatMsg: ExtendedChatMessage = {
    senderId: senderMail,
    recipientId: recipientMail,
    itemId,
    content,
    timestamp,
  }
  chatMessageInfo.value.push(newChatMsg)
  chatMessageInfo.value = processMessages(chatMessageInfo.value);
  const messageList = document.querySelector("#message-list")
  messageList!.scrollTop = messageList!.scrollHeight;
}

const displayProfile = async (profileMail: string) => {
  profileInfo.value = await fetchProfileInfo(profileMail);
}

const sendMessage = (e: Event) => {
  e.preventDefault()

  if (messageText.value.innerText.trim() === "") return;

  const message = messageText.value.innerText.trimEnd();

  console.log("message: ", message)

  const websocket = websocketService;
  websocket.sendMessage(props.currentChatRoomInfo.senderMail, props.currentChatRoomInfo.recipientMail, props.currentChatRoomInfo.itemId, message);
  displayMessage(props.currentChatRoomInfo.senderMail!, props.currentChatRoomInfo.recipientMail, props.currentChatRoomInfo.itemId, message, new Date());
  messageText.value.innerText= "";
  charCount.value = 0

  const { emit } = useEventsBus();
  emit('messageSent')
  emit('refreshList', message, props.currentChatRoomInfo.recipientMail, props.currentChatRoomInfo.itemId)
}

// Group messages by time intervals
const processMessages = (messages: ExtendedChatMessage[]) => {
  const result = [...messages];

  // Sort messages by timestamp if available
  result.sort((a, b) => {
    const timeA = a.timestamp ? a.timestamp.getTime() : 0;
    const timeB = b.timestamp ? b.timestamp.getTime() : 0;
    return timeA - timeB;
  });

  // Determine which messages should show timestamps
  // Show timestamp for first message and when time gap > 10 minutes
  for (let i = 0; i < result.length; i++) {
    if (i === 0) {
      result[i].showTimestamp = true;
      continue;
    }

    const prevTime = result[i-1].timestamp?.getTime() || 0;
    const currTime = result[i].timestamp?.getTime() || 0;

    // Show timestamp if > 10 minutes passed since last message
    result[i].showTimestamp = (currTime - prevTime) > 10 * 60 * 1000;
  }

  return result;
};

const handleInput = () => {
  if (!messageText.value) return;

  const text = messageText.value.innerText;
  charCount.value = text.length;

  if (text.length > MAX_CHARS) {
    // Truncate text when over limit
    messageText.value.innerText = text.substring(0, MAX_CHARS);
    charCount.value = MAX_CHARS;

    setCursorToEnd()
  }
}

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const text = e.clipboardData?.getData('text/plain') || '';

  if (!messageText.value) return;

  const selection = window.getSelection();
  if (!selection) return;

  const range = selection.getRangeAt(0);
  const currentText = messageText.value.innerText;

  // Calculate new text after paste
  const start = range.startOffset;
  const end = range.endOffset;
  const newText = currentText.substring(0, start) + text + currentText.substring(end);

  // Apply limit
  messageText.value.innerText = newText.substring(0, MAX_CHARS);
  charCount.value = messageText.value.innerText.length;

  setCursorToEnd()
}

const setCursorToEnd = () => {
  const el = messageText.value
  if (!el) return

  const range = document.createRange()
  const sel = window.getSelection()
  if (!sel) return

  range.selectNodeContents(el)
  range.collapse(false)
  sel.removeAllRanges()
  sel.addRange(range)
}

const isActive = () => {
  return props.currentChatRoomInfo.senderMail !== "";
}

const formatTime = (date?: Date) => {
  if (!date) return '';

  const now = new Date();
  const isToday = date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  if (date > oneWeekAgo) {
    return date.toLocaleDateString(undefined, { weekday: 'short' }) + ' ' +
      date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString() + ' ' +
    date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
</script>

<template>
  <div class="chat-container">
    <div class="profile">
      <img :src= "profileInfo?.url || '/src/assets/icons/profile.svg'" alt="profile-pic">
      <span>{{ profileInfo?.fullName }}</span>
    </div>
    <div id="message-list">
      <div class="message-box" :class="{ hidden: false }">
        <template v-for="(info, index) in chatMessageInfo" :key="index">
          <div v-if="info.showTimestamp" class="timestamp-divider">
            <span>{{ formatTime(info.timestamp) }}</span>
          </div>

          <div :class="['message', info.senderId !== props.currentChatRoomInfo.senderMail ? 'receiver' : 'sender']">
            <p>{{ info.content }}</p>
          </div>
        </template>
      </div>
    </div>

    <div class="input">
      <div class="message-wrapper">
        <div
          ref="messageText"
          class="message-text"
          contentEditable="true"
          @keydown.enter.prevent="sendMessage($event)"
          @input="handleInput"
          @paste="handlePaste"
          :placeholder-text="$t('chat-message-placeholder')"></div>
        <div id="char-counter" :class="{ 'exceeded': isExceeded }">
          {{ charCount }}/{{ MAX_CHARS }}
        </div>
        <div id="send-button" @click="sendMessage">
          <img src="/src/assets/icons/send.svg" alt="send-icon">
        </div>
      </div>

      <span id="error">error message?</span>
    </div>
  </div>
</template>

<style scoped>
.hidden {
  display: none;
}

#error {
  color: transparent;
}
#send-button {
  background-color: transparent;
  border: transparent;
  margin: auto;
  align-self: center;
}
#send-button img{
  padding: 0.1rem;
  max-height: 1.75rem;
  border-radius: 50%;
  border: calc(var(--global-border-size)/4);
  background-color: #b5b3b3;
}

#send-button img:hover {
  background-color: lightgray;
}

#message-list {
  display: flex;
  flex-direction: column-reverse;
  overflow-y: scroll;
  height: 100%;
  overflow-x: hidden;
  width: 100%;
  overflow-anchor: auto !important; /*  See https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor */
}

.profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: var(--global-border-size) solid var(--color-gray-divider);
}

.profile img {
  max-width: 45px;
  max-height: 45px;
  border-radius: 50%;
  margin-left: 0.25rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  border: solid;
}

.profile span {
  font-size: var(--font-size-lg);
}

.message-box {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;
}

.message {
  margin-top: 1px;
  margin-bottom: 1px;
  border-radius: calc(var(--global-border-radius)*1.5);
  max-width: 75%;

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

#char-counter {
  position: absolute;
  bottom: 0.5rem;
  right: 3rem;
  font-size: 0.8rem;
  color: #6B7280;
}

.chat-container {
  border: 1px solid #e4e7ec;
  border-radius: calc(var(--global-border-radius)/2);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  height: 80vh;
  width:100%;
  max-width: 100%;
}

.input {
  width: 100%;
  margin-top: auto;
  border-top: var(--global-border-size) solid var(--color-gray-divider);
}

.message-text {
  min-height: 1em; /* prevent height collapsing when there is no text */
  max-height: 3em;
  width: 100%;
  outline: none;
  overflow-y: auto;
  overflow-x: hidden;
  align-self: center;

  padding-right: 3rem; /* Make room for counter */
}

.message-wrapper {
  width: 95%;
  border: 1px solid #e4e7ec;
  border-radius: var(--global-border-radius);
  background-color: #f9fafb;
  padding: 0.5em; /* the container will keep the padding untouched */
  max-height: 5em; /* added padding to the height of the .message-text */
  display: flex;
  position: relative;
  margin: 1rem auto auto;

  overflow-wrap: break-word;
  word-break: break-word;
}

[contentEditable=true]:empty:not(:focus):before {
  content: attr(placeholder-text);
  color: lightgray;
  pointer-events: none;
}

.timestamp-divider {
  width: 100%;
  text-align: center;
  margin: 12px 0 8px;
  position: relative;
}

.timestamp-divider span {
  background-color: #f0f2f5;
  padding: 0 8px;
  font-size: 0.75rem;
  color: #65676B;
  border-radius: 12px;
}

</style>
