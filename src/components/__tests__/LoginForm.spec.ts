import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useTokenStore } from '@/stores/tokenStore'
import { createI18n } from 'vue-i18n'
import LoginForm from '@/components/Authentication/LoginForm.vue'
import en from '../../assets/transcripts/en.json'
import { ref } from 'vue'



const fieldValues: Record<string, any> = {}
const fieldErrors: Record<string, any> = {}

vi.mock('vee-validate', () => {
  return {
    useForm: () => ({
      // Simulate validation: only call the submission callback if values are valid,
      // and update errorMessage refs if they’re not.
      handleSubmit: (fn: any) => {
        return () => {
          const emailVal = fieldValues.email ? fieldValues.email.value : ''
          const passwordVal = fieldValues.password ? fieldValues.password.value : ''
          let valid = true;
          // Validate email
          if (!emailVal) {
            if (fieldErrors.email) {
              fieldErrors.email.value = 'Email is required'
            }
            valid = false
          } else if (!emailVal.includes('@')) {
            if (fieldErrors.email) {
              fieldErrors.email.value = 'Invalid email'
            }
            valid = false
          } else {
            if (fieldErrors.email) {
              fieldErrors.email.value = ''
            }
          }
          if (!passwordVal) {
            if (fieldErrors.password) {
              fieldErrors.password.value = 'Password is required'
            }
            valid = false
          } else {
            if (fieldErrors.password) {
              fieldErrors.password.value = ''
            }
          }
          // If not valid, do not call fn
          if (!valid) {
            return;
          }
          return fn({ email: emailVal, password: passwordVal })
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

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en }
})

describe('LoginForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fieldValues.email = ref('');
    fieldValues.password = ref('');
  })

  it('logs in successfully when credentials are valid', async () => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })
    // **Get and modify the token store BEFORE mounting**
    const tokenStore = useTokenStore(pinia)
    tokenStore.login = vi.fn().mockResolvedValue(undefined)

    const wrapper = mount(LoginForm, {
      global: {
        plugins: [i18n, pinia],
        stubs: { RouterLink: true }
      }
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    await emailInput.setValue('test@example.com')
    await emailInput.trigger('blur')
    await passwordInput.setValue('password123')
    await passwordInput.trigger('blur')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(tokenStore.login).toHaveBeenCalledWith('test@example.com', 'password123')
    expect(wrapper.text()).not.toContain('The email address or password you entered is incorrect')
  })

  it('shows error if login fails with 401', async () => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })
    const tokenStore = useTokenStore(pinia)
    tokenStore.login = vi.fn().mockRejectedValue({
      response: { status: 401 }
    })

    const wrapper = mount(LoginForm, {
      global: {
        plugins: [i18n, pinia],
        stubs: { RouterLink: true }
      }
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    await emailInput.setValue('fail@example.com')
    await emailInput.trigger('blur')
    await passwordInput.setValue('wrongpass')
    await passwordInput.trigger('blur')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('.server-error').exists()).toBe(true)
  })

  it('validates form fields before submission', async () => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })
    const tokenStore = useTokenStore(pinia)
    tokenStore.login = vi.fn()

    const wrapper = mount(LoginForm, {
      global: {
        plugins: [i18n, pinia],
        stubs: { RouterLink: true }
      }
    })

    // Submit form without filling any fields
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Login should not be called
    expect(tokenStore.login).not.toHaveBeenCalled()

    // Check for validation messages on both fields
    const errorMessages = wrapper.findAll('.input-error.visible')
    expect(errorMessages.length).toBe(2)

    // Invalid email format test
    await wrapper.find('input[type="email"]').setValue('invalid-email')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(tokenStore.login).not.toHaveBeenCalled()
    expect(wrapper.findAll('.input-error.visible').length).toBeGreaterThan(0)
  })
})
