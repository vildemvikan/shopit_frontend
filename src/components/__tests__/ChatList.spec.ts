import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick, reactive, ref } from 'vue'
import { createTestingPinia } from '@pinia/testing'
import useEventsBus from '../../../utils/EventBus'
import ChatList from '@/components/Messages/ChatList.vue'
import { fetchChatList } from '../../../utils/Messages'
import webSocket from '../../../utils/WebSocket'
import ChatCard from '@/components/Messages/ChatCard.vue'
import { useTokenStore } from '@/stores/tokenStore'

// Mock components
vi.mock('@/components/Messages/ChatCard.vue', () => ({
  default: {
    name: 'ChatCard',
    props: ['chatCardData'],
    template: '<div class="mock-chat-card">{{ chatCardData.recipientId }}</div>'
  }
}))

// Use vi.hoisted for data needed by mocks
const mockEventBusData = vi.hoisted(() => ({
  selectChat: null,
  messageReceived: null,
  messageSent: null
}))

// Mock the EventBus
vi.mock('../../../utils/EventBus', () => {
  return {
    default: vi.fn(() => {
      const busMap = reactive(new Map())

      return {
        bus: ref(busMap),
        emit: vi.fn((event, ...args) => {
          busMap.set(event, args)
          mockEventBusData[event] = args
        })
      }
    })
  }
})

// Mock the WebSocket service
vi.mock('../../../utils/WebSocket', () => ({
  default: {
    connect: vi.fn(),
    isConnected: vi.fn().mockReturnValue(false),
    sendMessage: vi.fn()
  }
}))

// Mock fetch function
vi.mock('../../../utils/Messages', () => ({
  fetchChatList: vi.fn().mockResolvedValue([
    {
      senderId: 'user@example.com',
      recipientId: 'recipient1@example.com',
      itemId: 1,
      lastMessage: 'Hello there',
      lastMessageTimestamp: '2023-01-01T10:00:00',
      hasUnreadMessage: false
    },
    {
      senderId: 'user@example.com',
      recipientId: 'recipient2@example.com',
      itemId: 2,
      lastMessage: 'How are you?',
      lastMessageTimestamp: '2023-01-02T10:00:00',
      hasUnreadMessage: true
    }
  ])
}))

// Mock element functions
vi.stubGlobal('document', {
  ...document,
  getElementById: vi.fn().mockImplementation((id) => ({
    classList: {
      add: vi.fn(),
      remove: vi.fn()
    }
  })),
  querySelectorAll: vi.fn().mockImplementation(() => [{
    classList: {
      remove: vi.fn()
    }
  }])
})

// Mock matchMedia
vi.stubGlobal('window', {
  ...window,
  matchMedia: vi.fn().mockImplementation((query) => ({
    matches: false, // Set to true to test mobile view
    media: query
  }))
})

describe('ChatList', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Reset event bus data
    Object.keys(mockEventBusData).forEach(key => {
      mockEventBusData[key] = null
    })
  })

  it('should render the component correctly', async () => {
    const wrapper = mount(ChatList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              tokenStore: {
                token: 'test-token',
                email: 'user@example.com'
              }
            }
          })
        ],
        stubs: {
          ChatCard: true
        }
      }
    })

    // Wait for component to load data
    await flushPromises()

    expect(wrapper.find('.message-cards').exists()).toBe(true)

    // Check for chat items rendered
    const chatItems = wrapper.findAll('.chat-list-box')
    expect(chatItems.length).toBe(2) // Based on our mock data
  })

  it('should connect to WebSocket on mount if user is authenticated', async () => {
    const wrapper = mount(ChatList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              tokenStore: {
                token: 'test-token',
                email: 'user@example.com'
              }
            }
          })
        ],
        stubs: {
          ChatCard: true
        }
      }
    })

    await flushPromises()

    // Check that WebSocket connection was attempted
    expect(webSocket.connect).toHaveBeenCalledWith('user@example.com')
    expect(fetchChatList).toHaveBeenCalled()
  })

  it('should select first chat automatically on desktop', async () => {
    // Mock window.matchMedia to return desktop view
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false
    }))

    const wrapper = mount(ChatList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              tokenStore: {
                token: 'test-token',
                email: 'user@example.com'
              }
            }
          })
        ],
        stubs: {
          ChatCard: true
        }
      }
    })

    await flushPromises()

    // Wait for the setTimeout in onMounted
    await new Promise(resolve => setTimeout(resolve, 150))

    // Check that EventBus emit was called with selectChat
    const eventBus = useEventsBus()
    expect(eventBus.emit).toHaveBeenCalledWith('selectChat', {
      senderMail: 'user@example.com',
      recipientMail: 'recipient1@example.com',
      itemId: 1
    })
  })

  it('should select a chat when clicked', async () => {
    const wrapper = mount(ChatList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              tokenStore: {
                token: 'test-token',
                email: 'user@example.com'
              }
            }
          })
        ],
        stubs: {
          ChatCard: true
        }
      }
    })

    await flushPromises()

    // Find a chat item and click it
    const chatItem = wrapper.find('.chat-list-box')
    await chatItem.trigger('click')

    // Check document.getElementById was called
    expect(document.getElementById).toHaveBeenCalled()

    // Check that EventBus emit was called with selectChat
    const eventBus = useEventsBus()
    expect(eventBus.emit).toHaveBeenCalledWith('selectChat', expect.any(Object))
  })

  it('should update chat list when a message is sent', async () => {
    const wrapper = mount(ChatList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              tokenStore: {
                token: 'test-token',
                email: 'user@example.com'
              }
            }
          })
        ],
        stubs: {
          ChatCard: true
        }
      }
    })

    await flushPromises()

    // Reset the mock call count
    vi.mocked(fetchChatList).mockClear()

    // Simulate a message sent event
    const { bus } = useEventsBus()
    bus.value.set('messageSent', [true])

    // Wait for the setTimeout in the watch handler
    await new Promise(resolve => setTimeout(resolve, 150))

    // Check that chat list was refreshed
    expect(fetchChatList).toHaveBeenCalled()
  })
})
