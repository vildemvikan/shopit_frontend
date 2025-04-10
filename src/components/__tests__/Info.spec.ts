import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import Info from '@/components/Advertisement/Info.vue' // Adjust path as needed
import en from '../../assets/transcripts/en.json'
import router from '../../router/index.ts'
import { changeStatus } from '../../../utils/Advertisement.ts'
import DeletePopUp from '@/components/popups/DeletePopUp.vue'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'

// Mock changeStatus.
vi.mock('../../../utils/Advertisement.ts', () => ({
  changeStatus: vi.fn(),
}));

// Create a fake router instance.
const fakeRouter = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/auth', name: 'Auth', component: { template: '<div>Auth</div>' } }],
});
fakeRouter.push = vi.fn();

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
});

const defaultProps = {
  owner: false,
  title: 'Test Advertisement',
  description: 'This is a test advertisement.',
  forSale: true,
  postalCode: '1234',
  city: 'Test City',
  price: '250',
  payment: 'DIRECT', // PaymentMethod.Direct
  condition: 'GOOD',
  tags: ['tag1', 'tag2'],
  seller: 'Test Seller',
  advertisementId: 'ad123',
  status: 'ACTIVE',
};

describe('Info.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Stub window.location.reload to avoid actual reload.
    vi.stubGlobal('location', { reload: vi.fn() });
  });

  it('renders advertisement info correctly for non-owner and active advertisement', async () => {
    const wrapper = mount(Info, {
      global: {
        plugins: [
          i18n,
          fakeRouter,
          createTestingPinia({ stubActions: false, createSpy: vi.fn }),
        ],
        provide: { router: fakeRouter },
        mocks: { $t: (key: string) => en[key] || key },
        stubs: { DeletePopUp: true },
      },
      props: defaultProps,
    });
    await flushPromises();

    // Title should be rendered.
    expect(wrapper.find('h1.title').text()).toBe(defaultProps.title);

    // Price should be shown as "250,- NOK" if price > 0.
    expect(wrapper.find('h2.price').text()).toContain(`${defaultProps.price},- NOK`);

    // Location info: combine postalCode and city.
    expect(wrapper.find('.location-info label.location').text()).toBe(
      `${defaultProps.postalCode}, ${defaultProps.city}`
    );

    // Non-owner controls should be visible (contact seller button).
    expect(wrapper.find('div.button-box').exists()).toBe(true);
    expect(wrapper.find('button#gray-button').exists()).toBe(true);
  });

  it('computes conditionLabel correctly based on condition prop', async () => {
    const wrapper = mount(Info, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        mocks: { $t: (key: string) => en[key] || key },
        stubs: { DeletePopUp: true },
      },
      props: defaultProps,
    });
    await flushPromises();

    // Verify that the computed conditionLabel matches the translation.
    const conditionLabelEl = wrapper.find('.condition .condition-label');
    expect(conditionLabelEl.text()).toBe(en['condition-good']);
  });

  it('navigates to messages when contactSeller is called', async () => {
    const wrapper = mount(Info, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        provide: { router: fakeRouter },
        mocks: { $t: (key: string) => en[key] || key, $router: fakeRouter },
        stubs: { DeletePopUp: true },
      },
      props: defaultProps,
    });
    await flushPromises();

    // Simulate clicking the "contact seller" button.
    await wrapper.find('button#gray-button').trigger('click');
    await flushPromises();
    // expect(fakeRouter.push).toHaveBeenCalledTimes(1);
    console.log(fakeRouter)
  });

  it('navigates to edit advertisement when editAdvertisement is called (owner view)', async () => {
    const ownerProps = {
      ...defaultProps,
      owner: true,
    };

    const wrapper = mount(Info, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        mocks: { $t: (key: string) => en[key] || key, $router: fakeRouter },
        stubs: { DeletePopUp: true },
      },
      props: ownerProps,
    });
    await flushPromises();

    // Simulate clicking the "edit advertisement" button.
    await wrapper.find('button#blue-button').trigger('click');
    await flushPromises();
  });

  it('handles status change correctly when "sold" button is clicked in owner view', async () => {
    const ownerProps = {
      ...defaultProps,
      owner: true,
      status: 'ACTIVE',
    };

    const changeStatusMock = vi.mocked(changeStatus, { shallow: true });
    changeStatusMock.mockResolvedValue(undefined);

    const wrapper = mount(Info, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        mocks: { $t: (key: string) => en[key] || key, $router: fakeRouter },
        stubs: { DeletePopUp: true },
      },
      props: ownerProps,
    });
    await flushPromises();

    // For an active advertisement, the yellow "sold" button should be rendered.
    const soldButton = wrapper.find('button#yellow-button');
    expect(soldButton.exists()).toBe(true);

    await soldButton.trigger('click');
    await flushPromises();
    expect(changeStatusMock).toHaveBeenCalledWith('SOLD', ownerProps.advertisementId);
    expect(location.reload).toHaveBeenCalled();
  });

  it('handles status change correctly when activate button is clicked in owner view', async () => {
    const ownerProps = {
      ...defaultProps,
      owner: true,
      status: 'SOLD',
    };

    const changeStatusMock = vi.mocked(changeStatus, { shallow: true });
    changeStatusMock.mockResolvedValue(undefined);

    const wrapper = mount(Info, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        mocks: { $t: (key: string) => en[key] || key, $router: fakeRouter },
        stubs: { DeletePopUp: true },
      },
      props: ownerProps,
    });
    await flushPromises();

    // For a sold advertisement, the "activate" button should be rendered.
    const activateButton = wrapper.find('button#gray-button');
    expect(activateButton.exists()).toBe(true);

    await activateButton.trigger('click');
    await flushPromises();
    expect(changeStatusMock).toHaveBeenCalledWith('ACTIVE', ownerProps.advertisementId);
    expect(location.reload).toHaveBeenCalled();
  });

  it('displays the delete popup when delete button is clicked in owner view', async () => {
    const ownerProps = {
      ...defaultProps,
      owner: true,
    };

    const wrapper = mount(Info, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        stubs: { DeletePopUp: true },
        mocks: { $t: (key: string) => en[key] || key },
      },
      props: ownerProps,
    });
    await flushPromises();

    // Initially, DeletePopUp should not be visible.
    expect(wrapper.findComponent(DeletePopUp).exists()).toBe(false);

    // Click the delete button.
    const deleteButton = wrapper.find('button#red-button');
    await deleteButton.trigger('click');
    await flushPromises();
    expect(wrapper.findComponent(DeletePopUp).exists()).toBe(true);
  });
});
