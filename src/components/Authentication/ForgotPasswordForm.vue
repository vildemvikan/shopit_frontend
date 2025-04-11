<script setup lang="ts">
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { sendResetEmail } from '../../../utils/Authentication.ts'

const { t } = useI18n()

const schema = yup.object({
  email: yup.string().email(t('invalidEmail')).required(t('emailRequired')),
})

const { handleSubmit } = useForm({ validationSchema: schema })
const { value: email, errorMessage: emailError } = useField('email', undefined, {
  validateOnValueUpdate: false,
})

const serverError = ref('')
const serverSuccess = ref('')
const isSubmitting = ref(false)
const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  serverSuccess.value = ''
  isSubmitting.value = true

  try {
    await sendResetEmail(values.email)
    console.log(values.email)
    serverSuccess.value = t('resetLinkSent')
  } catch (error: any) {
    serverError.value = t('resetRequestFailed')
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <form class="forgot-password-form" @submit.prevent="onSubmit" novalidate>
    <h2 class="form-title">{{ t('forgotPasswordTitle') }}</h2>
    <p class="form-description">{{ t('forgotPasswordDescription') }}</p>

    <div class="form-group">
      <label for="email">{{ t('email') }}</label>
      <input id="email" type="email" v-model="email" :placeholder="t('email')" />
      <p class="input-error" :class="{ visible: emailError }">
        {{ emailError || '\u00A0' }}
      </p>
    </div>

    <p v-if="serverError" class="server-error">{{ serverError }}</p>
    <p v-if="serverSuccess" class="server-success">{{ serverSuccess }}</p>

    <button type="submit" :disabled="isSubmitting">
      <span v-if="!isSubmitting">{{ t('sendResetLink') }}</span>
      <span v-else class="spinner"></span>
    </button>
    <div class="footer-links">
      <RouterLink :to="{ name: 'Login' }">
        {{ t('backToLogin') }}
      </RouterLink>
    </div>
  </form>
</template>

<style scoped>
.forgot-password-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-title {
  font-size: var(--font-size-h2);
  font-weight: var(--heading-weight);
  color: var(--color-heading);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.form-description {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--vt-c-text-light-2);
  margin-bottom: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-md);
  color: var(--color-text);
}

input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-md);
  border: var(--global-border-size) solid var(--color-border);
  border-radius: calc(var(--global-border-radius) / 2);
  box-sizing: border-box;
}

input:focus {
  border-color: var(--color-purple-button);
  outline: none;
  box-shadow: 0 0 0 2px rgba(136, 141, 167, 0.2);
}

button {
  background-color: var(--color-black-button);
  color: var(--color-white-text);
  padding: var(--btn-padding-y) var(--btn-padding-x);
  font-size: var(--font-size-md);
  font-weight: bold;
  border: none;
  border-radius: var(--global-border-radius);
  cursor: pointer;
  width: 100%;
  margin-top: var(--spacing-md);
  transition:
    background-color 0.3s ease,
    transform 0.2s ease-in-out;
}

button:hover {
  background-color: var(--color-black-button-hover);
  transform: translateY(-2px);
}
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.input-error {
  min-height: 1.25rem;
  font-size: var(--font-size-sm);
  color: transparent;
  transition: color 0.2s;
  margin-top: 0.25rem;
}

.input-error.visible {
  color: red;
}

.server-error,
.server-success {
  font-size: var(--font-size-sm);
  text-align: center;
  margin-top: var(--spacing-sm);
}

.server-error {
  color: red;
}

.server-success {
  color: green;
}

.footer-links {
  margin-top: var(--spacing-md);
  text-align: right;
}

.footer-links a {
  font-size: var(--font-size-sm);
  text-decoration: none;
  color: var(--color-text);
}

.footer-links a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .form-title {
    font-size: 1.5rem;
  }

  .form-group input {
    font-size: 1rem;
    padding: 0.75rem;
  }

  button {
    font-size: 1rem;
    padding: 0.75rem;
  }
}
</style>
