<script setup lang="ts">
import { Status } from '@/enums/enums.ts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ExtendedChatCardInfo } from '@/components/Messages/ChatList.vue'

const props = defineProps<{
  chatCardData: ExtendedChatCardInfo
}>();

dayjs.extend(relativeTime)

const timeAgo = computed(() => {
  return dayjs(props.chatCardData.lastMessageTimestamp).fromNow()
})

const displayMessage = computed(()=> {
  let message = props.chatCardData.lastMessageContent;
  if (props.chatCardData.lastSenderId === props.chatCardData.senderId) {
    const { t } = useI18n();
    message = t('chat-message-prefix') + message;
  }
  if (message.length > 44) {
    message = message.substring(0, 45);
    return message + "..."
  }
  return message;
})

</script>

<template>
  <div class="card">
    <div class="image-box">
      <img :src="props.chatCardData.image|| 'src/assets/icons/no_image.svg'" class="display-image" alt="display image">
      <img :src="props.chatCardData.recipientProfilePic || 'src/assets/icons/profile.svg'" class="avatar" alt="avatar">
    </div>

    <div class="text-info">
      <div class="date-info">
        <label id="date">{{timeAgo}}</label>
      </div>
      <div class="title-and-notification">
        <h3>{{props.chatCardData.itemTitle}}</h3>
        <div v-if="props.chatCardData.hasUnreadMessage" class="notification-dot"></div>
      </div>
      <div class="last-message">
        <label id="message">{{displayMessage}}</label>
      </div>
      <div class="info">
        <label class="status" id="status-active"
               v-if="props.chatCardData.status == Status.Active">{{$t('label-active')}}</label>
        <label class="status"
               id="status-inactive" v-if="props.chatCardData.status == Status.Inactive">{{$t('label-inactive')}}</label>
        <label class="status"
               id="status-sold" v-if="props.chatCardData.status == Status.Sold">{{$t('label-sold')}}</label>
      </div>
    </div>
  </div>

</template>

<style scoped>
.card{
  display: flex;
  flex-direction: row;
  align-content: center;
  width: 100%;
  height: 100%;
  padding: 10px;
  gap: 10px;
}

.title-and-notification {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.notification-dot {
  height: 15px;
  width: 15px;
  background-color: #3b82f6;
  border-radius: 50%;
  place-content: end;
  margin-left: auto;
  align-self: center;
}

.avatar {
  position: absolute;
  height: 50%;
  aspect-ratio: 1/1;
  border-radius: 100%;
  border: var(--global-border-size) solid var(--color-text);
  top: 50%;
  left: 50%;
  background-color: var(--color-white-background);
  object-fit: cover;
}

.image-box{
  position: relative;
  height: 100%;
  aspect-ratio: 1/1;
  align-self: center;
  place-content: center;
}

.display-image{
  width: 90%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: calc(var(--global-border-radius)/2);
  grid-area: 1/1;
}

h3 {
  font-weight: bold;
}

.last-message {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding-bottom: 0.4rem;
}

.text-info{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.date-info{
  display: flex;
  flex-direction: row;
  width: 100%;
  place-content: end;
}

#date {
  font-weight:bold;
}

.info{
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.status{
  border-radius: calc(var(--global-border-radius)/2);
  padding-left: 5%;
  padding-right: 5%;
}

#status-active{
  background-color: var(--color-light-blue-button);
}

#status-inactive{
  background-color: var(--color-gray-button);
}

#status-sold{
  background-color: var(--color-yellow-button);
}

</style>
