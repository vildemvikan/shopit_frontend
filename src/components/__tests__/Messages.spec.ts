import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { fetchChatMessages, fetchProfileInfo, fetchChatList } from '../../../utils/Messages'

vi.mock('axios')

vi.mock('@/stores/tokenStore', () => ({
  useTokenStore: vi.fn(() => ({
    getToken: 'mock-token'
  }))
}))

describe('Messages API functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchChatMessages', () => {
    it('should return empty array on error', async () => {
      // Mock axios.get to throw error
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))

      // Mock console.error to prevent error output during tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await fetchChatMessages('user2', 1)

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching chat messages: ',
        expect.any(Error)
      )

      // Verify empty array is returned
      expect(result).toEqual([])
    })
  })

  describe('fetchProfileInfo', () => {
    it('should fetch profile info successfully', async () => {
      const mockProfile = { fullName: 'John Doe', url: 'profile.jpg' }

      // Mock axios.get to return successful response
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockProfile })

      const result = await fetchProfileInfo('john@example.com')

      // Verify axios was called with correct params
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:8080/chat/recipient/john@example.com',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }
        }
      )

      // Verify result
      expect(result).toEqual(mockProfile)
    })

    it('should return null on error', async () => {
      // Mock axios.get to throw error
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))

      // Mock console.error to prevent error output during tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await fetchProfileInfo('john@example.com')

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching chat recipient profile: ',
        expect.any(Error)
      )

      // Verify null is returned
      expect(result).toBeNull()
    })
  })

  describe('fetchChatList', () => {
    it('should return null on error', async () => {
      // Mock axios.get to throw error
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))

      // Mock console.error to prevent error output during tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await fetchChatList()

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching chat list: ',
        expect.any(Error)
      )

      // Verify null is returned
      expect(result).toBeNull()
    })
  })
})
