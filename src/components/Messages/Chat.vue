<script setup lang="ts">
import { computed, reactive, type Ref, ref, watch } from 'vue'
import { fetchChatMessages, fetchProfileInfo } from '../../../utils/Messages.ts'
import useEventsBus from '../../../utils/EventBus.ts'
import type { ChatMessage, ChatRoomInfo, DisplayAdvertisement } from '@/interfaces/interfaces.ts'
import websocketService from '../../../utils/WebSocket.ts'
import { fetchAdvertisement } from '../../../utils/Advertisement.ts'
import AdvertisementPreviewList from '@/components/AdvertisementPreviewList.vue'
import { MessageType } from '@/enums/enums.ts'
import NewBid from '@/components/Messages/NewBidMessage.vue'
import YourBid from '@/components/Messages/YourBidMessage.vue'
import BidStatusChanged from '@/components/Messages/BidStatusChangedMessage.vue'
import Purchased from '@/components/Messages/PurchasedMessage.vue'

interface ExtendedChatMessage extends ChatMessage {
  showTimestamp?: boolean
}

const { bus } = useEventsBus()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const chatMessageInfo: Ref<ExtendedChatMessage[]> = ref([])

const currentChatRoomInfo = reactive({
  senderMail: '',
  recipientMail: '',
  itemId: 0,
})

const profileInfo = ref()
const advertisementInfo = ref<DisplayAdvertisement | null>(null)

const messageText = ref<string>('')

const MAX_CHARS = 250
const charCount = computed(() => messageText.value.length)

const isExceeded = computed(() => charCount.value > MAX_CHARS)

watch(
  () => bus.value.get('selectChat'),
  (val) => {
    console.log('VALUE')
    console.log(val)
    currentChatRoomInfo.recipientMail = val[0].recipientMail
    currentChatRoomInfo.senderMail = val[0].senderMail
    currentChatRoomInfo.itemId = val[0].itemId
  },
)

watch(currentChatRoomInfo, async (newVal) => {
  if (newVal.itemId === 0) return
  await displayMessages(newVal)
  const messageList = document.querySelector('#message-list')
  messageList!.scrollTop = messageList!.scrollHeight
  await displayProfile(newVal.recipientMail)
  await displayAdvertisement(newVal.itemId)
})

watch(
  () => bus.value.get('messageReceived'),
  async (val) => {
    const payload = JSON.parse(val[0].body)
    displayMessage(
      payload.senderId,
      payload.recipientId,
      payload.itemId,
      payload.content,
      new Date(payload.timestamp),
    )
  },
)

const displayMessages = async (chatRoomInfo: ChatRoomInfo) => {
  const messages = await fetchChatMessages(chatRoomInfo.recipientMail, chatRoomInfo.itemId)

  const messagesWithTime = messages.map((msg) => {
    return {
      ...msg,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
    }
  })

  chatMessageInfo.value = processMessages(messagesWithTime)
  console.log('MESSAGES')
  console.log(chatMessageInfo.value)

  const messageList = document.querySelector('#message-list')
  if (messageList) {
    messageList.scrollTop = messageList.scrollHeight
  }
}

const displayMessage = (
  senderMail: string,
  recipientMail: string,
  itemId: number,
  content: string,
  timestamp: Date,
) => {
  const newChatMsg: ExtendedChatMessage = {
    senderId: senderMail,
    recipientId: recipientMail,
    itemId,
    content,
    timestamp,
  }
  chatMessageInfo.value.push(newChatMsg)
  chatMessageInfo.value = processMessages(chatMessageInfo.value)
  const messageList = document.querySelector('#message-list')
  messageList!.scrollTop = messageList!.scrollHeight
}

const displayProfile = async (profileMail: string) => {
  profileInfo.value = await fetchProfileInfo(profileMail)
}

const displayAdvertisement = async (itemId: string) => {
  advertisementInfo.value = await fetchAdvertisement(itemId)
  console.log(advertisementInfo.value)
}

