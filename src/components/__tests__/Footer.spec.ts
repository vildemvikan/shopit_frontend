// Footer.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from '@/components/Footer.vue'

// Mock displayStore
vi.mock('@/stores/displayStore.ts', () => {
  return {
    displayStore: () => ({
      updateMode: vi.fn(),
      updateLanguage: vi.fn()
    })
  }
})

// Mock i18n
const mockLocale = { value: 'en' }
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: mockLocale
  })
}))

describe('Footer.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(Footer)
  })

  it('should render and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('toggles to dark mode on dark icon click', async () => {
    const darkIcon = wrapper.find('#dark-mode .icon')
    await darkIcon.trigger('click')
    expect(document.documentElement.classList.contains('manual-dark')).toBe(true)
  })

  it('toggles to light mode on light icon click', async () => {
    const lightIcon = wrapper.find('#light .icon')
    await lightIcon.trigger('click')
    expect(document.documentElement.classList.contains('manual-light')).toBe(false)
  })
})
