import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AdvertisementPreviewBox from '@/components/AdvertisementPreviewBox.vue'
import { createBookmark, deleteBookmark } from '../../../../utils/Bookmark'
import { nextTick } from 'vue'

const pushMock = vi.fn()
vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      push: pushMock,
    }),
  }
})

// Mock i18n
const mockLocale = { value: 'en' }
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: mockLocale,
  }),
}))

// Mock bookmark utils
vi.mock('@/utils/Bookmark', () => ({
  createBookmark: vi.fn(),
  deleteBookmark: vi.fn(),
}))

describe('AdvertisementPreviewBox', () => {
  const baseProps = {
    id: 123,
    title: 'Sample Ad',
    price: 1500,
    status: 'active',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    image: '/some/image.jpg',
    city: 'Bergen',
    isBookmarked: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockLocale.value = 'en'
  })

  it('renders props correctly', () => {
    const wrapper = mount(AdvertisementPreviewBox, {
      props: baseProps,
    })

    expect(wrapper.text()).toContain('Sample Ad')
    expect(wrapper.text()).toContain('Bergen')
    expect(wrapper.text()).toContain('1500,- NOKBergen2 hours agoSample Ad')
    const img = wrapper.find('img.display-image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/some/image.jpg')
  })

  it('shows not-bookmarked icon initially', () => {
    const wrapper = mount(AdvertisementPreviewBox, {
      props: baseProps,
    })
    const icon = wrapper.find('img[alt="bookmark"]')
    expect(icon.attributes('src')).toContain('bookmarkNotMarked')
  })

  it('formats time ago with correct locale (nb)', async () => {
    mockLocale.value = 'no' // triggers remapping to nb
    const wrapper = mount(AdvertisementPreviewBox, {
      props: baseProps,
    })

    expect(wrapper.text().toLowerCase()).toContain('1500,- nokbergen2 timer sidensample ad') // crude check
  })
})
