import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue' // Adjust the path if needed
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { setActivePinia, createPinia } from 'pinia'
import { displayStore } from '@/stores/displayStore'

// Mock the vue-router
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    RouterView: {
      name: 'RouterView',
      setup: () => {},
      render: () => {},
    }
  }
})

// Mock components
vi.mock('@/components/Navbar.vue', () => ({
  default: {
    name: 'Navbar',
    render: () => {},
  }
}))

vi.mock('@/components/Footer.vue', () => ({
  default: {
    name: 'Footer',
    render: () => {},
  }
}))

describe('App.vue', () => {
  let store
  let router
  let i18n

  beforeEach(() => {
    // Setup Pinia
    setActivePinia(createPinia())
    store = displayStore()

    // Reset document classes
    document.documentElement.className = ''

    // Create router
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
    })

    // Create i18n
    i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {},
        fr: {}
      }
    })
  })

  it('renders the component correctly', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router, i18n],
        stubs: {
          Navbar: true,
          RouterView: true,
          Footer: true
        }
      }
    })

    await flushPromises()

    expect(wrapper.find('.header').exists()).toBe(true)
    expect(wrapper.find('.view').exists()).toBe(true)
    expect(wrapper.find('.footer').exists()).toBe(true)
    expect(wrapper.findComponent(Navbar).exists()).toBe(true)
    expect(wrapper.findComponent(Footer).exists()).toBe(true)
  })

  it('applies stored language on mount', async () => {
    // Set store values before mounting
    store.language = 'fr'

    const wrapper = mount(App, {
      global: {
        plugins: [router, i18n],
        stubs: {
          Navbar: true,
          RouterView: true,
          Footer: true
        }
      }
    })

    await flushPromises()

    // Verify i18n locale was updated
    expect(i18n.global.locale.value).toBe('fr')
  })

  it('applies stored dark/light mode on mount', async () => {
    // Set store values before mounting
    store.mode = 'dark'

    const wrapper = mount(App, {
      global: {
        plugins: [router, i18n],
        stubs: {
          Navbar: true,
          RouterView: true,
          Footer: true
        }
      }
    })

    await flushPromises()

    // Verify class was added to document
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('does not change language when no language is stored', async () => {
    // Ensure store has no language
    store.language = null
    // Set initial i18n locale
    i18n.global.locale.value = 'en'

    const wrapper = mount(App, {
      global: {
        plugins: [router, i18n],
        stubs: {
          Navbar: true,
          RouterView: true,
          Footer: true
        }
      }
    })

    await flushPromises()

    // Verify i18n locale was not changed
    expect(i18n.global.locale.value).toBe('en')
  })

  it('does not add mode class when no mode is stored', async () => {
    // Ensure store has no mode
    store.mode = null

    const wrapper = mount(App, {
      global: {
        plugins: [router, i18n],
        stubs: {
          Navbar: true,
          RouterView: true,
          Footer: true
        }
      }
    })

    await flushPromises()

    // Verify no class was added
    expect(document.documentElement.classList.length).toBe(0)
  })
})
