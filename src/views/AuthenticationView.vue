<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from '@/components/Authentication/LoginForm.vue';
import SignupForm from '@/components/Authentication/SignUpForm.vue'; // Example signup form
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Track which tab is active
const activeTab = ref<'login' | 'signup'>('login');

// Toggle tab
function switchTab(tab: 'login' | 'signup') {
  activeTab.value = tab;
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- Tabs -->
      <div class="auth-tabs">
        <button
          :class="{ active: activeTab === 'login' }"
          @click="switchTab('login')"
        >
          {{ t('loginTab') || 'Logg inn' }}
        </button>
        <button
          :class="{ active: activeTab === 'signup' }"
          @click="switchTab('signup')"
        >
          {{ t('signupTab') || 'Opprett konto' }}
        </button>
      </div>

      <!-- Divider under the tabs -->
      <div class="auth-divider"></div>

      <!-- Conditionally render the forms -->
      <div class="auth-body">
        <SignupForm v-if="activeTab === 'signup'" />
        <LoginForm v-else />
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
  background-color: var(--color-background); /* or whatever background your site uses */
}


/* Remove the divider (if any) */
.auth-divider {
  display: none;
}
/* The card with a border and slight radius */
.auth-card {
  border: 1px solid #000;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  margin: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  background-color: var(--color-background-soft);
  padding: var(--spacing-lg)
}

/* Tabs container */
.auth-tabs {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 1rem;
  gap: var(--spacing-md);
}
/* Individual tab buttons */
.auth-tabs button {
  flex: 1;
  background: none;
  text-align: center;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-bottom: 2px solid var(--vt-hokieStone-6t);
  transition: all 0.3s ease;
  color: var(--color-text);

}

/* Highlight the active tab text or use an underline/border */
.auth-tabs button.active {
  font-weight: bold;
  border-bottom: 2px solid var(--vt-c-black); /* black underline */
}

.auth-tabs button:not(.active):hover {
  color: var(--color-purple-button);
}

/* Divider line under the tabs */
.auth-divider {
  border-bottom: 1px solid #000; /* black line to separate tabs from body */
}

/* Card body where forms are displayed */
.auth-body {
  padding: 1.5rem;
}


</style>
