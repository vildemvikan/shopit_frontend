<script setup lang="ts">
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const { t } = useI18n()
import {useTokenStore} from '../../stores/tokenStore.ts'
// Example schema with confirmPassword & TOS
const schema = yup.object({
  firstName: yup.string().required(t('firstNameRequired')),
  lastName: yup.string().required(t('lastNameRequired')),
  email: yup.string().email(t('invalidEmail')).required(t('emailRequired')),
  password: yup.string().min(6, t('tooShortPassword')).required(t('passwordRequired')),
  confirmPassword: yup.string().required(t('passwordConfirmRequired')).oneOf([yup.ref('password')], t('matchPassword'))
})
const tokenStore = useTokenStore()
const { handleSubmit } = useForm({ validationSchema: schema })

// Fields
const { value: firstName, errorMessage: firstNameError } = useField('firstName', undefined, {
  validateOnValueUpdate: false,
});
const { value: lastName, errorMessage: lastNameError } = useField('lastName', undefined, {
  validateOnValueUpdate: false,
});
const { value: email, errorMessage: emailError } = useField('email', undefined, {
  validateOnValueUpdate: false,
});
const { value: password, errorMessage: passwordError } = useField('password', undefined, {
  validateOnValueUpdate: false,
});
const { value: confirmPassword, errorMessage: confirmPasswordError } = useField('confirmPassword', undefined, {
  validateOnValueUpdate: false,
});

const router = useRouter();
const serverError = ref('');
const serverSuccess = ref('');
// Server error or success message
const onSubmit = handleSubmit(async (values) => {
  serverError.value = '';
  serverSuccess.value = '';
  try {
    await tokenStore.registerAndSaveToken(values.email, values.firstName, values.lastName, values.password);
    serverSuccess.value = t('registrationSuccess');
    setTimeout(() => {
      router.push('/auth/login');
    }, 1);
  } catch (error: any) {
    if (error.status===409) {
      serverError.value = t('emailTaken'); // Vi burde kanskje oversette errors fra serverside...
    } else {
      serverError.value = t('unexpectedError');
    }
  }
})
</script>

<template>
  <!-- Heading & Subheading -->
  <div class="auth-header">
    <h2 class="form-title">Register</h2>
    <p>{{ t('header') }}</p>
  </div>

  <!-- Registration Form -->
  <form class="register-form" @submit.prevent="onSubmit" novalidate>
    <!-- Row for first & last name side-by-side -->
    <div class="form-row">
      <div class="form-group half">
        <label for="firstName">{{ t('firstName') }}</label>
        <input
          type="text"
          v-model="firstName"
          :placeholder="t('firstName')"
        />
        <p class="input-error" :class="{ visible: firstNameError }">
          {{ firstNameError || '\u00A0' }}
        </p>
      </div>

      <div class="form-group half">
        <label for="lastName">{{ t('lastName') }}</label>

        <input
          type="text"
          v-model="lastName"
          :placeholder="t('lastName')"
        />
        <p class="input-error" :class="{ visible: lastNameError }">
          {{ lastNameError || '\u00A0' }}
        </p>
      </div>
    </div>

    <!-- Email -->
    <div class="form-group">
      <label for="email">{{ t('email') }}</label>
      <input type="email" v-model="email" :placeholder="t('email')"/>
      <p class="input-error" :class="{ visible: emailError }">
        {{ emailError || '\u00A0' }}
      </p>
    </div>

    <!-- Password -->
    <div class="form-group">
      <label for="password">{{ t('password') }}</label>
      <input type="password" v-model="password" :placeholder="t('password')" />
      <p class="input-error" :class="{ visible: passwordError }">
        {{ passwordError || '\u00A0' }}
      </p>
    </div>

    <!-- Confirm Password -->
    <div class="form-group">
      <label for="confirmPassword">{{ t('confirmPassword') }}</label>
      <input type="password" v-model="confirmPassword" :placeholder="t('confirmPassword')" />
      <p class="input-error" :class="{ visible: confirmPasswordError }">
        {{ confirmPasswordError || '\u00A0' }}
      </p>
    </div>

    <!-- Server error (if any) -->
    <p v-if="serverError" class="server-error">{{ serverError }}</p>

    <!-- Submit Button -->
    <button type="submit">
      {{ t('registerBtn') }}
    </button>  </form>
</template>

<style scoped>

.form-title {
  font-size: var(--font-size-h2);
  font-weight: var(--heading-weight);
  color: var(--color-heading);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-md);
}
.auth-header h2 {
  font-size: var(--font-size-h2);
  color: var(--color-heading);
  margin-bottom: var(--spacing-sm);
}
.auth-header p {
  font-size: var(--font-size-sm);
  color: var(--vt-c-text-light-2); /* slightly muted text */
}

/* 3) Form Container */
.register-form {
  display: flex;
  flex-direction: column;
  /* We rely on margin-bottom in .form-group for spacing, so no gap here */
}

/* 4) Side-by-side fields for first/last name */
.form-row {
  display: flex;
  gap: var(--spacing-sm);
}

/* For half-width columns */
.half {
  flex: 1;
}

/* 5) Form Group */
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-sm); /* smaller vertical gap */
}

/* 6) Inputs */
.form-group input {
  width: 100%;
  font-size: var(--font-size-md);
  padding: var(--spacing-sm) var(--spacing-md);
  border: var(--global-border-size) solid var(--color-border);
  border-radius: var(calc(--global-border-radius));
  background-color: var(--color-background);
  color: var(--color-text);
  box-sizing: border-box;
  min-height: 2.5rem; /* optional, to ensure a taller box */

}

.form-group input::placeholder {
  color: var(--vt-c-text-light-2); /* slightly muted placeholder */
}

.form-group input:focus {
  border-color: var(--color-purple-button);
  outline: none;
  box-shadow: 0 0 0 2px rgba(136, 141, 167, 0.2); /* light lavender glow */
}


.accept-tos label {
  font-size: var(--font-size-sm);
  color: var(--vt-c-text-light-2);
  margin-bottom: 0;
}

/* 8) Error styles */
.input-error {
  font-size: var(--font-size-sm);
  color: transparent;
  margin-top: 0.25rem;
  min-height: 1em;
  transition: color 0.2s;
}
.input-error.visible {
  color: red; /* or define a var for error color if you prefer */
}

.server-error {
  color: red;
  font-size: var(--font-size-sm);
  text-align: center;
  margin: var(--spacing-sm) 0;
}

/* 9) Green Submit Button (using custom variables) */
button {
  background-color: var(--color-black-button);
  color: var(--color-white-text);
  border: none;
  border-radius: var(--global-border-radius);
  font-size: var(--font-size-md);
  font-weight: 600;
  padding: var(--btn-padding-y) var(--btn-padding-x);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease-in-out;
}

button:hover {
  background-color: var(--color-black-button-hover);
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
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
