import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createApp } from 'vue'
import App from '@/App.vue'

// Mock all the imports and dependencies
vi.mock('vue', () => ({
  createApp: vi.fn(() => ({
    use: vi.fn().mockReturnThis(),
    mount: vi.fn(),
  })),
}))

vi.mock('pinia', () => ({
  createPinia: vi.fn(() => ({
    use: vi.fn(),
  })),
}))

vi.mock('pinia-plugin-persistedstate', () => ({
  default: vi.fn(),
}))

vi.mock('vue-i18n', () => ({
  createI18n: vi.fn(() => ({})),
}))

vi.mock('vue-toastification', () => ({
  default: vi.fn(),
}))

// Add default export to router mock
vi.mock('@/router', () => {
  return {
    default: {
      // Mock router properties if needed
      routerMockProperty: 'mock-value',
    },
  }
})

vi.mock('@/App.vue', () => ({
  default: {},
}))

vi.mock('@/stores/tokenStore', () => ({
  useTokenStore: vi.fn(() => ({
    initializeTimer: vi.fn(),
  })),
}))

// Mock the CSS imports
vi.mock('./assets/main.css', () => ({}))
vi.mock('vue-toastification/dist/index.css', () => ({}))

// Mock the JSON imports
vi.mock('./assets/transcripts/en.json', () => ({
  default: { hello: 'Hello' },
}))

vi.mock('./assets/transcripts/no.json', () => ({
  default: { hello: 'Hallo' },
}))

describe('main.ts', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it('creates a Vue app with App component', async () => {
    // Import the main file to trigger the code execution
    await import('@/main')

    // Verify createApp was called with App component
    expect(createApp).toHaveBeenCalledWith(App)
  })
})
