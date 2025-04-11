import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import {
  deleteAllNotifications,
  deleteNotification,
  getNotification
} from '../../../utils/Notification.ts'

// Mock axios
vi.mock('axios')

describe('Notification', () => {
  const mockBaseURL = 'http://127.0.0.1:8080/notification'
  const mockHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getNotification', () => {
    it('should fetch notifications successfully', async () => {
      // Mock response data
      const mockData = [{ id: 1, message: 'Test notification' }]

      // Setup axios mock
      vi.mocked(axios.get).mockResolvedValueOnce({
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      // Call the function
      const result = await getNotification()

      // Verify axios was called correctly
      expect(axios.get).toHaveBeenCalledWith(`${mockBaseURL}/me`, { headers: mockHeaders })

      // Verify the result
      expect(result).toEqual(mockData)
    })

    it('should handle errors when fetching notifications', async () => {
      // Setup axios mock to reject
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))

      // Mock console.log to prevent actual logging during tests
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      // Call the function
      const result = await getNotification()

      // Verify axios was called
      expect(axios.get).toHaveBeenCalledWith(`${mockBaseURL}/me`, { headers: mockHeaders })

      // Verify the error was logged
      expect(consoleSpy).toHaveBeenCalled()

      // Verify the result is an Error
      expect(result).toBeInstanceOf(Error)
      expect(result.message).toBe('Error! Could not fetch user notification.')

      // Restore console.log
      consoleSpy.mockRestore()
    })
  })

  describe('deleteNotification', () => {
    it('should delete a notification successfully', async () => {
      // Setup axios mock
      vi.mocked(axios.delete).mockResolvedValueOnce({
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const notificationId = 123

      // Call the function
      const result = await deleteNotification(notificationId)

      // Verify axios was called correctly
      expect(axios.delete).toHaveBeenCalledWith(`${mockBaseURL}/${notificationId}`, { headers: mockHeaders })

      // Verify the result
      expect(result).toBe(true)
    })

    it('should handle errors when deleting a notification', async () => {
      // Setup axios mock to reject
      vi.mocked(axios.delete).mockRejectedValueOnce(new Error('Network error'))

      // Mock console.error to prevent actual logging during tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const notificationId = 123

      // Call the function
      const result = await deleteNotification(notificationId)

      // Verify axios was called
      expect(axios.delete).toHaveBeenCalledWith(`${mockBaseURL}/${notificationId}`, { headers: mockHeaders })

      // Verify the error was logged
      expect(consoleSpy).toHaveBeenCalled()

      // Verify the result is an Error
      expect(result).toBeInstanceOf(Error)
      expect(result.message).toBe('Error! Could not delete notification.')

      // Restore console.error
      consoleSpy.mockRestore()
    })
  })

  describe('deleteAllNotifications', () => {
    it('should delete all notifications successfully', async () => {
      // Setup axios mock
      vi.mocked(axios.delete).mockResolvedValueOnce({
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      // Call the function
      const result = await deleteAllNotifications()

      // Verify axios was called correctly
      expect(axios.delete).toHaveBeenCalledWith(`${mockBaseURL}/me`, { headers: mockHeaders })

      // Verify the result
      expect(result).toBe(true)
    })

    it('should handle errors when deleting all notifications', async () => {
      // Setup axios mock to reject
      vi.mocked(axios.delete).mockRejectedValueOnce(new Error('Network error'))

      // Mock console.error to prevent actual logging during tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Call the function
      const result = await deleteAllNotifications()

      // Verify axios was called
      expect(axios.delete).toHaveBeenCalledWith(`${mockBaseURL}/me`, { headers: mockHeaders })

      // Verify the error was logged
      expect(consoleSpy).toHaveBeenCalled()

      // Verify the result is an Error
      expect(result).toBeInstanceOf(Error)
      expect(result.message).toBe('Error! Could not delete all notifications.')

      // Restore console.error
      consoleSpy.mockRestore()
    })
  })
})
