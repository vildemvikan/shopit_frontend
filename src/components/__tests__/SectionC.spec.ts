import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import { createTestingPinia } from '@pinia/testing'
import SectionC from '../Schema/SectionC.vue' // Adjust path as needed
import en from '../../assets/transcripts/en.json'

const PaymentMethod = {
  Direct: 'DIRECT',
  Auction: 'BID',
  None: 'CONTACT',
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
})

describe('SectionC.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes internal state from props on mount', async () => {
    const propsData = {
      price: 100,
      payment: PaymentMethod.Direct,
      priceError: false,
    }

    const wrapper = mount(SectionC, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
      },
      props: propsData,
    })
    await flushPromises()

    // Verify that the price input displays the initial price.
    const priceInput = wrapper.find('input.price-input')
    expect(priceInput.element.value).toBe('100')
    // Find all elements with class "payment-method".
    const paymentOptions = wrapper.findAll('.payment-method')
    // We expect two options
    expect(paymentOptions.length).toBe(2)
    // Find the direct payment option.
    const directOption = paymentOptions.find((opt) => {
      return opt.find('input').attributes('value') === PaymentMethod.Direct
    })
    expect(directOption).toBeTruthy()
    const directCheckbox = directOption!.find('input')
    // Since props.payment is DIRECT, the DIRECT checkbox should be checked.
    expect(directCheckbox.element.checked).toBe(true)

    // Find the Auction option.
    const auctionOption = paymentOptions.find((opt) => {
      return opt.find('input').attributes('value') === PaymentMethod.Auction
    })
    expect(auctionOption).toBeTruthy()
    const auctionCheckbox = auctionOption!.find('input')
    expect(auctionCheckbox.element.checked).toBe(false)
  })

  it('sanitizes price input and emits update:price', async () => {
    const propsData = {
      price: 0,
      payment: PaymentMethod.None,
      priceError: false,
    }

    const wrapper = mount(SectionC, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
      },
      props: propsData,
    })
    await flushPromises()
    const priceInputWrapper = wrapper.find('input.price-input')
    const priceInputEl = priceInputWrapper.element as HTMLInputElement

    // Manually set the value of the input to simulate a user typing "123abc".
    Object.defineProperty(priceInputEl, 'value', { value: '123abc', writable: true })

    await priceInputWrapper.trigger('input')
    await flushPromises()

    // The sanitizePriceInput method should remove non-digits.
    expect(priceInputEl.value).toBe('123')

    const emittedPrice = wrapper.emitted()['update:price']
    expect(emittedPrice).toBeTruthy()
    expect(emittedPrice[emittedPrice.length - 1]).toEqual([123])
  })

  it('toggles payment when an option is clicked and emits update:payment', async () => {
    const propsData = {
      price: 100,
      payment: PaymentMethod.Direct,
      priceError: false,
    }

    const wrapper = mount(SectionC, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
      },
      props: propsData,
    })
    await flushPromises()

    const paymentOptions = wrapper.findAll('.payment-method')
    const directOption = paymentOptions.find((opt) => {
      return opt.find('input').attributes('value') === PaymentMethod.Direct
    })
    expect(directOption).toBeTruthy()
    // Click the direct option again: toggle off.
    await directOption!.trigger('click')
    await flushPromises()
    expect(wrapper.emitted()['update:payment']).toBeTruthy()
    // Expect the emitted value to be PaymentMethod.None.
    expect(
      wrapper.emitted()['update:payment'][wrapper.emitted()['update:payment'].length - 1],
    ).toEqual([PaymentMethod.None])

    // Now, click the Auction option to set payment to BID.
    const auctionOption = paymentOptions.find((opt) => {
      return opt.find('input').attributes('value') === PaymentMethod.Auction
    })
    expect(auctionOption).toBeTruthy()
    await auctionOption!.trigger('click')
    await flushPromises()
    expect(
      wrapper.emitted()['update:payment'][wrapper.emitted()['update:payment'].length - 1],
    ).toEqual([PaymentMethod.Auction])
  })
})
