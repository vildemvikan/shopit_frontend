<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '@/components/Authentication/LoginForm.vue'
import SignupForm from '@/components/Authentication/SignUpForm.vue'
import { useI18n } from 'vue-i18n'
import ForgotPasswordForm from '@/components/Authentication/ForgotPasswordForm.vue'

const { t } = useI18n()

// Track which tab is active
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-tabs" v-if="$route.name === 'Login' || $route.name === 'Signup'">
        <RouterLink
          :to="'/auth/login'"
          class="tab"
          :class="{ active: $route.path === '/auth/login' }"
        >
          {{ t('loginTab') }}
        </RouterLink>
        <RouterLink
          :to="'/auth/signup'"
          class="tab"
          :class="{ active: $route.path === '/auth/signup' }"
        >
          {{ t('signupTab') }}
        </RouterLink>
      </div>
      <div class="auth-divider"></div>
      <div class="auth-body">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-background);
}
.auth-card {
  border: 1px solid #000;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  margin: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  background-color: var(--color-background-soft);
  padding: var(--spacing-lg);
}
.auth-tabs {
  display: flex;
  justify-content: space-evenly;
  padding: 1rem;
  gap: var(--spacing-md);
}
.tab {
  flex: 1;
  text-align: center;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-bottom: 2px solid var(--vt-hokieStone-6t);
  transition: all 0.3s ease;
  color: var(--color-text);
}
.tab.active {
  font-weight: bold;
  border-bottom: 2px solid var(--vt-c-black);
}
.tab:not(.active):hover {
  color: var(--color-purple-button);
}
.auth-divider {
  border-bottom: none;
}
.auth-body {
  padding: 1.5rem;
}

@media (max-width: 600px) {
  .auth-card {
    padding: 1rem;
    box-shadow: none;
    margin: 0;
    width: 100%;
    min-width: 320px;
  }

  .auth-tabs {
    gap: 0.5rem;
  }

  .tab {
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: 700;
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
