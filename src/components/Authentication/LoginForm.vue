<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useTokenStore } from '@/stores/tokenStore.ts'
import { useRouter } from 'vue-router'
/**
 * We can access translation keys via useI18n().
 */
const { t } = useI18n()
const schema = yup.object({
  email: yup.string().email(t('invalidEmail')).required(t('emailRequired')),
  password: yup.string().required(t('passwordRequired')),
})
const tokenStore = useTokenStore()
defineEmits(['forgot-password'])

const { handleSubmit } = useForm({
  validationSchema: schema,
})
const { value: email, errorMessage: emailError } = useField('email', undefined, {
  validateOnValueUpdate: false,
})

const { value: password, errorMessage: passwordError } = useField('password', undefined, {
  validateOnValueUpdate: false,
})
const serverError = ref('') // optional: for displaying global login errors
const router = useRouter()

const onSubmit = handleSubmit(async (values) => {
  serverError.value = '' // clear previous error
  try {
    await tokenStore.login(values.email, values.password)
    setTimeout(() => {
      router.push('/')
    }, 500)
  } catch (error: any) {
    if (error.status === 401) {
      serverError.value = t('invalidCredentials')
    } else {
      serverError.value = t('unexpectedError')
    }
  }
})
</script>

<template>
  <form class="login-form" @submit.prevent="onSubmit" novalidate>
    <h2 class="form-title">{{ t('loginFormHeader') }}</h2>
    <div class="form-group">
      <label for="email">{{ t('email') }}</label>
      <input id="email" type="email" v-model="email" :placeholder="t('email')" />
      <p class="input-error" :class="{ visible: emailError }">
        {{ emailError || '\u00A0' }}
      </p>
    </div>

    <div class="form-group">
      <label for="password">{{ t('password') }}</label>
      <input id="password" type="password" v-model="password" :placeholder="t('password')" />
      <p class="input-error" :class="{ visible: passwordError }">
        {{ passwordError || '\u00A0' }}
      </p>
    </div>
    <p v-if="serverError" class="server-error">{{ serverError }}</p>
    <button type="submit">
      {{ t('loginBtn') }}
    </button>

    <div class="footer-links">
      <RouterLink :to="{ name: 'ForgotPassword' }">
        {{ t('forgotPassword') }}
      </RouterLink>
    </div>
  </form>
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

input:focus {
  border-color: var(--color-purple-button);
  outline: none;
  box-shadow: 0 0 0 2px rgba(136, 141, 167, 0.2); /* light lavender glow */
}

/* Input styling */
input {
  width: 100%;
  /* Make inputs bigger:
     more padding, bigger font size. */
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-md);
  border: var(--global-border-size) solid var(--color-border);
  border-radius: calc(var(--global-border-radius) / 2);
  box-sizing: border-box;
}

/* Button styling */
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

/* Footer links styling */
.footer-links {
  text-align: right;
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
}
.footer-links {
  margin-top: var(--spacing-md);
  text-align: right;
}

.footer-links a {
  font-size: var(--font-size-sm);
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

.input-error {
  min-height: 1.25rem; /* Adjust based on your font size */
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
