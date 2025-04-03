<script setup lang="ts">
import router from '@/router'
import { deleteAdvertisement as deleteAdAPI } from '../../../utils/Advertisement.ts'

// Emits an event to notify the parent to close the delete popup
const emit = defineEmits<{
  (e: 'close:delete-pop-up', value: boolean): void;
}>()

const props = defineProps<{
  id: string
}>()

async function confirmDelete() {
  try {
    await deleteAdAPI(props.id)
    await router.push('/profile')
    // Emit event to close the popup after deletion
    emit('close:delete-pop-up', true)
  } catch (error) {
    console.error(error)
  }
}

function cancelDelete() {
  // Emit event to close the popup without deleting
  emit('close:delete-pop-up', false)
}
</script>

<template>
  <div class="overlay">
    <div class="popup">
      <h3>{{ $t('confirm-deletion-title') }}</h3>
      <label>{{ $t('confirm-deletion-label') }}</label>
      <div class="buttons">
        <button class="delete-btn" id="button" @click="confirmDelete">Delete</button>
        <button class="cancel-btn" id="button" @click="cancelDelete">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Full-screen overlay for the popup */
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

/* Popup container */
.popup {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--color-white-background);
  padding: 20px 30px;
  border-radius: var(--global-border-radius);
  text-align: center;
  max-width: 90%;
}

/* Buttons styling */
.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

#button{
  border: none;
  padding: 10px 20px;
  border-radius: calc(var(--global-border-radius)/2);
  color: var(--color-black-text);
}

.delete-btn {
  background-color: var(--color-light-red-button);
}

.delete-btn:hover {
  background-color: var(--color-light-dark-red-button);
}

.cancel-btn {
  background-color: var(--color-light-blue-button); /* blue */
}

.cancel-btn:hover {
  background-color: var(--color-blue-button);
}
</style>
