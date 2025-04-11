<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { resetPasswordWithToken, validateResetToken } from '../../../utils/Authentication.ts'
//import { resetPasswordWithToken } from '@/utils/Authentication.ts';

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const token = (route.query.token as string) || ''
const email = (route.query.email as string) || ''
const isTokenValid = ref(false)
const validationError = ref('')

const serverError = ref('')
const serverSuccess = ref('')
const isSubmitting = ref(false)

onMounted(async () => {
  try {
    const response = await validateResetToken(token, email)
    isTokenValid.value = response.valid
  } catch (err: any) {
    isTokenValid.value = false
    validationError.value = err.message
  }
})
const schema = yup.object({
  password: yup.string().min(6, t('tooShortPassword')).required(t('passwordRequired')),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], t('matchPassword'))
    .required(t('passwordConfirmRequired')),
})

const { handleSubmit } = useForm({ validationSchema: schema })

const { value: password, errorMessage: passwordError } = useField('password', undefined, {
  validateOnValueUpdate: false,
})
const { value: confirmPassword, errorMessage: confirmPasswordError } = useField(
  'confirmPassword',
  undefined,
  {
    validateOnValueUpdate: false,
  },
)

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  serverSuccess.value = ''
  isSubmitting.value = true
  try {
    await resetPasswordWithToken(token, email, values.password)
    serverSuccess.value = t('resetSuccess')
    setTimeout(() => router.push('/login'), 2500)
  } catch (err) {
    serverError.value = t('resetFailed')
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <form v-if="isTokenValid" class="login-form" @submit.prevent="onSubmit" novalidate>
    <h2 class="form-title">{{ t('resetPasswordTitle') }}</h2>

    <div class="form-group">
      <label for="password">{{ t('password') }}</label>
      <input id="password" type="password" v-model="password" :placeholder="t('password')" />
      <p class="input-error" :class="{ visible: passwordError }">
        {{ passwordError || '\u00A0' }}
      </p>
    </div>
    <div class="form-group">
      <label for="confirmPassword">{{ t('confirmPassword') }}</label>
      <input
        id="confirmPassword"
        type="password"
        v-model="confirmPassword"
        :placeholder="t('confirmPassword')"
      />
      <p class="input-error" :class="{ visible: confirmPasswordError }">
        {{ confirmPasswordError || '\u00A0' }}
      </p>
    </div>

    <p v-if="serverError" class="server-error">{{ serverError }}</p>
    <p v-if="serverSuccess" class="server-success">{{ serverSuccess }}</p>

    <button type="submit" :disabled="isSubmitting">
      <span v-if="!isSubmitting">{{ t('resetBtn') }}</span>
      <span v-else class="spinner"></span>
    </button>
  </form>

  <div v-else class="invalid-token-message">
    <h2>{{ t('invalidOrExpiredTokenTitle') }}</h2>
    <p>{{ validationError }}</p>
    <router-link to="/auth/forgot-password">
      {{ t('tryRequestingNewLink') }}
    </router-link>
  </div>
</template>

<style scoped>
.login-form {
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

.server-error {
  color: red;
  font-size: var(--font-size-sm);
  text-align: center;
  margin: var(--spacing-sm) 0;
}

.server-success {
  color: green;
  font-size: var(--font-size-sm);
  text-align: center;
  margin: var(--spacing-sm) 0;
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

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
