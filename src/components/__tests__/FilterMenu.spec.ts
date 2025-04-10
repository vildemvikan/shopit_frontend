//Mock the utility that fetches categories with subcategories.
import { vi } from 'vitest'
vi.mock('../../../utils/Categories.ts', () => {
  return {
    fetchCategoriesWithSubCategories: vi.fn(),
  }
});

import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach} from 'vitest'
import { createI18n } from 'vue-i18n'
import FilterMenu from '../Search/FilterMenu.vue'
import en from '../../assets/transcripts/en.json'
import { fetchCategoriesWithSubCategories } from '../../../utils/Categories.ts'
import { createTestingPinia } from '@pinia/testing'

const County = {
  Oslo: "Oslo",
  Trøndelag: "Trøndelag",
  Agder: "Agder",
  Akershus: 'Akershus',
  Buskerud:'Buskerud',
  Finnmark: 'Finnmark',
  Innlandet: 'Innladet',
  MøreOgRomsdal: 'Møre og Romsdal',
  Nordland: 'Nordland',
  Rogaland: 'Rogaland',
  Svalbar: 'Svalbar',
  Telemark: 'Telemark',
  Troms: 'Troms',
  Vestfold: 'Vestfold',
  Vestland: 'Vestland',
  Østland: 'Østland'
};

const Condition = {
  New: "NEW",
  LikeNew: "LIKE_NEW",
  Good: "GOOD",
  Acceptable: "ACCEPTABLE",
  ForParts: "FOR_PARTS",
};

// Create an i18n instance.
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
});

