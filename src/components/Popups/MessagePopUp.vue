<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
// Replace this with your actual message sending function
import { contactSeller } from '../../../utils/Messages.ts'

const { t } = useI18n()
const router = useRouter()

const emit = defineEmits<{
  (e: 'cancel-message'): void
}>()

const props = defineProps<{
  id: string | null
}>()

const messageContent = ref<string>('')

async function sendMessage() {
  if (messageContent.value.trim() !== '') {
    try {
      const response = await contactSeller(props.id, messageContent.value)
      if (response == 200) {
        await router.push('/messages')
      }
    } catch (error) {
      console.error(error)
      emit('cancel-message')
    }
  }
}

function cancelMessage() {
  emit('cancel-message')
}
</script>

<template>
  <div class="overlay">
    <div class="popup">
      <h3>{{ t('title-enter-message') }}</h3>
      <textarea
        v-model="messageContent"
        :placeholder="t('label-enter-message')"
        class="message-input"
        maxlength="250"
      />
      <div class="buttons">
        <button class="cancel-btn" id="button" @click="cancelMessage">
          {{ t('button-cancel-message') }}
        </button>
        <button class="send-btn" id="button" @click="sendMessage">
          {{ t('button-send-message') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-transparent-black-background);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: var(--color-background);
  padding: 20px 30px;
  border-radius: var(--global-border-radius);
  text-align: center;
  max-width: 90%;
  min-width: 450px;
}

.message-input {
  padding: 10px;
  border-radius: calc(var(--global-border-radius) / 2);
  border: 1px solid var(--color-border);
  font-size: 16px;
  width: 100%;
  min-height: 100px;
  resize: vertical;
}

.buttons {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 10px;
}

#button {
  border: none;
  padding: 10px 20px;
  border-radius: calc(var(--global-border-radius) / 2);
  color: var(--color-black-text);
  font-weight: bold;
  width: 50%;
}

.send-btn {
  background-color: var(--color-light-blue-button);
}
.send-btn:hover {
  background-color: var(--color-blue-button);
}
.cancel-btn {
  background-color: var(--color-light-red-button);
}
.cancel-btn:hover {
  background-color: var(--color-light-dark-red-button);
}
</style>
