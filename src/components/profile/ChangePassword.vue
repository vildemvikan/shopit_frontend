<script setup lang="ts">
import { ref, watch } from 'vue'
import { changePassword } from '../../../utils/Profile.ts'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast()

const oldPassword = ref<string>('')
const newPassword = ref<string>('')
const repeatNewPassword = ref<string>('')

const emptyOldPasswordError = ref<boolean>(false)
const emptyNewPasswordError = ref<boolean>(false)
const emptyRepeatPasswordError = ref<boolean>(false)

const newPasswordError = ref<boolean>(false)
const newPasswordTooShortError = ref<boolean>(false)
const passwordMatchError = ref<boolean>(false)

const wrongPasswordError = ref<boolean>(false)

function oldPasswordCheck() {
  emptyOldPasswordError.value = oldPassword.value === ''
}
function newPasswordCheck() {
  emptyNewPasswordError.value = newPassword.value === ''
  newPasswordError.value = newPassword.value === oldPassword.value
  newPasswordTooShortError.value =
    newPassword.value.length < 6 && !newPasswordError.value && !emptyNewPasswordError.value
}
function repeatPasswordCheck() {
  emptyRepeatPasswordError.value = repeatNewPassword.value === ''
  passwordMatchError.value = newPassword.value !== repeatNewPassword.value
}

function passwordCheck() {
  oldPasswordCheck()
  newPasswordCheck()
  repeatPasswordCheck()
  return !(
    emptyOldPasswordError.value ||
    emptyNewPasswordError.value ||
    newPasswordError.value ||
    emptyRepeatPasswordError.value ||
    passwordMatchError.value ||
    newPasswordTooShortError.value
  )
}

async function updatePassword() {
  if (!passwordCheck()) {
    return
  }
  try {
    const result = await changePassword(oldPassword.value, newPassword.value)
    if (result == 200) {
      toast.success(t('toast-password-changed'))
      oldPassword.value = ''
      newPassword.value = ''
      repeatNewPassword.value = ''
      wrongPasswordError.value = false
    } else {
      toast.error(t('toast-password-changed-error'))
    }
  } catch (error) {
    toast.error(t('toast-password-changed-error'))
  }
}

watch(newPassword, (newValue) => {
  if (newPasswordError.value || emptyNewPasswordError.value || newPasswordTooShortError.value) {
    newPasswordCheck()
  }
})

watch(oldPassword, (newValue) => {
  if (emptyOldPasswordError.value) {
    oldPasswordCheck()
    wrongPasswordError.value = false
  }
})

watch(repeatNewPassword, (newValue) => {
  if (emptyRepeatPasswordError.value || passwordMatchError.value) {
    repeatPasswordCheck()
  }
})
</script>

<template>
  <div class="change-password">
    <div class="top-section">
      <label class="title-label">{{ $t('label-change-password') }}</label>
      <button class="save-button" @click="updatePassword">{{ $t('button-save') }}</button>
    </div>

    <div class="input-fields">
      <div class="input-field">
        <label class="input-label">{{ $t('label-old-password') }}: </label>
        <div class="input-container">
          <input
            class="input-box"
            :class="{ error: emptyOldPasswordError }"
            v-model="oldPassword"
            type="password"
          />
          <small v-if="emptyOldPasswordError" class="error-message">
            {{ $t('error-empty-old-password') }}
          </small>
          <small v-if="wrongPasswordError" class="error-message">
            {{ $t('error-wrong-password') }}
          </small>
        </div>
      </div>
      <div class="input-field">
        <label class="input-label">{{ $t('label-new-password') }}: </label>
        <div class="input-container">
          <input
            class="input-box"
            :class="{ error: emptyNewPasswordError || newPasswordError }"
            v-model="newPassword"
            type="password"
          />
          <small v-if="emptyNewPasswordError" class="error-message">
            {{ $t('error-empty-new-password') }}
          </small>
          <small v-else-if="newPasswordError" class="error-message">
            {{ $t('error-new-password-same') }}
          </small>
          <small v-if="newPasswordTooShortError" class="error-message">
            {{ $t('error-password-too-short') }}
          </small>
        </div>
      </div>
      <div class="input-field">
        <label class="input-label">{{ $t('label-repeat-new-password') }}: </label>
        <div class="input-container">
          <input
            class="input-box"
            :class="{ error: emptyRepeatPasswordError || passwordMatchError }"
            v-model="repeatNewPassword"
            type="password"
          />
          <small v-if="emptyRepeatPasswordError" class="error-message">
            {{ $t('error-empty-repeat-password') }}
          </small>
          <small v-else-if="passwordMatchError" class="error-message">
            {{ $t('error-passwords-dont-match') }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-label {
  font-weight: bold;
}

.change-password {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  place-content: space-between;
}

.top-section {
  display: flex;
  flex-direction: row;
  width: 100%;
  place-content: space-between;
  margin-bottom: 35px;
}

.save-button {
  height: 100%;
  width: 20%;
  border: none;
  border-radius: calc(var(--global-border-radius) / 2);
  font-weight: bold;
}

.input-fields {
  display: flex;
  flex-direction: column;
  height: 85%;
  width: 100%;
}

.input-field {
  display: flex;
  flex-direction: row;
  place-content: space-between;
  place-items: flex-start;
  height: calc(100% / 3);
  width: 100%;
}

.input-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 50%;
  border-radius: calc(var(--global-border-radius) / 2);
  border: var(--global-border-size) solid var(--color-black-border);
  padding: 5px;
}

.input-box.error {
  border-color: var(--color-error-text);
}

.input-label {
  min-width: fit-content;
}

.input-container {
  display: flex;
  flex-direction: column;
  width: 65%;
}

@media (max-width: 1000px) {
  .input-container {
    width: 75%;
    max-width: 75%;
  }
}

@media (max-width: 700px) {
  .input-container {
    width: 65%;
    max-width: 65%;
  }
}

@media (max-width: 500px) {
  .input-container {
    width: 48%;
    max-width: 48%;
  }
}
</style>
