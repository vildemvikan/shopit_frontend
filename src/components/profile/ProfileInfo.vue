<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchUserInformation, updateProfilePicture } from '../../../utils/Profile.ts'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
const toast = useToast()
const { t } = useI18n()

const firstName = ref<string>('')
const lastName = ref<string>('')
const email = ref<string>('')
const profilePicture = ref<string>('')
const fileInputRef = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  try {
    const user = await fetchUserInformation()
    firstName.value = user.firstName || ''
    lastName.value = user.lastName || ''
    email.value = user.email || ''
    profilePicture.value = user.profilePicture?.url || ''
  } catch (error) {
    console.error('Error fetching user information:', error)
  }
})

function uploadImage() {
  fileInputRef.value?.click()
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      profilePicture.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
  target.value = ''
}

async function changeProfilePicture() {
  try {
    console.log(profilePicture.value)
    if (profilePicture.value) {
      await updateProfilePicture(profilePicture.value)
      toast.success(t('toast-profile-picture-changed'))
    } else {
      toast.error(t('toast-profile-picture-changed-error'))
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="profile-info">
    <div class="top-section">
      <button class="save-button" @click="changeProfilePicture">{{ $t('button-save') }}</button>
    </div>

    <div id="profile-picture">
      <div class="image-box">
        <img v-if="profilePicture" :src="profilePicture" class="image" alt="profile picture" />
        <img
          v-else
          src="@/assets/icons/profile.svg"
          class="image"
          id="inv-icon"
          alt="profile picture"
        />
      </div>
      <button class="edit-button" @click="uploadImage()">
        <img src="@/assets/icons/camera.svg" class="camera-icon" alt="camera icon" />
        <label class="edit-button-label">{{ $t('button-edit-advertisement') }}</label>
      </button>
      <input type="file" ref="fileInputRef" style="display: none" @change="handleFileUpload" />
    </div>
    <label class="user-information-label">{{ $t('label-user-info') }}</label>
    <div class="input-fields">
      <div class="input-field">
        <label class="input-label">{{ $t('firstName') }}: </label>
        <div class="input-box">
          <label>{{ firstName }}</label>
        </div>
      </div>
      <div class="input-field">
        <label>{{ $t('lastName') }}: </label>
        <div class="input-box">
          <label>{{ lastName }}</label>
        </div>
      </div>
      <div class="input-field">
        <label>{{ $t('email') }}: </label>
        <div class="input-box">
          <label>{{ email }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-info {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.top-section {
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 100%;
  height: 6.5%;
}

.save-button {
  height: 100%;
  width: 20%;
  border: none;
  border-radius: calc(var(--global-border-radius) / 2);
  font-weight: bold;
}

#profile-picture {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 40%;
  gap: 10px;
}

.image-box {
  display: flex;
  flex-direction: row;
  place-content: center;
  border: var(--global-border-size) solid var(--color-text);
  border-radius: 100%;
  height: 80%;
}

.image {
  height: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 100%;
}

.edit-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  place-content: center;
  border: none;
  height: 20%;
  width: 20%;
  gap: 5px;
  background-color: var(--color-light-blue-button);
  border-radius: calc(var(--global-border-radius) / 2);
}

.edit-button:hover {
  background-color: var(--color-blue-button);
}

.camera-icon {
  height: 1em;
}

.edit-button-label {
  color: var(--color-black-text);
  cursor: pointer;
}

.user-information-label {
  font-weight: bold;
}

.input-fields {
  display: flex;
  flex-direction: column;
  height: 53%;
  width: 100%;
}

.input-field {
  display: flex;
  flex-direction: row;
  place-content: space-between;
  place-items: center;
  height: calc(100% / 3);
  width: 100%;
}

.input-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  max-width: 80%;
  height: 50%;
  border-radius: calc(var(--global-border-radius) / 2);
  border: var(--global-border-size) solid var(--color-black-border);
  padding: 5px;
}

.input-label {
  min-width: fit-content;
}

@media (max-width: 700px) {
  .input-box {
    max-width: 75%;
  }
}

@media (max-width: 500px) {
  .input-box {
    max-width: 65%;
  }
}
</style>
