import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import ImageCarousel from '../Advertisement/ImageCarousel.vue' // Adjust path if needed
import en from '../../assets/transcripts/en.json'
import { createBookmark, deleteBookmark } from '../../../utils/Bookmark.ts'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'

// Mock the Bookmark utilities.
vi.mock('../../../utils/Bookmark.ts', () => {
  return {
    createBookmark: vi.fn(),
    deleteBookmark: vi.fn(),
  }
});

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

const images = [
  { url: 'http://example.com/1.jpg', caption: 'Caption 1', publicId: null },
  { url: 'http://example.com/2.jpg', caption: 'Caption 2', publicId: null },
  { url: 'http://example.com/3.jpg', caption: '', publicId: null },
];

describe('ImageCarousel.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.images = images;
  });

  it('renders thumbnails and updates selected index when a thumbnail is clicked', async () => {
    const wrapper = mount(ImageCarousel, {
      global: {
        plugins: [i18n, fakeRouter, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        provide: { router: fakeRouter },
        stubs: { RouterLink: true },
        mocks: { $t: (key: string) => en[key] || key },
      },
      props: {
        id: 'item1',
        images: images,
        status: 'ACTIVE', // Assume ACTIVE means no overlay.
        isOwner: false,
        isBookmarked: false,
      },
    });
    await flushPromises();

    const thumbnailImages = wrapper.findAll('.images img');
    expect(thumbnailImages.length).toBe(images.length);

    expect(thumbnailImages[0].classes()).toContain('selected');

    // Click the third thumbnail.
    await thumbnailImages[2].trigger('click');
    await flushPromises();

    // Now the third thumbnail should have the selected class.
    const updatedThumbnails = wrapper.findAll('.images img');
    expect(updatedThumbnails[2].classes()).toContain('selected');
  });

  it('navigates images using previousImage() and nextImage() methods', async () => {
    const wrapper = mount(ImageCarousel, {
      global: {
        plugins: [i18n, fakeRouter, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        provide: { router: fakeRouter },
        mocks: { $t: (key: string) => en[key] || key },
      },
      props: {
        id: 'item1',
        images: images,
        status: 'ACTIVE',
        isOwner: false,
        isBookmarked: false,
      },
    });
    await flushPromises();

    // Test nextImage functionality.
    await (wrapper.vm as any).nextImage();
    await flushPromises();
    expect((wrapper.vm as any).selectedIndex).toBe(1);

    await (wrapper.vm as any).nextImage();
    await flushPromises();
    expect((wrapper.vm as any).selectedIndex).toBe(2);

    // Wrap-around: nextImage on last image.
    await (wrapper.vm as any).nextImage();
    await flushPromises();
    expect((wrapper.vm as any).selectedIndex).toBe(0);

    // Test previousImage functionality.
    await (wrapper.vm as any).previousImage();
    await flushPromises();
    expect((wrapper.vm as any).selectedIndex).toBe(2);
  });

  it('calls bookmarkItem and updates bookmark state correctly', async () => {
    const createBookmarkMock = vi.mocked(createBookmark, { shallow: true });
    createBookmarkMock.mockResolvedValue(200);

    const wrapper = mount(ImageCarousel, {
      global: {
        plugins: [i18n, fakeRouter, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        provide: { router: fakeRouter },
        mocks: { $t: (key: string) => en[key] || key },
      },
      props: {
        id: 'item1',
        images: images,
        status: 'ACTIVE',
        isOwner: false,
        isBookmarked: false,
      },
    });
    await flushPromises();

    // Expect the unbookmarked icon to be shown.
    const bookmarkNotMarked = wrapper.find('img.bookmark[alt="bookmark"]');
    expect(bookmarkNotMarked.exists()).toBe(true);

    await bookmarkNotMarked.trigger('click');
    await flushPromises();

    expect(createBookmarkMock).toHaveBeenCalledWith('item1');
    expect((wrapper.vm as any).bookmarked).toBe(true);
  });

  it('redirects to /auth if createBookmark returns 401', async () => {
    const createBookmarkMock = vi.mocked(createBookmark, { shallow: true });
    createBookmarkMock.mockResolvedValue(401);

    const wrapper = mount(ImageCarousel, {
      global: {
        plugins: [i18n, fakeRouter, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        provide: { router: fakeRouter },
        mocks: { $t: (key: string) => en[key] || key },
      },
      props: {
        id: 'item1',
        images: images,
        status: 'ACTIVE',
        isOwner: false,
        isBookmarked: false,
      },
    });
    await flushPromises();

    const bookmarkNotMarked = wrapper.find('img.bookmark[alt="bookmark"]');
    expect(bookmarkNotMarked.exists()).toBe(true);
    await bookmarkNotMarked.trigger('click');
    await flushPromises();

    expect(fakeRouter.push).toHaveBeenCalledWith('/auth');
  });

  it('calls removeBookmark and updates bookmark state correctly', async () => {
    const deleteBookmarkMock = vi.mocked(deleteBookmark, { shallow: true });
    deleteBookmarkMock.mockResolvedValue(204);

    const wrapper = mount(ImageCarousel, {
      global: {
        plugins: [i18n, fakeRouter, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
        provide: { router: fakeRouter },
        mocks: { $t: (key: string) => en[key] || key },
      },
      props: {
        id: 'item1',
        images: images,
        status: 'ACTIVE',
        isOwner: false,
        isBookmarked: true,
      },
    });
    await flushPromises();

    const bookmarkMarked = wrapper.find('img.bookmark[alt="bookmark"]');
    expect(bookmarkMarked.exists()).toBe(true);

    await bookmarkMarked.trigger('click');
    await flushPromises();

    expect(deleteBookmarkMock).toHaveBeenCalledWith('item1');
    expect((wrapper.vm as any).bookmarked).toBe(false);
  });
});
