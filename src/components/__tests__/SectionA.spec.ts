import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import SectionA from '../Schema/SectionA.vue' // adjust path if needed
import en from '../../assets/transcripts/en.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
});

describe('SectionA.vue', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes internal state from props on mount', async () => {
    // Mount the component with props forSale and images.
    const imagesProp = [
      { url: 'http://example.com/image1.jpg', caption: '', publicId: null },
      { url: 'http://example.com/image2.jpg', caption: '', publicId: null },
    ];
    const wrapper = mount(SectionA, {
      global: { plugins: [i18n] },
      props: {
        forSale: false,
        images: imagesProp,
        imagesError: false,
      },
    });
    await flushPromises();

    // In the template: left button has :class="{active: forSale}"
    // Right button has :class="{active: !forSale}".
    // Since forSale prop is false, the left button should not have "active" and the right button should.
    const leftButton = wrapper.find('#left-type-button');
    const rightButton = wrapper.find('#right-type-button');
    expect(leftButton.classes('active')).toBe(false);
    expect(rightButton.classes('active')).toBe(true);

    // And the rendered images. there should be two image-box elements.
    const imageBoxes = wrapper.findAll('.image-box');
    expect(imageBoxes.length).toBe(2);
  });

  it('toggles forSale and emits update:forSale event', async () => {
    // Mount component with initial forSale true.
    const wrapper = mount(SectionA, {
      global: { plugins: [i18n] },
      props: {
        forSale: true,
        images: [],
        imagesError: false,
      },
    });
    // Clear any initial emitted events
    wrapper.emitted()['update:forSale'] && wrapper.emitted()['update:forSale'].splice(0);

    // Click the right button to toggle forSale to false.
    const rightButton = wrapper.find('#right-type-button');
    await rightButton.trigger('click');
    await flushPromises();
    let events = wrapper.emitted()['update:forSale'];
    expect(events).toBeTruthy();
    expect(events[0]).toEqual([false]);

    // Now click the left button to toggle forSale to true.
    const leftButton = wrapper.find('#left-type-button');
    await leftButton.trigger('click');
    await flushPromises();
    events = wrapper.emitted()['update:forSale'];
    // The last event should be true
    expect(events[events.length - 1]).toEqual([true]);
  });

  it('moves images up, down, and deletes an image, and emits update:images', async () => {
    const imagesProp = [
      { url: 'http://example.com/1.jpg', caption: '', publicId: null },
      { url: 'http://example.com/2.jpg', caption: '', publicId: null },
      { url: 'http://example.com/3.jpg', caption: '', publicId: null },
    ];
    const wrapper = mount(SectionA, {
      global: { plugins: [i18n] },
      props: {
        forSale: true,
        images: imagesProp,
        imagesError: false,
      },
    });
    await flushPromises();

    // move image at index 1 upward.
    (wrapper.vm as any).moveImageUp(1);
    await flushPromises();
    // An event should be emitted with the new order.
    let emittedImages = wrapper.emitted()['update:images'];
    expect(emittedImages).toBeTruthy();
    let newOrder = emittedImages[emittedImages.length - 1][0];
    // Original order: [1,2,3] after moving up new order:  [2,1,3]
    expect(newOrder[0].url).toBe('http://example.com/2.jpg');
    expect(newOrder[1].url).toBe('http://example.com/1.jpg');
    expect(newOrder[2].url).toBe('http://example.com/3.jpg');

    // Test moveImageDown: move image at index 1 downward.
    (wrapper.vm as any).moveImageDown(1);
    await flushPromises();
    emittedImages = wrapper.emitted()['update:images'];
    newOrder = emittedImages[emittedImages.length - 1][0];
    // New order should be: [2,3,1]
    expect(newOrder[0].url).toBe('http://example.com/2.jpg');
    expect(newOrder[1].url).toBe('http://example.com/3.jpg');
    expect(newOrder[2].url).toBe('http://example.com/1.jpg');

    (wrapper.vm as any).deleteImage(1);
    await flushPromises();
    emittedImages = wrapper.emitted()['update:images'];
    newOrder = emittedImages[emittedImages.length - 1][0];
    expect(newOrder.length).toBe(2);
    expect(newOrder[0].url).toBe('http://example.com/2.jpg');
    expect(newOrder[1].url).toBe('http://example.com/1.jpg');
  });

  it('calls updateDescription to emit updated images', async () => {
    const initialImages = [
      { url: 'http://example.com/1.jpg', caption: 'old description', publicId: null }
    ];
    const wrapper = mount(SectionA, {
      global: { plugins: [i18n] },
      props: {
        forSale: true,
        images: initialImages,
        imagesError: false,
      },
    });
    await flushPromises();
    (wrapper.vm as any).updateDescription();
    await flushPromises();
    const events = wrapper.emitted()['update:images'];
    expect(events).toBeTruthy();
    expect(events[events.length - 1][0]).toEqual(initialImages);
  });

  it('activates file input when add image button is clicked', async () => {
    // Mount the component.
    const wrapper = mount(SectionA, {
      global: { plugins: [i18n] },
      props: {
        forSale: true,
        images: [],
        imagesError: false,
      },
    });
    await flushPromises();

    // Access the fileInput reference
    const fileInput = (wrapper.vm as any).fileInput;
    if (fileInput && fileInput.value) {
      const clickSpy = vi.spyOn(fileInput.value, 'click');
      (wrapper.vm as any).activateInput();
      expect(clickSpy).toHaveBeenCalled();
    } else {
      const inputEl = wrapper.find('input[type="file"]');
      const clickSpy = vi.spyOn(inputEl.element, 'click');
      (wrapper.vm as any).activateInput();
      expect(clickSpy).toHaveBeenCalled();
    }
  });

  it('adds an image when a file is selected', async () => {
    const originalFileReader = window.FileReader;
    const fakeFileReader: Partial<FileReader> = {
      readAsDataURL: vi.fn(),
      onload: null,
    };
    window.FileReader = vi.fn(() => fakeFileReader) as any;

    const wrapper = mount(SectionA, {
      global: { plugins: [i18n] },
      props: {
        forSale: true,
        images: [],
        imagesError: false,
      },
    });
    await flushPromises();

    const emitSpy = vi.spyOn(wrapper.vm, '$emit');

    // Create a fake file.
    const file = new Blob(['dummy content'], { type: 'image/png' });
    (file as any).name = 'dummy.png';

    const fileInput = wrapper.find('input[type="file"]');
    Object.defineProperty(fileInput.element, 'files', {
      value: [file], // your fake file array
      writable: false,
    });

    await fileInput.trigger('change');

    // Simulate FileReader onload.
    const resultDataUrl = 'data:image/png;base64,dummydata';
    if (fakeFileReader.onload) {
      fakeFileReader.onload({ target: { result: resultDataUrl } });
    }
    await flushPromises();

    const emitted = wrapper.emitted()['update:images'];
    expect(emitted).toBeTruthy();
    const lastEmittedImages = emitted[emitted.length - 1][0];
    expect(lastEmittedImages[0].url).toBe(resultDataUrl);

    // Restore the original FileReader.
    window.FileReader = originalFileReader;
  });
});
