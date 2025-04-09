// WebSocket.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Client } from '@stomp/stompjs'
import websocketService from '../../../utils/WebSocket'
import useEventsBus from '../../../utils/EventBus'

// Set up a more detailed mock for the STOMP client
vi.mock('@stomp/stompjs', () => {
  // Create a mock client constructor that captures the config
  const mockActivate = vi.fn()
  const mockDeactivate = vi.fn()
  const mockPublish = vi.fn()
  const mockSubscribe = vi.fn()

  let storedConfig = {}

  const MockClient = vi.fn(config => {
    storedConfig = config
    return {
      activate: mockActivate,
      deactivate: mockDeactivate,
      publish: mockPublish,
      subscribe: mockSubscribe
    }
  })

  // Add method to access the stored config for testing
  MockClient.getConfig = () => storedConfig

  return {
    Client: MockClient
  }
})

// Mock EventBus
vi.mock('../../../utils/EventBus', () => {
  const mockEmit = vi.fn()

  return {
    default: vi.fn(() => ({
      emit: mockEmit,
      bus: { value: new Map() }
    }))
  }
})

describe('WebSocket Service', () => {
  let clientInstance

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the connected state
    websocketService.disconnect()
  })

  describe('connect', () => {
    it('should initialize a STOMP client and activate connection', () => {
      websocketService.connect('user123')

      expect(Client).toHaveBeenCalledTimes(1)
      const mockClient = new Client({})
      expect(mockClient.activate).toHaveBeenCalledTimes(1)
    })

    it('should not connect again if already connected', () => {
      // Connect once
      websocketService.connect('user123')

      // Clear mocks
      vi.clearAllMocks()

      // Try to connect again
      websocketService.connect('user123')

      // Should not create new client or activate
      expect(Client).not.toHaveBeenCalled()
    })

    it('should set up subscription when connected', () => {
      websocketService.connect('user123')

      // Get the config that was passed to Client
      const config = (Client as any).getConfig()
      expect(config.brokerURL).toBe('ws://localhost:8080/ws')

      // Call the onConnect handler manually
      const mockClient = new Client({})
      config.onConnect()

      // Check if subscription was set up
      expect(mockClient.subscribe).toHaveBeenCalledWith(
        '/user/user123/queue/messages',
        expect.any(Function)
      )
    })
  })

  describe('disconnect', () => {
    it('should deactivate the client and reset state', () => {
      // First connect
      websocketService.connect('user123')

      const mockClient = new Client({})
      vi.clearAllMocks() // Clear the activate call

      // Then disconnect
      websocketService.disconnect()

      // Verify client was deactivated
      expect(mockClient.deactivate).toHaveBeenCalledTimes(1)
      expect(websocketService.isConnected()).toBe(false)
    })

    it('should do nothing if not connected', () => {
      // Make sure we're disconnected
      websocketService.disconnect()

      const mockClient = new Client({})
      vi.clearAllMocks()

      // Try to disconnect again
      websocketService.disconnect()

      // Should not try to deactivate
      expect(mockClient.deactivate).not.toHaveBeenCalled()
    })
  })

  describe('sendMessage', () => {
    it('should publish message to STOMP client and emit event', () => {
      // Connect first
      websocketService.connect('user123')

      // Get config and manually trigger connect to set connected state
      const config = (Client as any).getConfig()
      config.onConnect()

      const mockClient = new Client({})
      vi.clearAllMocks() // Clear previous calls

      // Send a message
      const result = websocketService.sendMessage(
        'sender@example.com',
        'recipient@example.com',
        1,
        'Hello world'
      )

      // Verify publish was called with correct params
      expect(mockClient.publish).toHaveBeenCalledWith({
        destination: '/app/chat',
        body: JSON.stringify({
          senderId: 'sender@example.com',
          recipientId: 'recipient@example.com',
          itemId: 1,
          content: 'Hello world'
        })
      })

      // Verify event was emitted
      expect(useEventsBus().emit).toHaveBeenCalledWith('messageSent')

      // Verify function returned true
      expect(result).toBe(true)
    })

    it('should not send empty messages', () => {
      // Connect
      websocketService.connect('user123')

      // Get config and manually trigger connect
      const config = (Client as any).getConfig()
      config.onConnect()

      const mockClient = new Client({})
      vi.clearAllMocks()

      // Try to send empty message
      const result = websocketService.sendMessage(
        'sender@example.com',
        'recipient@example.com',
        1,
        ''
      )

      // Verify publish was not called
      expect(mockClient.publish).not.toHaveBeenCalled()

      // Verify function returned false
      expect(result).toBe(false)
    })
  })

  describe('message subscription handling', () => {
    it('should emit event when message is received', () => {
      websocketService.connect('user123')

      // Get the config that was passed to Client
      const config = (Client as any).getConfig()
      const mockClient = new Client({})

      // Call onConnect to set up subscription
      config.onConnect()

      // Get the callback from the subscribe call
      const subscribeCallback = vi.mocked(mockClient.subscribe).mock.calls[0][1]

      // Simulate receiving a message
      const mockMessage = { body: JSON.stringify({ content: 'Hello' }) }
      subscribeCallback(mockMessage)

      // Verify event was emitted with the message
      expect(useEventsBus().emit).toHaveBeenCalledWith('messageReceived', mockMessage)
    })
  })
})