describe('FilterMenu.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the filter menu correctly with default sections', async () => {
    const propsData = {
      conditions: [Condition.Good],
      counties: [County.Oslo, County.Vestland],
      categoryId: null,
      subCategoryId: null,
      minPrice: null,
      maxPrice: null,
      forSale: null,
      forFree: null,
      conditionFacet: { [Condition.Good]: 5 },
      forSaleFacet: { 'true': 3, 'false': 2 },
      countyFacet: { [County.Oslo]: 4, [County.Vestland]: 1, [County.Trøndelag]: 0 },
      categoryFacet: { 1: 10, 2: 5 },
      subcategoryFacet: { 10: 2, 11: 3 },
      publishedTodayFacet: { 'true': 7 },
    };

    (fetchCategoriesWithSubCategories as any).mockResolvedValue([
      { id: 1, name: "Category 1", subcategories: [{ id: 10, name: "SubCat A" }, { id: 11, name: "SubCat B" }] },
      { id: 2, name: "Category 2", subcategories: [] },
    ]);

    const wrapper = mount(FilterMenu, {
      global: {
        plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })],
      },
      props: propsData,
    });
    await flushPromises();

    expect(wrapper.find('h2.title').text()).toContain(en["label-filter-search"]);

    const countyCheckboxes = wrapper.findAll('div#counties input[type="checkbox"]');
    expect(countyCheckboxes.length).toBe(Object.values(County).length);

    // Price inputs should exist.
    expect(wrapper.find('input#min-price').exists()).toBe(true);
    expect(wrapper.find('input#max-price').exists()).toBe(true);

    // Condition section, there should be 5 checkboxes
    const conditionCheckboxes = wrapper.findAll('div#conditions input[type="checkbox"]');
    expect(conditionCheckboxes.length).toBe(5);
  });

  it('emits updateFilter when filter values change', async () => {
    const propsData = {
      conditions: [Condition.Good],
      counties: [County.Oslo, County.Vestland],
      categoryId: null,
      subCategoryId: null,
      minPrice: 100,
      maxPrice: 500,
      forSale: false,
      forFree: false,
      conditionFacet: { [Condition.Good]: 5, [Condition.New]: 3 },
      forSaleFacet: { 'true': 3, 'false': 2 },
      countyFacet: { [County.Oslo]: 4, [County.Vestland]: 1 },
      categoryFacet: { 1: 10, 2: 5 },
      subcategoryFacet: { 10: 2, 11: 3 },
      publishedTodayFacet: { 'true': 7 },
    };

    (fetchCategoriesWithSubCategories as any).mockResolvedValue([
      { id: 1, name: "Category 1", subcategories: [{ id: 10, name: "SubCat A" }, { id: 11, name: "SubCat B" }] },
      { id: 2, name: "Category 2", subcategories: [] },
      { id: 3, name: "Category 3", subcategories: [{ id: 12, name: "SubCat C" }] },
    ]);

    const wrapper = mount(FilterMenu, {
      global: { plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })] },
      props: propsData,
    });
    await flushPromises();


    // For this test, we remount with a known category list.
    (fetchCategoriesWithSubCategories as any).mockResolvedValue([
      { id: 1, name: "Category 1", subcategories: [{ id: 10, name: "SubCat A" }] },
    ]);
    const wrapperCategory = mount(FilterMenu, {
      global: { plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })] },
      props: { ...propsData, categoryId: null },
    });
    await flushPromises();

    // Simulate clicking on a category option.
    // The component renders category options in a container with class "category-display".
    // We assume that if no category is selected, multiple category options are rendered.
    const categoryOptions = wrapperCategory.findAll('.category-option');
    // We must ensure that the option is not disabled. For our test, we assume count > 0:
    // For example, if our props.categoryFacet is present and returns a positive count.
    await categoryOptions.at(0)?.trigger('click');
    await flushPromises();

    // Check that updateFilter was emitted with the new categoryId.
    const updateEvents1 = wrapperCategory.emitted()['updateFilter'];
    expect(updateEvents1).toBeTruthy();
    const lastFilter1 = updateEvents1[updateEvents1.length - 1][0];
    // We expect selectedCategory to be updated to the id of the clicked category.
    expect(lastFilter1.categoryId).toBe(1);

    // Now, we simulate updating the price values.
    const wrapperPrice = mount(FilterMenu, {
      global: { plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })] },
      props: { ...propsData },
    });
    await flushPromises();

    const minPriceInput = wrapperPrice.find('input#min-price');
    const maxPriceInput = wrapperPrice.find('input#max-price');
    await minPriceInput.setValue('200');
    await maxPriceInput.setValue('800');
    await flushPromises();

    // Trigger the updatePrice function by clicking its button.
    const updatePriceButton = wrapperPrice.find('button.price-search');
    await updatePriceButton.trigger('click');
    await flushPromises();

    // Verify the updatePrice event.
    expect(wrapperPrice.emitted()['updatePrice']).toBeTruthy();
    expect(wrapperPrice.emitted()['updatePrice'][0]).toEqual([{ min: "200", max: "800" }]);
  });

  it('updates counties and emits updateFilter when a county checkbox is toggled', async () => {
    const propsData = {
      conditions: null,
      counties: [County.Oslo, County.Vestland],
      categoryId: null,
      subCategoryId: null,
      minPrice: null,
      maxPrice: null,
      forSale: null,
      forFree: null,
      conditionFacet: {},
      forSaleFacet: {},
      countyFacet: { [County.Oslo]: 4, [County.Vestland]: 1, [County.Trøndelag]: 0 },
      categoryFacet: {},
      subcategoryFacet: {},
      publishedTodayFacet: {},
    };

    (fetchCategoriesWithSubCategories as any).mockResolvedValue([]);

    const wrapper = mount(FilterMenu, {
      global: { plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })] },
      props: propsData,
    });
    await flushPromises();

    // Find the county checkboxes. Each checkbox has an id equal to the county
    const osloCheckbox = wrapper.find('input[type="checkbox"]#Oslo');
    expect(osloCheckbox.exists()).toBe(true);

    // Toggle the Oslo checkbox
    await osloCheckbox.setChecked(true);
    await flushPromises();

    // Verify that updateFilter was emitted with updated counties
    const updateEvents = wrapper.emitted()['updateFilter'];
    expect(updateEvents).toBeTruthy();
    const lastFilter = updateEvents[updateEvents.length - 1][0];
    expect(lastFilter.counties).toContain("Oslo");
  });

  it('updates selectedConditions and emits updateFilter when a condition checkbox is toggled', async () => {
    const propsData = {
      conditions: [],
      counties: null,
      categoryId: null,
      subCategoryId: null,
      minPrice: null,
      maxPrice: null,
      forSale: null,
      forFree: null,
      conditionFacet: { [Condition.New]: 3, [Condition.Good]: 5 },
      forSaleFacet: {},
      countyFacet: {},
      categoryFacet: {},
      subcategoryFacet: {},
      publishedTodayFacet: {},
    };

    (fetchCategoriesWithSubCategories as any).mockResolvedValue([]);

    const wrapper = mount(FilterMenu, {
      global: { plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })] },
      props: propsData,
    });
    await flushPromises();

    // Find condition checkboxes.
    const conditionCheckboxes = wrapper.findAll('div#conditions input[type="checkbox"]');
    expect(conditionCheckboxes.length).toBe(5);
    // Check the first condition checkbox
    const firstCheckbox = conditionCheckboxes.at(0);
    await firstCheckbox?.setChecked(true);
    await flushPromises();

    // Verify that updateFilter emits the new condition.
    expect(wrapper.emitted()['updateFilter']).toBeTruthy();
    const lastFilter = wrapper.emitted()['updateFilter'][wrapper.emitted()['updateFilter'].length - 1][0];
    expect(lastFilter.conditions).toContain(Condition.New);
  });

  it('updates forSale and forFree values and emits updateFilter when listing type checkboxes are toggled', async () => {
    const propsData = {
      conditions: null,
      counties: null,
      categoryId: null,
      subCategoryId: null,
      minPrice: null,
      maxPrice: null,
      forSale: false,
      forFree: false,
      conditionFacet: {},
      forSaleFacet: { 'true': 3, 'false': 2 },
      countyFacet: {},
      categoryFacet: {},
      subcategoryFacet: {},
      publishedTodayFacet: {},
    };

    (fetchCategoriesWithSubCategories as any).mockResolvedValue([]);

    const wrapper = mount(FilterMenu, {
      global: { plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })] },
      props: propsData,
    });
    await flushPromises();

    const forSaleCheckbox = wrapper.find('input#forSale');
    const forFreeCheckbox = wrapper.find('input#forFree');

    await forSaleCheckbox.setChecked(true);
    await flushPromises();
    let lastFilter = wrapper.emitted()['updateFilter'][wrapper.emitted()['updateFilter'].length - 1][0];
    expect(lastFilter.forSale).toBe(true);

    await forFreeCheckbox.setChecked(true);
    await flushPromises();
    lastFilter = wrapper.emitted()['updateFilter'][wrapper.emitted()['updateFilter'].length - 1][0];
    expect(lastFilter.forFree).toBe(true);
  });

  it('updates publishedToDay and emits updateFilter when published checkbox is toggled', async () => {
    const propsData = {
      conditions: null,
      counties: null,
      categoryId: null,
      subCategoryId: null,
      minPrice: null,
      maxPrice: null,
      forSale: null,
      forFree: null,
      conditionFacet: {},
      forSaleFacet: {},
      countyFacet: {},
      categoryFacet: {},
      subcategoryFacet: {},
      publishedTodayFacet: { 'true': 7 },
    };

    (fetchCategoriesWithSubCategories as any).mockResolvedValue([]);

    const wrapper = mount(FilterMenu, {
      global: { plugins: [i18n, createTestingPinia({ stubActions: false, createSpy: vi.fn })] },
      props: propsData,
    });
    await flushPromises();

    const publishedCheckbox = wrapper.find('input#published');
    await publishedCheckbox.setChecked(true);
    await flushPromises();

    const lastFilter = wrapper.emitted()['updateFilter'][wrapper.emitted()['updateFilter'].length - 1][0];
    expect(lastFilter.published).toBe(true);
  });
});
