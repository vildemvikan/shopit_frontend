<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { placeBid } from '../../../utils/Bid.ts'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const emit = defineEmits<{
  (e: 'cancel-bid'): void
}>()

const props = defineProps<{
  id: string | null
}>()

const bidAmount = ref<number | null>(null)

async function sendBid() {
  if (bidAmount.value !== null && bidAmount.value >= 0) {
    try {
      const result = await placeBid(props.id, bidAmount.value)
      if (result == 200) {
        await router.push('/messages')
      }
    } catch (error) {
      console.error(error)
      emit('cancel-bid')
    }
  }
}
function cancelBid() {
  emit('cancel-bid')
}

function preventNonNumeric(event: KeyboardEvent) {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab']
  if (allowedKeys.includes(event.key)) {
    return
  }
  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
  }
}
</script>

<template>
  <div class="overlay">
    <div class="popup">
      <h3>{{ $t('title-enter-bid') }}</h3>
      <input
        v-model="bidAmount"
        type="number"
        :min="0"
        :placeholder="t('label-enter-amount')"
        class="bid-input"
        @keydown="preventNonNumeric"
      />
      <div class="buttons">
        <button class="cancel-btn" id="button" @click="cancelBid">
          {{ $t('button-cancel-bid') }}
        </button>
        <button class="send-btn" id="button" @click="sendBid">{{ $t('button-send-bid') }}</button>
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
  min-width: 350px;
}

.bid-input {
  padding: 10px;
  border-radius: calc(var(--global-border-radius) / 2);
  border: 1px solid var(--color-border);
  font-size: 16px;
  width: 100%;
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
