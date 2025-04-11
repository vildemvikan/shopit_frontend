import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTokenStore } from '@/stores/tokenStore'
import { getToken } from '../../../utils/Authentication'
import router from '@/router'

// Mock the imported functions and router
vi.mock('@/utils/Authentication', () => ({
  getToken: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
  registerUser: vi.fn()
}))

vi.mock('@/router', () => ({
  default: {
    push: vi.fn()
  }
}))

describe('tokenStore', () => {
  beforeEach(() => {
    // Create a fresh pinia and activate it for each test
    setActivePinia(createPinia())

    // Reset mocks
    vi.clearAllMocks()

    // Mock the console methods to avoid cluttering test output
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})

    // Mock Date.now() to return a fixed timestamp for predictable testing
    vi.spyOn(Date, 'now').mockReturnValue(1000000000000)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('startRefreshTimer', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should clear existing timer before setting a new one', () => {
      // Arrange
      const store = useTokenStore()
      store.tokenTimer = setTimeout(() => {}, 1000) as any
      const originalTimer = store.tokenTimer
      vi.spyOn(global, 'clearTimeout')

      // Act
      store.startRefreshTimer()

      // Assert
      expect(clearTimeout).toHaveBeenCalledWith(originalTimer)
    })
  })

  describe('emptyTokenStore', () => {
    it('should clear token data and redirect to home', async () => {
      // Arrange
      const store = useTokenStore()
      store.jwtToken = 'some-token'
      store.email = 'user@example.com'

      // Act
      await store.emptyTokenStore()

      // Assert
      expect(store.jwtToken).toBeNull()
      expect(store.email).toBeNull()
      expect(router.push).toHaveBeenCalledWith('/')
    })
  })

  describe('isAccessTokenExpired', () => {
    it('should return true when token is expired', () => {
      // Arrange
      const store = useTokenStore()
      store.accessTokenExpiresAt = Date.now() - 1000 // Expired 1 second ago

      // Act & Assert
      expect(store.isAccessTokenExpired()).toBe(true)
    })

    it('should return false when token is not expired', () => {
      // Arrange
      const store = useTokenStore()
      store.accessTokenExpiresAt = Date.now() + 1000 // Expires in 1 second

      // Act & Assert
      expect(store.isAccessTokenExpired()).toBe(false)
    })
  })

  describe('initializeTimer', () => {
    it('should start refresh timer when token exists and is not expired', async () => {
      // Arrange
      const store = useTokenStore()
      store.jwtToken = 'valid-token'
      store.accessTokenExpiresAt = Date.now() + 60000 // Not expired

      vi.spyOn(store, 'isAccessTokenExpired').mockReturnValueOnce(false)
      vi.spyOn(store, 'startRefreshTimer').mockImplementation(() => {})
      vi.spyOn(store, 'refreshAccessToken')

      // Act
      await store.initializeTimer()

      // Assert
      expect(store.startRefreshTimer).toHaveBeenCalled()
      expect(store.refreshAccessToken).not.toHaveBeenCalled()
    })

    it('should refresh token when token exists but is expired', async () => {
      // Arrange
      const store = useTokenStore()
      store.jwtToken = 'expired-token'
      store.accessTokenExpiresAt = Date.now() - 1000 // Expired

      vi.spyOn(store, 'isAccessTokenExpired').mockReturnValueOnce(true)
      vi.spyOn(store, 'startRefreshTimer')
      vi.spyOn(store, 'refreshAccessToken').mockResolvedValueOnce()

      // Act
      await store.initializeTimer()

      // Assert
      expect(store.refreshAccessToken).toHaveBeenCalled()
      expect(store.startRefreshTimer).not.toHaveBeenCalled() // This will be called inside refreshAccessToken
    })

    it('should do nothing when no token exists', async () => {
      // Arrange
      const store = useTokenStore()
      store.jwtToken = null

      vi.spyOn(store, 'startRefreshTimer')
      vi.spyOn(store, 'refreshAccessToken')

      // Act
      await store.initializeTimer()

      // Assert
      expect(store.startRefreshTimer).not.toHaveBeenCalled()
      expect(store.refreshAccessToken).not.toHaveBeenCalled()
    })
  })

  describe('getters', () => {
    describe('isAuthenticated', () => {
      it('should return true when token exists and is not expired', () => {
        // Arrange
        const store = useTokenStore()
        store.jwtToken = 'valid-token'
        store.accessTokenExpiresAt = Date.now() + 1000 // Not expired

        // Act & Assert
        expect(store.isAuthenticated).toBe(true)
      })

      it('should return false when token does not exist', () => {
        // Arrange
        const store = useTokenStore()
        store.jwtToken = null
        store.accessTokenExpiresAt = Date.now() + 1000

        // Act & Assert
        expect(store.isAuthenticated).toBe(false)
      })

      it('should return false when token is expired', () => {
        // Arrange
        const store = useTokenStore()
        store.jwtToken = 'expired-token'
        store.accessTokenExpiresAt = Date.now() - 1000 // Expired

        // Act & Assert
        expect(store.isAuthenticated).toBe(false)
      })
    })

    describe('getToken', () => {
      it('should return the current token', () => {
        // Arrange
        const store = useTokenStore()
        const mockToken = 'current-token'
        store.jwtToken = mockToken

        // Act & Assert
        expect(store.getToken).toBe(mockToken)
      })
    })

    describe('getEmail', () => {
      it('should return the current email', () => {
        // Arrange
        const store = useTokenStore()
        const mockEmail = 'user@example.com'
        store.email = mockEmail

        // Act & Assert
        expect(store.getEmail).toBe(mockEmail)
      })
    })
  })
})
