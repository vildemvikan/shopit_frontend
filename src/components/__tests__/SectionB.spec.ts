// Mocking fetch categories which is invoked in this component
import { vi } from 'vitest'
vi.mock('../../../utils/Advertisement.ts', () => {
  return {
    fetchCategories: vi.fn(),
  }
});

import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import SectionB from '@/components/Schema/SectionB.vue' // Adjust the import path as needed
import en from '../../assets/transcripts/en.json'
import { fetchCategories } from '../../../utils/Advertisement.ts'
import { createTestingPinia } from '@pinia/testing'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
});

describe('SectionB.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes internal state from props on mount', async () => {

    const propsData = {
      title: 'Initial Title',
      description: 'Initial description',
      condition: 'GOOD',
      category: 2,
      subCategory: 5,
      tags: ['tag1', 'tag2'],
      titleError: false,
      descriptionError: false,
      conditionError: false,
      categoryError: false,
      subCategoryError: false,
    };

    (fetchCategories as any).mockResolvedValue([]);

    const wrapper = mount(SectionB, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
      },
      props: propsData,
    });
    await flushPromises();

    // Because onMounted copies props into internal refs, we expect the input/textarea values to match.
    const titleInput = wrapper.find('input.title-input');
    expect(titleInput.element.value).toBe(propsData.title);

    const descriptionArea = wrapper.find('textarea');
    expect(descriptionArea.element.value).toBe(propsData.description);

    const tagElements = wrapper.findAll('.tag');
    expect(tagElements.length).toBe(propsData.tags.length);
  });

  it('emits update events when fields change', async () => {
    const propsData = {
      title: 'Initial Title',
      description: 'Initial description',
      condition: 'GOOD',
      category: 2,
      subCategory: 5,
      tags: ['tag1', 'tag2'],
      titleError: false,
      descriptionError: false,
      conditionError: false,
      categoryError: false,
      subCategoryError: false,
    };

    (fetchCategories as any).mockResolvedValue([
      { id: 2, name: 'Category 2', subcategories: [{ id: 5, name: 'SubCat 5' }] },
      { id: 3, name: 'Category 3', subcategories: [{ id: 7, name: 'SubCat 7' }] },
    ]);



    const wrapper = mount(SectionB, {
      global: { plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })] },
      props: propsData,
    });
    await flushPromises();

    // Change the title and check that update:title is emitted.
    const titleInput = wrapper.find('input.title-input');
    await titleInput.setValue('New Title');
    await flushPromises();

    expect(wrapper.emitted()['update:title']).toBeTruthy();
    expect(titleInput.element.value).toBe('New Title');

    // Change the description.
    const descriptionArea = wrapper.find('textarea');
    await descriptionArea.setValue('New description');
    await flushPromises();
    expect(wrapper.emitted()['update:description']).toBeTruthy();
    expect(descriptionArea.element.value).toBe('New description');

    // Test condition select.
    const conditionSelect = wrapper.find('select'); // assuming the first select is for condition.
    await conditionSelect.setValue('LIKE_NEW');
    await flushPromises();
    expect(wrapper.emitted()['update:condition']).toBeTruthy();
    expect(conditionSelect.element.value).toBe('LIKE_NEW');

    // For category and subCategory, assume they are the second and third select elements.
    const selects = wrapper.findAll('select');
    const categorySelect = selects[1];
    const subCategorySelect = selects[2];

    // Change category.
    await categorySelect.setValue(3); // new category id; note: element value becomes "3" (a string)
    await flushPromises();
    expect(wrapper.emitted()['update:category']).toBeTruthy();
    expect(categorySelect.element.value).toBe('3');

    // Change subCategory.
    await subCategorySelect.setValue(7); // new subCategory id
    await flushPromises();
    expect(wrapper.emitted()['update:subCategory']).toBeTruthy();
    expect(subCategorySelect.element.value).toBe('7');
  });

  it('adds and removes tags correctly and emits update:tags', async () => {
    // Start with an empty tags array.
    const propsData = {
      title: '',
      description: '',
      condition: '',
      category: '',
      subCategory: '',
      tags: [],
      titleError: false,
      descriptionError: false,
      conditionError: false,
      categoryError: false,
      subCategoryError: false,
    };

    (fetchCategories as any).mockResolvedValue([]);

    const wrapper = mount(SectionB, {
      global: { plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })] },
      props: propsData,
    });
    await flushPromises();

    // Initially, no tags should be rendered.
    let tagElements = wrapper.findAll('.tag');
    expect(tagElements.length).toBe(0);

    // Simulate entering a tag in the tag input and clicking the add button.
    const tagInput = wrapper.find('input.tag-input');
    await tagInput.setValue('newtag');
    await flushPromises();

    // The add button should be enabled when tag has a value.
    const addButton = wrapper.find('button.add-tag-button');
    expect(addButton.attributes('disabled')).toBeUndefined(); // not disabled

    // Click the add button.
    await addButton.trigger('click');
    await flushPromises();

    // Expect that an 'update:tags' event was emitted.
    const emittedTags: any[] = wrapper.emitted()['update:tags'];
    expect(emittedTags).toBeTruthy();
    // The new tags array should contain 'newtag'.
    expect(emittedTags[emittedTags.length - 1][0]).toContain('newtag');

    // Now simulate removing the tag.
    const deleteIcon = wrapper.find('.delete-tag');
    await deleteIcon.trigger('click');
    await flushPromises();

    const emittedAfterRemove: any[] = wrapper.emitted()['update:tags'];
    expect(emittedAfterRemove).toBeTruthy();
    const newTagsAfterRemove = emittedAfterRemove[emittedAfterRemove.length - 1][0];
    expect(newTagsAfterRemove.length).toBe(0);
  });

  it('computes subCategories based on selected category', async () => {
    // Simulate fetchCategories returning categories with subcategories.
    const categoriesData = [
      { id: 1, name: 'Category 1', subcategories: [ { id: 10, name: 'SubCat A' }, { id: 11, name: 'SubCat B' } ] },
      { id: 2, name: 'Category 2', subcategories: [ { id: 20, name: 'SubCat C' } ] },
    ];
    (fetchCategories as any).mockResolvedValue(categoriesData);

    const propsData = {
      title: '',
      description: '',
      condition: '',
      category: 2,
      subCategory: '',
      tags: [],
      titleError: false,
      descriptionError: false,
      conditionError: false,
      categoryError: false,
      subCategoryError: false,
    };

    const wrapper = mount(SectionB, {
      global: { plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })] },
      props: propsData,
    });
    await flushPromises();

    // Access the computed subCategories from the component instance.
    const subCategories = (wrapper.vm as any).subCategories;
    expect(subCategories.length).toBe(1);
    expect(subCategories[0].id).toBe(20);

    // Also, verify that the sub-category dropdown renders the correct option.
    const selects = wrapper.findAll('select');
    const subCategorySelect = selects[2]; // assuming the third select is for subCategory.
    const options = subCategorySelect.findAll('option').filter(opt => opt.attributes('value') !== '');
    expect(options.length).toBe(1);
    expect(options[0].text()).toBe('SubCat C');
  });
});
