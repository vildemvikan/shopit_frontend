import { vi } from 'vitest'
vi.mock('../../../utils/Advertisement.ts', () => ({
  createAdvertisement: vi.fn(),
  updateAdvertisement: vi.fn(),
}))

import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import Schema from '../Schema.vue'
import en from '../../assets/transcripts/en.json'
import { createTestingPinia } from '@pinia/testing'
import { useAdvertisementStore } from '@/stores/advertisementStore'
import { createAdvertisement, updateAdvertisement } from '../../../utils/Advertisement.ts'
// Mock router as needed (example provided earlier)

vi.mock('@/router', () => {
  const { createRouter, createMemoryHistory } = require('vue-router')

  const mockedRouter = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/profile', name: 'Profile', component: { template: '<div>Profile</div>' } },
      {
        path: '/advertisement/:id',
        name: 'Advertisement',
        component: { template: '<div>Ad</div>' },
      },
      { path: '/auth', name: 'Auth', component: { template: '<div>Auth</div>' } },
    ],
  })

  mockedRouter.push = vi.fn()

  return {
    default: mockedRouter, // required for `import router from '@/router'`
  }
})
import router from '@/router' // this will be the mocked router
import { createRouter, createMemoryHistory } from 'vue-router'

// Create i18n instance.
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
})