const sendMessage = (e: Event) => {
  e.preventDefault()
  if (messageText.value.trim() === '') return
  const message = messageText.value.trimEnd()
  const websocket = websocketService
  websocket.sendMessage(
    currentChatRoomInfo.senderMail,
    currentChatRoomInfo.recipientMail,
    currentChatRoomInfo.itemId,
    message,
  )
  displayMessage(
    currentChatRoomInfo.senderMail!,
    currentChatRoomInfo.recipientMail,
    currentChatRoomInfo.itemId,
    message,
    new Date(Date.now()),
  )
  messageText.value = ''

  const { emit } = useEventsBus()
  emit('messageSent')
  emit('refreshList', message, currentChatRoomInfo.recipientMail, currentChatRoomInfo.itemId)
}

const processMessages = (messages: ExtendedChatMessage[]) => {
  const result = [...messages]
  result.sort((a, b) => {
    const timeA = a.timestamp ? a.timestamp.getTime() : 0
    const timeB = b.timestamp ? b.timestamp.getTime() : 0
    return timeA - timeB
  })
  for (let i = 0; i < result.length; i++) {
    if (i === 0) {
      result[i].showTimestamp = true
      continue
    }
    const prevTime = result[i - 1].timestamp?.getTime() || 0
    const currTime = result[i].timestamp?.getTime() || 0
    result[i].showTimestamp = currTime - prevTime > 10 * 60 * 1000
  }
  return result
}

const formatTime = (date?: Date) => {
  if (!date) return ''
  const now = new Date()
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  if (isToday) {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  }
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  if (date > oneWeekAgo) {
    return (
      date.toLocaleDateString(undefined, { weekday: 'short' }) +
      ' ' +
      date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    )
  }
  return (
    date.toLocaleDateString() +
    ' ' +
    date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  )
}

function closeChat() {
  emit('close')
}
</script>

<template>
  <div class="chat-container">
    <div class="profile">
      <img
        src="@/assets/icons/up.svg"
        class="back-icon"
        id="inv-icon"
        @click="closeChat"
        alt="back to messages"
      />
      <img
        :src="profileInfo?.url || '/src/assets/icons/profile.svg'"
        alt="profile-pic"
        class="profile-picture"
        :class="{ 'inv-image': !profileInfo?.url }"
      />
      <label class="name">{{ profileInfo?.fullName }}</label>
    </div>

    <div id="message-list">
      <div class="message-box" :class="{ hidden: false }">
        <template v-for="(info, index) in chatMessageInfo" :key="index">
          <div v-if="info.showTimestamp" class="timestamp-divider">
            <span>{{ formatTime(info.timestamp) }}</span>
          </div>

          <div
            v-if="![MessageType.BID, MessageType.PURCHASE, MessageType.CHANGED].includes(info.type)"
            :class="[
              'message',
              info.senderId !== currentChatRoomInfo.senderMail ? 'receiver' : 'sender',
            ]"
          >
            <label>{{ info.content }}</label>
          </div>

          <div
            v-if="info.type == MessageType.BID && info.senderId !== currentChatRoomInfo.senderMail"
            class="bid"
            id="new-bid"
          >
            <NewBid :id="info.content" />
          </div>
          <div
            v-if="info.type == MessageType.BID && info.senderId == currentChatRoomInfo.senderMail"
            class="bid"
            id="your-bid"
          >
            <YourBid :id="info.content" />
          </div>
          <div
            v-if="
              info.type == MessageType.CHANGED && info.senderId !== currentChatRoomInfo.senderMail
            "
            class="bid"
            id="new-bid"
          >
            <BidStatusChanged :id="info.content" />
          </div>
          <div
            v-if="
              info.type == MessageType.PURCHASE && info.senderId !== currentChatRoomInfo.senderMail
            "
            class="bid"
            id="new-bid"
          >
            <Purchased :id="info.content" :buyer="false" />
          </div>
          <div
            v-if="
              info.type == MessageType.PURCHASE && info.senderId == currentChatRoomInfo.senderMail
            "
            class="bid"
            id="your-bid"
          >
            <Purchased :id="info.content" :buyer="true" />
          </div>
        </template>
      </div>
      <div class="chat-info">
        <div class="chat-profile">
          <img
            :src="profileInfo?.url || '/src/assets/icons/profile.svg'"
            alt="profile-pic"
            class="profile-picture"
            :class="{ 'inv-image': !profileInfo?.url }"
            id="profile"
          />
        </div>
        <label class="name">{{ profileInfo?.fullName }}</label>
        <div class="advertisement">
          <AdvertisementPreviewList
            v-if="advertisementInfo"
            :id="advertisementInfo.id"
            :title="advertisementInfo.name"
            :date="advertisementInfo.publishedAt"
            :image="advertisementInfo.images[0].url"
            :is-bookmarked="advertisementInfo.isBookmarked"
            :display-bookmark="false"
            :display-location="true"
            :price="advertisementInfo.price"
            :location="advertisementInfo.location.city"
            :display-status="true"
            :status="advertisementInfo.status"
          />
        </div>
      </div>
    </div>

    <div class="input">
      <div class="message-wrapper">
        <input
          v-model="messageText"
          class="message-text"
          :maxlength="MAX_CHARS"
          @keydown.enter.prevent="sendMessage($event)"
          :placeholder="$t('chat-message-placeholder')"
        />
        <div id="char-counter" :class="{ exceeded: isExceeded }">
          {{ charCount }}/{{ MAX_CHARS }}
        </div>
        <div id="send-button" @click="sendMessage">
          <img src="/src/assets/icons/send.svg" alt="send-icon" class="inv-icon" />
        </div>
      </div>
      <span id="error">error message?</span>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 100%;
  border: var(--global-border-size) solid var(--color-gray-divider);
  border-radius: var(--global-border-radius);
  box-shadow: var(--global-box-shaddow);
  padding-bottom: 10px;
}

