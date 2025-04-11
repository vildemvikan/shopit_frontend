import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import SimpleSearch from '../Search/SimpleSearch.vue' // Adjust the path if needed
import en from '../../assets/transcripts/en.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
})

describe('SimpleSearch.vue', () => {
  beforeEach(() => {
    // Have it here incase we remove vi.mock
  })

  it('renders with correct placeholder and button label from i18n', () => {
    const wrapper = mount(SimpleSearch, {
      global: {
        plugins: [i18n],
      },
    })

    const searchInput = wrapper.find('input.search-input')
    expect(searchInput.attributes('placeholder')).toBe(en['label-search'])

    // Verify that the button label is the translated text for 'button-search'.
    const buttonLabel = wrapper.find('button.search-button label')
    expect(buttonLabel.text()).toBe(en['button-search'])
  })

  it('emits updateKeyword with the correct search string when button is clicked', async () => {
    const wrapper = mount(SimpleSearch, {
      global: {
        plugins: [i18n],
      },
    })

    // Find the search input and update its value.
    const searchInput = wrapper.find('input.search-input')
    await searchInput.setValue('vue test')
    await flushPromises()

    // Click the search button.
    const searchButton = wrapper.find('button.search-button')
    await searchButton.trigger('click')
    await flushPromises()

    // Verify that the component emits the "updateKeyword" event with the input value.
    const emitted = wrapper.emitted('updateKeyword')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual(['vue test'])
  })
})