// Stub child components.
const stubs = {
  SectionA: true,
  SectionB: true,
  SectionC: true,
  SectionD: true,
}
const dummyAd = {
  name: 'Ad Title from Props',
  description: 'Ad description from props',
  condition: 'GOOD',
  categoryId: 5,
  subCategoryId: 12,
  tags: ['tagA', 'tagB'],
  images: [{ url: 'http://example.com/ad1.jpg', caption: 'Ad Image 1', publicId: null }],
  forSale: false,
  listingType: 'CONTACT', // PaymentMethod.None
  price: 0,
  location: { postalCode: '5678', city: 'Prop City' },
}
Object.defineProperty(window, 'location', {
  value: {
    ...window.location,
    reload: vi.fn(),
  },
  writable: true,
})
describe('Schema.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes internal state from the advertisement store when new is true (manual store override)', async () => {
    // Create a TestingPinia instance.
    const pinia = createTestingPinia({ stubActions: false, createSpy: vi.fn })

    // Retrieve your advertisement store from this pinia.
    const advertisementStore = useAdvertisementStore(pinia)

    // Manually set the store values.
    advertisementStore.title = 'Store Title'
    advertisementStore.description = 'Store Description'
    advertisementStore.condition = 'NEW'
    advertisementStore.category = 3
    advertisementStore.subCategory = 8
    advertisementStore.tags = ['storeTag1']
    advertisementStore.images = [
      { url: 'http://example.com/store.jpg', caption: 'Store image', publicId: null },
    ]
    advertisementStore.forSale = true
    advertisementStore.payment = 'DIRECT'
    advertisementStore.price = 1000
    advertisementStore.postalNumber = '4321'

    // Mount the Schema component with the same pinia instance.
    const wrapper = mount(Schema, {
      global: {
        plugins: [i18n, pinia],
        stubs,
        mocks: { $t: (key: string) => en[key] || key },
      },
      props: {
        new: true,
        preview: false,
        id: null,
        advertisement: null,
      },
    })
    await flushPromises()

    const vm: any = wrapper.vm
    // Now your component's reactive variables should reflect the values you manually set.
    expect(vm.title).toBe('Store Title')
    expect(vm.description).toBe('Store Description')
    expect(vm.condition).toBe('NEW')
    expect(vm.category).toBe(3)
    expect(vm.subCategory).toBe(8)
    expect(vm.tags).toEqual(['storeTag1'])
    expect(vm.images).toEqual([
      { url: 'http://example.com/store.jpg', caption: 'Store image', publicId: null },
    ])
    expect(vm.forSale).toBe(true)
    expect(vm.payment).toBe('DIRECT')
    expect(vm.price).toBe(1000)
    expect(vm.postalNumber).toBe('4321')
  })

  it('initializes internal state from props.advertisement when new is false', async () => {
    const wrapper = mount(Schema, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        stubs,
        mocks: { $t: (key: string) => en[key] || key },
      },
      props: {
        new: false,
        preview: false,
        id: 'ad123',
        advertisement: dummyAd,
      },
    })
    await flushPromises()
    const vm: any = wrapper.vm
    expect(vm.title).toBe(dummyAd.name)
    expect(vm.description).toBe(dummyAd.description)
    expect(vm.condition).toBe(dummyAd.condition)
    expect(vm.category).toBe(dummyAd.categoryId)
    expect(vm.subCategory).toBe(dummyAd.subCategoryId)
    expect(vm.tags).toEqual(dummyAd.tags)
    expect(vm.images).toEqual(dummyAd.images)
    expect(vm.forSale).toBe(dummyAd.forSale)
    expect(vm.payment).toBe(dummyAd.listingType)
    expect(vm.price).toBe(dummyAd.price)
    expect(vm.postalNumber).toBe(dummyAd.location.postalCode)
  })

  it('builds JSON body correctly', async () => {
    const pinia = createTestingPinia({ stubActions: false, createSpy: vi.fn })
    // Retrieve your advertisement store from this pinia.
    const advertisementStore = useAdvertisementStore(pinia)

    // Manually set the store values.
    advertisementStore.title = 'Store Title'
    advertisementStore.description = 'Store Description'
    advertisementStore.condition = 'NEW'
    advertisementStore.category = 3
    advertisementStore.subCategory = 8
    advertisementStore.tags = ['storeTag1']
    advertisementStore.images = [
      { url: 'http://example.com/store.jpg', caption: 'Store image', publicId: null },
    ]
    advertisementStore.forSale = true
    advertisementStore.payment = 'DIRECT'
    advertisementStore.price = 1000
    advertisementStore.postalNumber = '4321'

    const wrapper = mount(Schema, {
      global: {
        plugins: [i18n, pinia],
        stubs,
        mocks: { $t: (key: string) => en[key] || key },
      },
      props: { new: true, preview: false, id: null, advertisement: null },
    })
    await flushPromises()
    const vm: any = wrapper.vm
    const jsonString = vm.buildJSONBody('ACTIVE')
    const body = JSON.parse(jsonString)
    expect(body.itemName).toBe(advertisementStore.title)
    expect(body.description).toBe(advertisementStore.description)
    expect(body.price).toBe(advertisementStore.price)
    expect(body.tags).toEqual(advertisementStore.tags)
    expect(body.postalCode).toBe(advertisementStore.postalNumber)
    expect(body.subcategoryId).toBe(advertisementStore.subCategory)
    expect(body.listingType).toBe(advertisementStore.payment)
    expect(body.condition).toBe(advertisementStore.condition)
    expect(body.status).toBe('ACTIVE')
    expect(body.forSale).toBe(advertisementStore.forSale)
    expect(body.images).toEqual(advertisementStore.images)
  })

  it('calls createAdvertisement and navigates to profile when saving draft if valid', async () => {
    // 1. Mock the external service
    const createAdvertisementMock = vi.mocked(createAdvertisement)
    createAdvertisementMock.mockResolvedValue(200)

    // 2. Create a testing Pinia instance and get the actual store
    const pinia = createTestingPinia({ stubActions: false, createSpy: vi.fn })
    const advertisementStore = useAdvertisementStore(pinia)

    // 3. Set store values
    advertisementStore.title = 'Valid Title'
    advertisementStore.description = 'Valid Description'
    advertisementStore.condition = 'GOOD'
    advertisementStore.category = 5
    advertisementStore.subCategory = 10
    advertisementStore.tags = ['tag1']
    advertisementStore.images = [
      { url: 'http://example.com/img.jpg', caption: 'Caption', publicId: null },
    ]
    advertisementStore.forSale = true
    advertisementStore.payment = 'DIRECT'
    advertisementStore.price = 100
    advertisementStore.postalNumber = '9999'

    // 4. Mount with same Pinia instance
    const wrapper = mount(Schema, {
      global: {
        plugins: [i18n, pinia],
        stubs,
        mocks: { $t: (key: string) => en[key] || key, $router: router },
        provide: { router },
      },
      props: { new: true, preview: false, id: null, advertisement: null },
    })

    await flushPromises()

    // 5. Call saveDraft
    await (wrapper.vm as any).saveDraft()
    await flushPromises()

    // 6. Assert
    expect(createAdvertisementMock).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith('profile')
  })

  it('calls updateAdvertisement and navigates to advertisement page when commitChanges if valid', async () => {
    const updateAdvertisementMock = vi.mocked(updateAdvertisement, { shallow: true })
    updateAdvertisementMock.mockResolvedValue(200)

    const adId = 'ad123'
    const wrapper = mount(Schema, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        stubs,
        mocks: { $t: (key: string) => en[key] || key, $router: router },
        provide: { router: router },
      },
      props: { new: false, preview: false, id: adId, advertisement: dummyAd },
    })
    await flushPromises()

    await (wrapper.vm as any).commitChanges()
    await flushPromises()
    expect(updateAdvertisementMock).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith(`/advertisement/${adId}`)
  })

  it('calls discardChanges and reloads the page', async () => {
    const wrapper = mount(Schema, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        stubs,
        mocks: { $t: (key: string) => en[key] || key },
      },
      props: { new: true, preview: false, id: null, advertisement: null },
    })
    await flushPromises()
    ;(wrapper.vm as any).discardChanges()
    await flushPromises()
    expect(location.reload).toHaveBeenCalled()
  })
  it('updateX functions update values and sync with store when new is true', async () => {
    const pinia = createTestingPinia({ stubActions: false, createSpy: vi.fn })
    const store = useAdvertisementStore(pinia)
    const wrapper = mount(Schema, {
      global: { plugins: [i18n, pinia], stubs },
      props: { new: true, preview: false, id: null, advertisement: null },
    })
    await flushPromises()
    const vm: any = wrapper.vm

    // updateTitle
    vm.updateTitle('New Title')
    expect(vm.title).toBe('New Title')
    expect(store.updateTitle).toHaveBeenCalledWith('New Title')

    // updateDescription
    vm.updateDescription('New Description')
    expect(vm.description).toBe('New Description')
    expect(store.updateDescription).toHaveBeenCalledWith('New Description')

    // updateCondition
    vm.updateCondition('USED')
    expect(vm.condition).toBe('USED')
    expect(store.updateCondition).toHaveBeenCalledWith('USED')

    // updateCategory
    vm.updateCategory(10)
    expect(vm.category).toBe(10)
    expect(store.updateCategory).toHaveBeenCalledWith(10)

    // updateSubCategory
    vm.updateSubCategory(20)
    expect(vm.subCategory).toBe(20)
    expect(store.updateSubCategory).toHaveBeenCalledWith(20)

    // updateTags
    vm.updateTags(['tag1', 'tag2'])
    expect(vm.tags).toEqual(['tag1', 'tag2'])
    expect(store.updateTags).toHaveBeenCalledWith(['tag1', 'tag2'])

    // updateForSale
    vm.updateForSale(false)
    expect(vm.forSale).toBe(false)
    expect(vm.price).toBe(0)
    expect(vm.payment).toBe('CONTACT')
    expect(store.updateForSale).toHaveBeenCalledWith(false)

    // updatePrice
    vm.updateForSale(true) // Enable forSale again to test price
    vm.updatePrice(500)
    expect(vm.price).toBe(500)
    expect(store.updatePrice).toHaveBeenCalledWith(500)

    // updatePayment
    vm.updatePayment('DIRECT')
    expect(vm.payment).toBe('DIRECT')
    expect(store.updatePayment).toHaveBeenCalledWith('DIRECT')

    // updatePostalNumber
    vm.updatePostalNumber('1234')
    expect(vm.postalNumber).toBe('1234')
    expect(store.updatePostalNumber).toHaveBeenCalledWith('1234')

    // updateImages
    const newImages = [{ url: 'http://img.jpg', caption: 'Test', publicId: null }]
    vm.updateImages(newImages)
    expect(vm.images).toEqual(newImages)
    expect(store.updateImages).toHaveBeenCalledWith(newImages)
  })
})
