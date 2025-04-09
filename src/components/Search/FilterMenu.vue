<script setup lang="ts">
import { County, Condition } from '@/enums/enums.ts'
import { computed, onMounted, ref, watch } from 'vue'
import { fetchCategoriesWithSubCategories } from '../../../utils/Categories.ts'
import type { Category, SubCategory } from '@/interfaces/interfaces.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['updateFilter', 'updatePrice'])

const props = defineProps<{
  conditions: Condition[] | null
  counties: County[] | null,
  categoryId: number | null,
  subCategoryId: number | null,
  minPrice: number | null,
  maxPrice: number | null,
  forSale: boolean | null,
  forFree: boolean | null,
  conditionFacet: any
  forSaleFacet: any
  countyFacet: any
  categoryFacet: any
  subcategoryFacet: any
  publishedTodayFacet:any
}>()


const countiesComputed = computed(() => Object.values(County))
const selectedCounties = ref<string[]>([])

const categories = ref<Category[]>([])
const selectedCategory = ref<number | null>(props.categoryId)
const selectedSubCategory = ref<number | null>(props.subCategoryId)

const forSale = ref<boolean | null>(props.forSale)
const forFree = ref<boolean | null>(props.forFree)
const minPrice = ref<number | null>(props.minPrice)
const maxPrice = ref<number | null>(props.maxPrice)

const conditions = ref([
  {text:t('condition-new'), value: Condition.New},
  {text:t('condition-like-new'), value: Condition.LikeNew},
  {text:t('condition-good'), value: Condition.Good},
  {text:t('condition-acceptable'), value: Condition.Acceptable},
  {text:t('condition-for-parts'), value: Condition.ForParts},
])
const selectedConditions = ref<Condition[]>(props.conditions || [])
const publishedToDay = ref<boolean | null>(null)

async function loadCategories() {
  try {
    categories.value = await fetchCategoriesWithSubCategories()
    selectedCategory.value = props.categoryId
    selectedSubCategory.value = props.subCategoryId
    selectedConditions.value = props.conditions || []
    selectedCounties.value = props.counties ? props.counties.map(c => c.toString()) : []
    forSale.value = props.forSale
    forFree.value = props.forFree
    minPrice.value = props.minPrice
    maxPrice.value = props.maxPrice
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await loadCategories()
})

function selectCategory(category: Category) {
  const count = props.categoryFacet?.[category.id] || 0;
  if (count > 0) {
    selectedCategory.value = category.id;
    selectedSubCategory.value = null;
    console.log('Selected category:', selectedCategory.value);
  }
}

function selectSubCategory(subCategory: SubCategory) {
  const count = props.subcategoryFacet?.[subCategory.id] || 0;
  if(count > 0) {
    selectedSubCategory.value = subCategory.id
    console.log('Selected subcategory:', selectedSubCategory.value)
  }
}

const selectedCategoryObj = computed(() => {
  if (selectedCategory.value === null) return null
  return categories.value.find(c => c.id === selectedCategory.value) || null
})

const selectedCategoryName = computed(() => {
  return selectedCategoryObj.value ? selectedCategoryObj.value.name : ''
})

const selectedSubCategoryObj = computed(() => {
  if (!selectedCategoryObj.value || selectedSubCategory.value === null) return null
  return selectedCategoryObj.value.subcategories.find(sc => sc.id === selectedSubCategory.value) || null
})

const selectedSubCategoryName = computed(() => {
  return selectedSubCategoryObj.value ? selectedSubCategoryObj.value.name : ''
})

const filterValues = computed(() => ({
  categoryId: selectedCategory.value,
  subCategoryId: selectedSubCategory.value,
  forSale: forSale.value,
  forFree: forFree.value,
  conditions: selectedConditions.value,
  published: publishedToDay.value,
  counties: selectedCounties.value,
}))



function updatePrice(){
  emit('updatePrice', {min: minPrice.value, max:maxPrice.value})
}

watch(
  filterValues,
  (newFilter) => {
    emit('updateFilter', newFilter)
  },
  { deep: true }
)

</script>

