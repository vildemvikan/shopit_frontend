
import { ref } from 'vue'
import { vi } from 'vitest'

const fieldValues: Record<string, any> = {}
const fieldErrors: Record<string, any> = {}

vi.mock('vee-validate', () => {
  return {
    useForm: () => ({
      handleSubmit: (fn: any) => {
        return () => {
          const firstNameVal = fieldValues.firstName ? fieldValues.firstName.value : ''
          const lastNameVal = fieldValues.lastName ? fieldValues.lastName.value : ''
          const emailVal = fieldValues.email ? fieldValues.email.value : ''
          const passwordVal = fieldValues.password ? fieldValues.password.value : ''
          const confirmPasswordVal = fieldValues.confirmPassword ? fieldValues.confirmPassword.value : ''
          let valid = true;
          if (!firstNameVal) {
            if (fieldErrors.firstName) fieldErrors.firstName.value = 'First name is required'
            valid = false;
          } else {
            if (fieldErrors.firstName) fieldErrors.firstName.value = ''
          }
          if (!lastNameVal) {
            if (fieldErrors.lastName) fieldErrors.lastName.value = 'Last name is required'
            valid = false;
          } else {
            if (fieldErrors.lastName) fieldErrors.lastName.value = ''
          }
          if (!emailVal) {
            if (fieldErrors.email) fieldErrors.email.value = 'Email is required'
            valid = false;
          } else if (!emailVal.includes('@')) {
            if (fieldErrors.email) fieldErrors.email.value = 'Invalid email'
            valid = false;
          } else {
            if (fieldErrors.email) fieldErrors.email.value = ''
          }
          if (!passwordVal || passwordVal.length < 6) {
            if (fieldErrors.password) fieldErrors.password.value = 'Password is required or too short'
            valid = false;
          } else {
            if (fieldErrors.password) fieldErrors.password.value = ''
          }
          if (!confirmPasswordVal) {
            if (fieldErrors.confirmPassword) fieldErrors.confirmPassword.value = 'Password confirmation is required'
            valid = false;
          } else if (confirmPasswordVal !== passwordVal) {
            if (fieldErrors.confirmPassword) fieldErrors.confirmPassword.value = 'Passwords do not match'
            valid = false;
          } else {
            if (fieldErrors.confirmPassword) fieldErrors.confirmPassword.value = ''
          }
          if (!valid) {
            return;
          }
          return fn({
            firstName: firstNameVal,
            lastName: lastNameVal,
            email: emailVal,
            password: passwordVal,
            confirmPassword: confirmPasswordVal,
          })
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


import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useTokenStore } from '@/stores/tokenStore'
import { createI18n } from 'vue-i18n'
import SignUpForm from '@/components/Authentication/SignUpForm.vue'
import en from '../../assets/transcripts/en.json'
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: []
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en }
})

describe('SignUpForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset global field values and errors.
    fieldValues.firstName = ref('')
    fieldValues.lastName = ref('')
    fieldValues.email = ref('')
    fieldValues.password = ref('')
    fieldValues.confirmPassword = ref('')
    fieldErrors.firstName = ref('')
    fieldErrors.lastName = ref('')
    fieldErrors.email = ref('')
    fieldErrors.password = ref('')
    fieldErrors.confirmPassword = ref('')
  })

  it('registers successfully when valid credentials are provided', async () => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })
    const tokenStore = useTokenStore(pinia)
    tokenStore.registerAndSaveToken = vi.fn().mockResolvedValue(undefined)

    const wrapper = mount(SignUpForm, {
      global: {
        plugins: [i18n, pinia, router],
        stubs: { RouterLink: true }
      }
    })

    await wrapper.find('input[placeholder="First name"]').setValue('John')
    await wrapper.find('input[placeholder="Last name"]').setValue('Doe')
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[placeholder="Password"]').setValue('password123')
    await wrapper.find('input[placeholder="Confirm password"]').setValue('password123')
    await wrapper.find('input[placeholder="First name"]').trigger('blur')
    await wrapper.find('input[placeholder="Last name"]').trigger('blur')
    await wrapper.find('input[type="email"]').trigger('blur')
    await wrapper.find('input[placeholder="Password"]').trigger('blur')
    await wrapper.find('input[placeholder="Confirm password"]').trigger('blur')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Expect the registration action to be called with specific arguments.
    expect(tokenStore.registerAndSaveToken).toHaveBeenCalledWith(
      'test@example.com',
      'John',
      'Doe',
      'password123'
    )

    vi.useFakeTimers()
    vi.advanceTimersByTime(1500)
    await flushPromises()
    console.log(wrapper.html())
    expect(tokenStore.registerAndSaveToken).toHaveBeenCalledWith(
      'test@example.com',
      'John',
      'Doe',
      'password123'
    );
    vi.useRealTimers()
  })

  it('shows error if registration fails with 400', async () => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })
    const tokenStore = useTokenStore(pinia)
    tokenStore.registerAndSaveToken = vi.fn().mockRejectedValue({
      response: { status: 400 }
    })

    const wrapper = mount(SignUpForm, {
      global: {
        plugins: [i18n, pinia, router],
        stubs: { RouterLink: true }
      }
    })

    await wrapper.find('input[placeholder="First name"]').setValue('Jane')
    await wrapper.find('input[placeholder="Last name"]').setValue('Doe')
    await wrapper.find('input[type="email"]').setValue('jane@example.com')
    await wrapper.find('input[placeholder="Password"]').setValue('password123')
    await wrapper.find('input[placeholder="Confirm password"]').setValue('password123')
    await wrapper.find('input[placeholder="First name"]').trigger('blur')
    await wrapper.find('input[placeholder="Last name"]').trigger('blur')
    await wrapper.find('input[type="email"]').trigger('blur')
    await wrapper.find('input[placeholder="Password"]').trigger('blur')
    await wrapper.find('input[placeholder="Confirm password"]').trigger('blur')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Check that an element with class 'server-error' shows the proper message.
    expect(wrapper.find('.server-error').exists()).toBe(true)
    expect(wrapper.find('.server-error').text()).toBe(i18n.global.t('emailTaken'))
  })

  it('validates form fields before submission', async () => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })
    const tokenStore = useTokenStore(pinia)
    tokenStore.registerAndSaveToken = vi.fn()

    const wrapper = mount(SignUpForm, {
      global: {
        plugins: [i18n, pinia, router],
        stubs: { RouterLink: true }
      }
    })

    // Submit form without filling any fields.
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Expect the registration action not to be called.
    expect(tokenStore.registerAndSaveToken).not.toHaveBeenCalled()

    // Check for validation errors.
    const errors = wrapper.findAll('.input-error.visible')
    // For this example, we expect 5 errors:
    expect(errors.length).toBe(5)

    // Now test with an invalid email and mismatched confirmPassword:
    await wrapper.find('input[placeholder="First name"]').setValue('Test')
    await wrapper.find('input[placeholder="Last name"]').setValue('User')
    await wrapper.find('input[type="email"]').setValue('invalid-email') // invalid email (no '@')
    await wrapper.find('input[placeholder="Password"]').setValue('password123')
    await wrapper.find('input[placeholder="Confirm password"]').setValue('different')
    await wrapper.find('input[placeholder="First name"]').trigger('blur')
    await wrapper.find('input[placeholder="Last name"]').trigger('blur')
    await wrapper.find('input[type="email"]').trigger('blur')
    await wrapper.find('input[placeholder="Password"]').trigger('blur')
    await wrapper.find('input[placeholder="Confirm password"]').trigger('blur')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // The registration action should still not be called.
    expect(tokenStore.registerAndSaveToken).not.toHaveBeenCalled()
    const confirmPwdErrors = wrapper.findAll('.input-error').filter(node =>
      node.text().includes('Passwords do not match')
    )
    expect(confirmPwdErrors.length).toBeGreaterThan(0)
  })
})
