<script setup lang="ts">
import router from '@/router'
import { deleteAdvertisement as deleteAdAPI } from '../../../utils/Advertisement.ts'
import { deleteUser } from '../../../utils/Profile.ts'
import { useTokenStore } from '@/stores/tokenStore.ts'

const emit = defineEmits<{
  (e: 'close:delete-pop-up', value: boolean): void;
}>()

const tokenStore = useTokenStore()

const props = defineProps<{
  id: string|null
  typeDeleteUser: boolean
  typeDeleteAdvertisement:boolean
}>()

async function confirmDeleteAdvertisement() {
  try {
    if(!props.id) return
    await deleteAdAPI(props.id)
    await router.push('/profile')
    // Emit event to close the popup after deletion
    emit('close:delete-pop-up', true)
  } catch (error) {
    console.error(error)
  }
}

async function confirmDeleteUser() {
  try {
    const result = await deleteUser()
    if(result){
      await tokenStore.emptyTokenStore()
      await router.push('/')
    }
    emit('close:delete-pop-up', true)
  } catch (error) {
    console.error(error)
    emit('close:delete-pop-up', true)
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
      <label v-if="typeDeleteUser">{{ $t('confirm-deletion-label-user') }}</label>
      <label v-if="typeDeleteAdvertisement">{{ $t('confirm-deletion-label') }}</label>
      <div class="buttons">
        <button class="delete-btn"
                v-if="typeDeleteAdvertisement"
                id="button"
                @click="confirmDeleteAdvertisement">Delete</button>
        <button class="delete-btn"
                v-if="typeDeleteUser"
                id="button"
                @click="confirmDeleteUser">Delete</button>
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

.popup {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--color-background);
  padding: 20px 30px;
  border-radius: var(--global-border-radius);
  text-align: center;
  max-width: 90%;
}

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
  background-color: var(--color-light-blue-button);
}
.cancel-btn:hover {
  background-color: var(--color-blue-button);
}
</style>
