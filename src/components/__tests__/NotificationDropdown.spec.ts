import { vi } from 'vitest'
vi.mock('../../../utils/Notification', () => {
  return {
    getNotification: vi.fn(),
    deleteNotification: vi.fn(),
  }
})

import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import NotificationDropdown from '../Notification/NotificationDropdown.vue'
import { createI18n } from 'vue-i18n'

import en from '../../assets/transcripts/en.json'
import { createTestingPinia } from '@pinia/testing'

import { getNotification, deleteNotification } from '../../../utils/Notification'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
})

describe('NotificationDropdown.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    getNotification.mockResolvedValue({
      content: [
        {
          id: 1,
          type: 'BID_PLACED',
          args: {},
          createdAt: new Date().toISOString(),
        },
      ],
      totalPages: 1,
    })
    deleteNotification.mockResolvedValue(true)
  })

  const mountComponent = () =>
    mount(NotificationDropdown, {
      global: {
        plugins: [
          i18n,
          createTestingPinia({
            stubActions: false,
            initialState: {
              tokenStore: {
                jwtToken: 'dummyToken',
                accessTokenExpiresAt: Date.now() + 30 * 60 * 1000,
                email: 'dummy@example.com'
              },
            },
            createSpy: vi.fn,
          })
        ],
        stubs: {
          RouterLink: true,
        },
      },
    })

  it('calls getNotification on mount', async () => {
    mountComponent()
    await flushPromises()
    expect(getNotification).toHaveBeenCalledWith(0, 3)
  })

  it('renders a notification correctly using i18n translation', async () => {
    const wrapper = mountComponent()
    await flushPromises()
    const renderedText = wrapper.find('.msg').text()
    // Since the expected text is directly from the transcription, we have to include {item}
    const text: string = '{item} '+renderedText
    const expectedText = en.notification
      ? en.notification.BID_PLACED
      : 'notification.BID_PLACED'
    expect(text).toContain(expectedText)
    // Verify that at least one notification item is rendered.
    expect(wrapper.find('.item').exists()).toBe(true)
  })

  it('loads more notifications when clicking load more', async () => {
    getNotification.mockResolvedValueOnce({
      content: [
        { id: 1, type: 'BID_PLACED', args: {}, createdAt: new Date().toISOString() },
        { id: 2, type: 'BID_PLACED', args: {}, createdAt: new Date().toISOString() },
        { id: 3, type: 'BID_PLACED', args: {}, createdAt: new Date().toISOString() },
      ],
      totalPages: 2,
    })
    // For the next page.
    getNotification.mockResolvedValueOnce({
      content: [
        { id: 4, type: 'BID_PLACED', args: {}, createdAt: new Date().toISOString() },
      ],
      totalPages: 2,
    })

    const wrapper = mountComponent()
    await flushPromises()

    // With three notifications now, the load-more button should be visible.
    const loadMoreButton = wrapper.find('.load-more-btn')
    expect(loadMoreButton.exists()).toBe(true)

    await loadMoreButton.trigger('click')
    await flushPromises()

    // Verify that the API is called with the next page index.
    expect(getNotification).toHaveBeenCalledWith(1, 3)
  })

  it('refreshes notifications on refresh button click', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const refreshButton = wrapper.find('.refresh-btn')
    expect(refreshButton.exists()).toBe(true)
    await refreshButton.trigger('click')
    await flushPromises()

    // Expect that one call happened on mount and one on refresh.
    expect(getNotification).toHaveBeenCalledTimes(2)
    expect(getNotification).toHaveBeenLastCalledWith(0, 3)
  })

  it('calls deleteNotification and removes the notification', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const deleteButton = wrapper.find('.delete-btn')
    expect(deleteButton.exists()).toBe(true)
    await deleteButton.trigger('click')

    // Verify that deleteNotification is called with the correct ID.
    expect(deleteNotification).toHaveBeenCalledWith(1)
    await flushPromises()

    // Expect no notification item to exist after deletion.
    expect(wrapper.find('.item').exists()).toBe(false)
  })

  it('displays an empty state when there are no notifications', async () => {
    getNotification.mockResolvedValueOnce({
      content: [],
      totalPages: 0,
    })
    const wrapper = mountComponent()
    await flushPromises()
    expect(wrapper.find('.item').exists()).toBe(false)

  })


  it('handles error when fetching notifications', async () => {
    const errorMessage = 'Network Error'
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    getNotification.mockRejectedValueOnce(new Error(errorMessage))
    mountComponent()
    await flushPromises()
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })

  it('handles error when deleting a notification', async () => {
    const errorMessage = 'Deletion failed'
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    deleteNotification.mockRejectedValueOnce(new Error(errorMessage))
    const wrapper = mountComponent()
    await flushPromises()

    const deleteButton = wrapper.find('.delete-btn')
    expect(deleteButton.exists()).toBe(true)
    await deleteButton.trigger('click')
    await flushPromises()

    // Check that an error was logged.
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to delete notification', expect.any(Error))
    // The notification should still be present.
    expect(wrapper.find('.item').exists()).toBe(true)
    consoleErrorSpy.mockRestore()
  })
})
