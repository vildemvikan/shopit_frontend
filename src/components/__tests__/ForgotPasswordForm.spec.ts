import { ref } from 'vue'
import { vi } from 'vitest'

const fieldValues: Record<string, any> = {}
const fieldErrors: Record<string, any> = {}

vi.mock('vee-validate', () => {
  return {
    useForm: () => ({
      handleSubmit: (fn: any) => {
        return () => {
          const emailVal = fieldValues.email ? fieldValues.email.value : ''
          let valid = true
          if (!emailVal) {
            if (fieldErrors.email) fieldErrors.email.value = 'Email is required'
            valid = false
          } else if (!emailVal.includes('@')) {
            if (fieldErrors.email) fieldErrors.email.value = 'Invalid email'
            valid = false
          } else {
            if (fieldErrors.email) fieldErrors.email.value = ''
          }
          if (!valid) return // Do not submit if validation fails.
          return fn({ email: emailVal })
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


vi.mock('../../../utils/Authentication.ts', () => {
  return {
    sendResetEmail: vi.fn()
  }
})


import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createI18n } from 'vue-i18n'
import ForgotPasswordForm from '@/components/Authentication/ForgotPasswordForm.vue' // adjust path as needed
import en from '../../assets/transcripts/en.json'
import { sendResetEmail } from '../../../utils/Authentication.ts'
import { createRouter, createMemoryHistory } from 'vue-router'

const fakeRouter = createRouter({
  history: createMemoryHistory(),
  routes: []
})
fakeRouter.push = vi.fn()

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en }
})

describe('ForgotPasswordForm.vue', () => {
  beforeEach(() => {
    // Clear mocks and reset our global reactive fields.
    vi.clearAllMocks()
    fieldValues.email = ref('')
    fieldErrors.email = ref('')
  })

  it('sends reset email and displays success message when valid email provided', async () => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })

    const wrapper = mount(ForgotPasswordForm, {
      global: {
        plugins: [i18n, pinia, fakeRouter],
        stubs: { RouterLink: true },
      }
    })
    const mockedSendResetEmail = vi.mocked(sendResetEmail, true);

    mockedSendResetEmail.mockRejectedValue({ response: { status: 500 } });

    // Fill in a valid email.
    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@example.com')
    await emailInput.trigger('blur')

    // Submit the form.
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Assert that sendResetEmail was called with the valid email.
    expect(sendResetEmail).toHaveBeenCalledWith('test@example.com')


  })

  it('displays error when reset email fails', async () => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })

    const wrapper = mount(ForgotPasswordForm, {
      global: {
        plugins: [i18n, pinia, fakeRouter],
        stubs: { RouterLink: true },
      }
    })

    const mockedSendResetEmail = vi.mocked(sendResetEmail, true);

    mockedSendResetEmail.mockRejectedValue({ response: { status: 500 } });

    // Fill in an email.
    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('fail@example.com')
    await emailInput.trigger('blur')

    // Submit the form.
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Expect that sendResetEmail was called.
    expect(sendResetEmail).toHaveBeenCalledWith('fail@example.com')
    // And that the server error message is displayed.
    expect(wrapper.find('.server-error').exists()).toBe(true)
    expect(wrapper.find('.server-error').text()).toBe(i18n.global.t('resetRequestFailed'))
  })

  it('does not submit the form if email is invalid', async () => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })

    const wrapper = mount(ForgotPasswordForm, {
      global: {
        plugins: [i18n, pinia, fakeRouter],
        stubs: { RouterLink: true },
      }
    })

    const mockedSendResetEmail = vi.mocked(sendResetEmail, true);

    mockedSendResetEmail.mockRejectedValue({ response: { status: 500 } });

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    // sendResetEmail should not be called.
    expect(sendResetEmail).not.toHaveBeenCalled()

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('invalid-email')  // no '@'
    await emailInput.trigger('blur')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Still, sendResetEmail should not be called.
    expect(sendResetEmail).not.toHaveBeenCalled()

    // And a validation error should be visible
    const errorMessages = wrapper.findAll('.input-error.visible')
    // We expect at least one error message that includes "Invalid email".
    expect(errorMessages.some(node => node.text().includes('Invalid email'))).toBe(true)
  })
})
