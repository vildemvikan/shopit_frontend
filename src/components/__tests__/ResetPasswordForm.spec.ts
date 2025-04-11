// ResetPasswordForm.spec.ts

// ---
// 1. Stub vee-validate so our component receives reactive fields and performs basic validation.
// Place this at the very top, before importing the component.
import { ref } from 'vue'
import { vi } from 'vitest'

// Global storages for field values and error messages.
const fieldValues: Record<string, any> = {}
const fieldErrors: Record<string, any> = {}

vi.mock('vee-validate', () => {
  return {
    useForm: () => ({
      // This handleSubmit checks that:
      // - The password is non-empty and at least 6 characters,
      // - confirmPassword is non-empty and matches password.
      // Only if these conditions pass, the callback fn is called.
      handleSubmit: (fn: any) => {
        return () => {
          const passwordVal = fieldValues.password ? fieldValues.password.value : ''
          const confirmPasswordVal = fieldValues.confirmPassword
            ? fieldValues.confirmPassword.value
            : ''
          let valid = true
          if (!passwordVal || passwordVal.length < 6) {
            if (fieldErrors.password)
              fieldErrors.password.value = 'Password is required or too short'
            valid = false
          } else {
            if (fieldErrors.password) fieldErrors.password.value = ''
          }
          if (!confirmPasswordVal) {
            if (fieldErrors.confirmPassword)
              fieldErrors.confirmPassword.value = 'Password confirmation is required'
            valid = false
          } else if (confirmPasswordVal !== passwordVal) {
            if (fieldErrors.confirmPassword)
              fieldErrors.confirmPassword.value = 'Passwords do not match'
            valid = false
          } else {
            if (fieldErrors.confirmPassword) fieldErrors.confirmPassword.value = ''
          }
          if (!valid) {
            return
          }
          return fn({ password: passwordVal, confirmPassword: confirmPasswordVal })
        }
      },
    }),
    useField: (name: string) => {
      if (!fieldValues[name]) {
        fieldValues[name] = ref('')
      }
      if (!fieldErrors[name]) {
        fieldErrors[name] = ref('')
      }
      return {
        value: fieldValues[name],
        errorMessage: fieldErrors[name],
      }
    },
  }
})

// ---
// 2. Mock the authentication utilities for password reset.
vi.mock('../../../utils/Authentication.ts', () => {
  return {
    resetPasswordWithToken: vi.fn(),
    validateResetToken: vi.fn(),
  }
})

// ---
// Now import our dependencies and the component.
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createI18n } from 'vue-i18n'
import ResetPasswordForm from '@/components/Authentication/ResetPasswordForm.vue' // adjust path if needed
import en from '../../assets/transcripts/en.json'
import { resetPasswordWithToken, validateResetToken } from '../../../utils/Authentication.ts'
import { createRouter, createMemoryHistory } from 'vue-router'

// Create a fake router with a minimal route (used for router.push) and set its currentRoute to include query params.
const fakeRouter = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/login', name: 'Login', component: { template: '<div>Login</div>' } }],
})
fakeRouter.push = vi.fn()
fakeRouter.currentRoute.value = {
  hash: '',
  redirectedFrom: undefined,
  path: '/',
  query: { token: 'test-token', email: 'test@example.com' },
  params: {},
  name: undefined,
  matched: [],
  fullPath: '/',
  meta: {},
}

// Create our i18n instance.
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
})

describe('ResetPasswordForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset global field values for password fields.
    fieldValues.password = ref('')
    fieldValues.confirmPassword = ref('')
    fieldErrors.password = ref('')
    fieldErrors.confirmPassword = ref('')
  })

  it('resets password successfully when valid credentials are provided', async () => {
    // Enable fake timers at the beginning of this test.
    vi.useFakeTimers()

    // Make validateResetToken resolve with valid:true.
    ;(validateResetToken as any).mockResolvedValue({ valid: true })
    ;(resetPasswordWithToken as any).mockResolvedValue(undefined)

    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })
    const wrapper = mount(ResetPasswordForm, {
      global: {
        plugins: [i18n, pinia, fakeRouter],
        stubs: { RouterLink: true },
      },
    })

    // Wait for onMounted to finish (validateResetToken call).
    await flushPromises()

    // Ensure the form is rendered.
    expect(wrapper.find('form').exists()).toBe(true)

    // Fill in valid password fields.
    const passwordInput = wrapper.find('input#password')
    const confirmPasswordInput = wrapper.find('input#confirmPassword')
    await passwordInput.setValue('password123')
    await passwordInput.trigger('blur')
    await confirmPasswordInput.setValue('password123')
    await confirmPasswordInput.trigger('blur')

    // Submit the form.
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Verify that resetPasswordWithToken was called as expected.
    expect(resetPasswordWithToken).toHaveBeenCalledWith(
      'test-token',
      'test@example.com',
      'password123',
    )

    // Now, advance timers by 2500ms so the setTimeout callback will run.
    vi.advanceTimersByTime(2500)
    await flushPromises()

    // Now check that router.push was called with '/login'.
    expect(fakeRouter.push).toHaveBeenCalledWith('/login')

    // Restore real timers.
    vi.useRealTimers()
  })

  it('shows error when reset password fails', async () => {
    ;(validateResetToken as any).mockResolvedValue({ valid: true })
    ;(resetPasswordWithToken as any).mockRejectedValue({ response: { status: 500 } })

    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })
    const wrapper = mount(ResetPasswordForm, {
      global: {
        plugins: [i18n, pinia, fakeRouter],
        stubs: { RouterLink: true },
      },
    })

    await flushPromises()
    // The form should be rendered.
    expect(wrapper.find('form').exists()).toBe(true)

    // Fill in valid passwords.
    const passwordInput = wrapper.find('input#password')
    const confirmPasswordInput = wrapper.find('input#confirmPassword')
    await passwordInput.setValue('password123')
    await passwordInput.trigger('blur')
    await confirmPasswordInput.setValue('password123')
    await confirmPasswordInput.trigger('blur')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Check that resetPasswordWithToken was called.
    expect(resetPasswordWithToken).toHaveBeenCalledWith(
      'test-token',
      'test@example.com',
      'password123',
    )
    // Check that a server error message is shown.
    expect(wrapper.find('.server-error').exists()).toBe(true)
    expect(wrapper.find('.server-error').text()).toBe(i18n.global.t('resetFailed'))
  })

  it('shows invalid token message when token is invalid', async () => {
    // Simulate token validation failing.
    ;(validateResetToken as any).mockResolvedValue({ valid: false })

    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })
    const wrapper = mount(ResetPasswordForm, {
      global: {
        plugins: [i18n, pinia, fakeRouter],
        stubs: { RouterLink: true },
      },
    })

    await flushPromises()
    // Expect that the form is not rendered.
    expect(wrapper.find('form').exists()).toBe(false)
    // Instead, an invalid token message should be displayed.
    expect(wrapper.find('.invalid-token-message').exists()).toBe(true)
    expect(wrapper.find('.invalid-token-message').text()).toContain(
      i18n.global.t('invalidOrExpiredTokenTitle'),
    )
  })
})