.profile {
  display: flex;
  flex-direction: row;
  height: 8%;
  align-items: center;
  gap: 5px;
  padding: 5px;
  border-bottom: var(--global-border-size) solid var(--color-gray-divider);
}

.back-icon {
  display: none;
  height: 2em;
  transform: rotate(-90deg);
}

.back-icon:hover {
  transform: rotate(-90deg) scale(1.05);
  cursor: pointer;
}

.profile-picture {
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 100%;
  object-fit: cover;
  border: var(--global-border-size) solid var(--color-text);
}

.advertisement {
  height: 45%;
  width: 100%;
}

.name {
  font-weight: bold;
}

.hidden {
  display: none;
}

#message-list {
  display: flex;
  flex-direction: column-reverse;
  overflow-y: scroll;
  height: 100%;
  overflow-x: hidden;
  width: 100%;
  padding: 10px;
  gap: 10px;
  overflow-anchor: auto !important;
  place-content: space-between;
}

.chat-info {
  display: flex;
  flex-direction: column;
  height: 40%;
  place-items: center;
}

.chat-profile {
  display: flex;
  flex-direction: row;
  place-content: center;
  height: 45%;
  width: 100%;
}

.chat-profile.profile-picture {
  height: 100%;
  max-height: 100px;
  aspect-ratio: auto;
}

.message-wrapper {
  display: flex;
  position: relative;

  width: 95%;
  height: 90%;

  border: var(--global-border-size) solid var(--color-gray-divider);
  border-radius: var(--global-border-radius);
  padding: 5px;

  overflow-wrap: break-word;
  word-break: break-word;
}

.input {
  display: flex;
  flex-direction: column;
  place-items: center;
  height: 6%;
  width: 100%;
}

.message-text {
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  padding-right: 4rem;
  background-color: transparent;
  color: var(--color-text);
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

#send-button img {
  padding: 0.1rem;
  max-height: 1.75rem;
  border-radius: 01%;
  border: calc(var(--global-border-size) / 4);
}

#send-button img:hover {
  transform: scale(1.05);
  cursor: pointer;
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
  border-radius: calc(var(--global-border-radius) * 1.5);
  max-width: 75%;
  padding: 0.25rem 0.6rem;
  color: var(--color-black-text);
}

.message p {
  word-wrap: break-word;
}

.sender {
  align-self: flex-end;
  background: var(--color-light-blue-button);
}

.receiver {
  align-self: start;
  background: var(--color-gray-button);
}

.bid {
  width: 70%;
  min-width: fit-content;
  min-height: 75px;
  margin-bottom: 20px;
}

#your-bid {
  align-self: flex-end;
}

#char-counter {
  position: absolute;
  bottom: 0.5rem;
  right: 3rem;
  font-size: 0.8rem;
  color: #6b7280;
}

[contentEditable='true']:empty:not(:focus):before {
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
  color: #65676b;
  border-radius: 12px;
}

@media (max-width: 800px) {
  .back-icon {
    display: flex;
  }
}
</style>
