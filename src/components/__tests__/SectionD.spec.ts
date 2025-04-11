// First, mock the fetchPostalCodeInfo from the Advertisement utils.
import { vi } from 'vitest'
vi.mock('../../../utils/Advertisement.ts', () => {
  return {
    fetchPostalCodeInfo: vi.fn(),
  }
})
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import SectionD from '@/components/Schema/SectionD.vue'
import en from '../../assets/transcripts/en.json'
import { fetchPostalCodeInfo } from '../../../utils/Advertisement.ts'
import { createTestingPinia } from '@pinia/testing'

// Create an i18n instance.
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
})

describe('SectionD.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes postal code info on mount when postal number is valid and fetch returns valid info', async () => {
    const propsData = {
      postalNumber: '1234',
      postalNumberError: false,
    }

    // When fetchPostalCodeInfo is called with "1234", resolve with valid info.
    ;(fetchPostalCodeInfo as any).mockResolvedValue({
      result: 'Test City',
      valid: true,
      postalCodeType: 'typeA',
    })

    const wrapper = mount(SectionD, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
      },
      props: propsData,
    })
    await flushPromises()

    // Verify that the label displays the returned city
    const cityLabel = wrapper.find('.post-number-box label')
    expect(cityLabel.text()).toBe('Test City')

    expect(wrapper.emitted()['update:postalNumber']).toBeTruthy()
    expect(wrapper.emitted()['update:postalNumber'][0]).toEqual(['1234'])
  })

  it('clears city and emits update:postalNumber with empty string when postal number length is not 4', async () => {
    const propsData = {
      postalNumber: '1234',
      postalNumberError: false,
    }

    // Initially resolve with valid info.
    ;(fetchPostalCodeInfo as any).mockResolvedValue({
      result: 'Test City',
      valid: true,
      postalCodeType: 'typeA',
    })

    const wrapper = mount(SectionD, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
      },
      props: propsData,
    })
    await flushPromises()

    // Confirm that the city label initially displays "Test City"
    const cityLabel = wrapper.find('.post-number-box label')
    expect(cityLabel.text()).toBe('Test City')

    // Simulate changing the postal number input to a shorter value
    const postNumberInput = wrapper.find('input.post-number-input')
    await postNumberInput.setValue('12')
    await postNumberInput.trigger('input')
    await flushPromises()

    expect(cityLabel.text()).toBe('')
    const updateEvents = wrapper.emitted()['update:postalNumber']
    expect(updateEvents[updateEvents.length - 1]).toEqual([''])
  })

  it('sanitizes postal number input, removing non-digits', async () => {
    const propsData = {
      postalNumber: '',
      postalNumberError: false,
    }

    ;(fetchPostalCodeInfo as any).mockResolvedValue({
      result: 'Test City',
      valid: true,
      postalCodeType: 'typeA',
    })

    const wrapper = mount(SectionD, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
      },
      props: propsData,
    })
    await flushPromises()

    const postNumberInputWrapper = wrapper.find('input.post-number-input')
    const postNumberInputEl = postNumberInputWrapper.element as HTMLInputElement

    // Simulate entering non-digit characters.
    await postNumberInputWrapper.setValue('12a3')
    await postNumberInputWrapper.trigger('input')
    await flushPromises()

    // Expect the input to be sanitized, leaving only digits.
    expect(postNumberInputEl.value).toBe('123')
  })

  it('handles fetchPostalCodeInfo returning invalid info by clearing city', async () => {
    const propsData = {
      postalNumber: '1234',
      postalNumberError: false,
    }

    // Mock fetchPostalCodeInfo to return invalid info.
    ;(fetchPostalCodeInfo as any).mockResolvedValue({
      result: 'Invalid City',
      valid: false,
      postalCodeType: 'typeA',
    })

    const wrapper = mount(SectionD, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
      },
      props: propsData,
    })
    await flushPromises()

    const cityLabel = wrapper.find('.post-number-box label')
    expect(cityLabel.text()).toBe('')
  })

  it('logs error and clears city if fetchPostalCodeInfo throws an error', async () => {
    const propsData = {
      postalNumber: '1234',
      postalNumberError: false,
    }

    // Mock fetchPostalCodeInfo to throw an error.
    ;(fetchPostalCodeInfo as any).mockRejectedValue(new Error('Network error'))

    const wrapper = mount(SectionD, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
      },
      props: propsData,
    })
    await flushPromises()

    const cityLabel = wrapper.find('.post-number-box label')
    expect(cityLabel.text()).toBe('')
  })
})