<template>
  <h2 class="title">{{$t('label-filter-search')}}</h2>

  <div class="filters">
    <div class="class" id="categories">
      <label class="filter-title">{{$t('label-category')}}</label>

      <div v-if="!selectedCategory" class="category-display">
        <label
          v-for="category in categories"
          :key="category.id"
          :class="{ disabled: !props.categoryFacet || !props.categoryFacet[category.id] }"
          class="category-option"
          @click="selectCategory(category)"
        >
          {{ category.name }}
          <span>
            ({{ categoryFacet && categoryFacet[category.id] ? categoryFacet[category.id] : '0' }})
          </span>
        </label>
      </div>

      <div v-else-if="selectedCategory && !selectedSubCategory" class="category-display">
        <label class="label" id="category-option" @click="selectedCategory = null">
          ← {{$t('label-all-categories')}}
        </label>
        <label class="selected-category">
          {{ selectedCategoryName }}
        </label>
        <ul v-if="selectedCategoryObj && selectedCategoryObj.subcategories && selectedCategoryObj.subcategories.length">
          <li
            v-for="subCategory in selectedCategoryObj.subcategories"
            :key="subCategory.id"
            :class="{ disabled: !props.subcategoryFacet|| !props.subcategoryFacet[subCategory.id]}"
            class="category-option"
            @click="selectSubCategory(subCategory)">
            {{ subCategory.name }}
            <span>
            ({{ categoryFacet && subcategoryFacet[subCategory.id] ? subcategoryFacet[subCategory.id] : '0' }})
            </span>
          </li>
        </ul>
      </div>

      <div v-else-if="selectedCategory && selectedSubCategory" class="category-display">
        <label class="label" id="category-option" @click="selectedSubCategory = null">
          ← {{ selectedCategoryName }}
        </label>
        <label class="selected-category">
          {{ selectedSubCategoryName }}
        </label>
      </div>
    </div>

    <div class="class" id="counties">
      <label class="filter-title">{{$t('label-area')}}</label>
      <div v-for="county in countiesComputed" :key="county" id="county">
        <input
          type="checkbox"
          :id="county"
          :value="county"
          :disabled="!props.countyFacet|| !props.countyFacet[county]"
          v-model="selectedCounties"
        />
        <label
          :for="county"
          :class="{ disabled: !props.countyFacet|| !props.countyFacet[county]}">
          {{ county }}
          <span>
            ({{ countyFacet && countyFacet[county] ? countyFacet[county] : '0' }})
          </span>
        </label>
      </div>
    </div>

    <div class="class" id="forFree">
      <label class="filter-title">{{$t('label-listing-type')}}</label>
      <div id="listing-type">
        <input
          type="checkbox"
          :id="'forSale'"
          :value="true"
          :disabled="!props.forSaleFacet|| !props.forSaleFacet['true']"
          v-model="forSale"
        />
        <label
          :for="'forSale'"
          class="for-sale"
          :class="{ disabled: !props.forSaleFacet|| !props.forSaleFacet['true']}"
          id="listing"
        >
          {{$t('filter-for-sale')}}
          <span>
            ({{ forSaleFacet && forSaleFacet['true'] ? forSaleFacet['true'] : '0' }})
          </span>
        </label>
      </div>

      <div id="listing-type">
        <input
          type="checkbox"
          :id="'forFree'"
          :value="true"
          :disabled="!props.forSaleFacet|| !props.forSaleFacet['false']"
          v-model="forFree"
        />
        <label
          :for="'forFree'"
          class="for-sale"
          :class="{ disabled: !props.forSaleFacet|| !props.forSaleFacet['false']}"
          id="listing">
          {{ $t('filter-for-free') }}
          <span>
            ({{ forSaleFacet && forSaleFacet['false'] ? forSaleFacet['false'] : '0' }})
          </span>
        </label>
      </div>
    </div>

    <div class="class" id="price">
      <label class="filter-title">{{$t('label-price')}}</label>
      <div class="price-input">
        <div class="price-box">
          <input class="price" id="min-price" v-model="minPrice">
          <small>{{$t('label-min-price')}}</small>
        </div>
        <div class="price-box">
          <input class="price" id="max-price" v-model="maxPrice">
          <small>{{$t('label-max-price')}}</small>
        </div>
        <button class="price-search" @click="updatePrice">
          {{$t('button-search')}}
        </button>
      </div>
    </div>

    <div class="class" id="conditions">
      <label class="filter-title">{{$t('label-condition')}}</label>
      <div v-for="condition in conditions" :key="condition.value" class="condition-option">
        <input
          type="checkbox"
          :id="'condition-' + condition.value"
          :value="condition.value"
          :disabled="!props.conditionFacet || !props.conditionFacet[condition.value]"
          v-model="selectedConditions"
        />
        <label
          :for="'condition-' + condition.value"
          class="condition-label"
          :class="{ disabled: !props.conditionFacet || !props.conditionFacet[condition.value] }">
          {{ condition.text }}
          <span>
        ({{ props.conditionFacet && props.conditionFacet[condition.value] ? props.conditionFacet[condition.value] : '0' }})
      </span>
        </label>
      </div>
    </div>

    <div class="class" id="published">
      <label class="filter-title">{{$t('label-published')}}</label>
      <div id="published-today">
        <input
          type="checkbox"
          :id="'published'"
          :value="true"
          :disabled="!props.publishedTodayFacet || !props.publishedTodayFacet['true']"
          v-model="publishedToDay"
        />
        <label
          :for="'published'"
          id="county"
          :class="{ disabled: !props.publishedTodayFacet || !props.publishedTodayFacet['true'] }">
          {{$t('filter-new-today')}}
          <span>
            ({{ publishedTodayFacet && publishedTodayFacet['true'] ? publishedTodayFacet['true'] : '0' }})
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  margin-top: 20px;
  margin-bottom: 20px;
  font-weight: bold;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 20px;
}

/* Optional styling */
.class {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
}

.filter-title {
  font-weight: bold;
}

input[type="checkbox"] {
  margin-right: 5px;
}

.label:hover {
  text-decoration: underline;
  cursor: pointer;
}

.category-display {
  display: flex;
  flex-direction: column;
}

#category-option {
  color: var(--color-dark-orange-text);
}

#county {
  cursor: pointer;
}

ul {
  list-style: none;
}

.price-input {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 10px;
}

.price-box {
  display: flex;
  flex-direction: column;
  width: calc(100% / 4);
}

.price {
  height: 3vh;
  min-height: 35px;
}

.price-search {
  height: 3vh;
  min-height: 35px;
}

.category-option{
  color: var(--color-dark-orange-text);
  cursor: pointer;
}

.category-option:hover{
  text-decoration: underline;
}

.category-option.disabled{
  color: var(--color-gray-text);
}
.category-option.disabled:hover{
  color: var(--color-gray-text);
}

label.disabled{
  color: var(--color-gray-text);
}

label.disabled{
  text-decoration: none;
  cursor: default;
}

</style>
