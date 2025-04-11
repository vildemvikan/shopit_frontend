<script setup lang="ts">
import FilterMenu from '@/components/Search/FilterMenu.vue'
import SimpleSearch from '@/components/Search/SimpleSearch.vue'
import { onMounted, ref, watch } from 'vue'
import type { MenuFilter, Search, Advertisement } from '@/interfaces/interfaces.ts'
import { Condition, County } from '@/enums/enums.ts'
import { useRoute, useRouter } from 'vue-router'
import { fetchNewestAdvertisements, searchAdvertisements } from '../../utils/Advertisement.ts'
import Pagination from '@/components/Pagination.vue'
import AdvertisementPreview from '@/components/AdvertisementPreviewBox.vue'
import MyAdvertisementPreview from '@/components/AdvertisementPreviewList.vue'

const SIZE = 8
const page = ref<number>(0)
const totalPages = ref<number>(0)

const displayList = ref<boolean>(false)
const orderBy = ref<number>(1)

const route = useRoute()
const router = useRouter()

const advertisements = ref<Advertisement[]>([])
const results = ref<number>(0)
const keyWord = ref<string>('')

const categoryId = ref<number | null>(null)
const subCategoryId = ref<number | null>(null)
const forSale = ref<boolean | null>(null)
const forFree = ref<boolean | null>(null)
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)
const conditions = ref<string[] | null>(null)
const counties = ref<string[] | null>(null)
const published = ref<boolean | null>(null)

const conditionFacet = ref<any>(null)
const forSaleFacet = ref<any>(null)
const countyFacet = ref<any>(null)
const categoryFacet = ref<any>(null)
const subCategoryFacet = ref<any>(null)
const publishedTodayFacet = ref<any>(null)

onMounted(async () => {
  if (route.query.category) {
    categoryId.value = Number(route.query.category) as unknown as number
  }
  if (route.query.subCategory) {
    subCategoryId.value = Number(route.query.subCategory) as unknown as number
  }
  if (route.query.forSale) {
    forSale.value = route.query.forSale === 'true'
  }
  if (route.query.counties) {
    counties.value = Array.isArray(route.query.counties)
      ? (route.query.counties as unknown as County[])
      : [route.query.counties as unknown as County]
  }
  if (route.query.minPrice) {
    minPrice.value = Number(route.query.minPrice)
  }
  if (route.query.maxPrice) {
    maxPrice.value = Number(route.query.maxPrice)
  }
  if (route.query.conditions) {
    conditions.value = Array.isArray(route.query.conditions)
      ? (route.query.conditions.map((c) => Number(c)) as unknown as Condition[])
      : [Number(route.query.conditions) as unknown as Condition]
  }
  if (route.query.sortBy) {
    orderBy.value = Number(route.query.sortBy)
  }
  await fetchAdvertisements()
})

async function newKeyword(newKeyword: string) {
  keyWord.value = newKeyword
  await updateRoute()
}

async function newPrice(newPrices: { min: number; max: number }) {
  console.log(newPrices)
  minPrice.value = newPrices.min
  maxPrice.value = newPrices.max
  await updateRoute()
}

async function newFilters(newFilters: MenuFilter) {
  categoryId.value = newFilters.categoryId
  subCategoryId.value = newFilters.subCategoryId
  conditions.value = newFilters.conditions
  counties.value = newFilters.counties
  forSale.value = newFilters.forSale
  forFree.value = newFilters.forFree
  published.value = newFilters.published

  console.log(forFree.value)

  if (published.value == false) {
    published.value = null
  }

  if (forSale.value && forFree.value) {
    forSale.value = null
  }
  if (forSale.value == false && (forFree.value == false || forFree.value == null)) {
    forSale.value = null
  }
  if (forFree.value == true) {
    forSale.value = false
  }

  await updateRoute()
}

async function updateRoute() {
  const query: Record<string, any> = {}
  if (keyWord.value !== '') query.search = keyWord.value
  if (categoryId.value !== null) query.category = categoryId.value
  if (subCategoryId.value !== null) query.subCategory = subCategoryId.value
  if (minPrice.value !== null) query.minPrice = minPrice.value
  if (maxPrice.value !== null) query.maxPrice = maxPrice.value
  if (counties.value && counties.value.length > 0) query.counties = counties.value
  if (conditions.value && conditions.value.length > 0) query.conditions = conditions.value
  if (forSale.value !== null) query.forSale = forSale.value
  if (published.value !== null) query.publishedToday = published.value
  if (orderBy.value) query.sortBy = orderBy.value
  await router.push({ name: 'search', query })
  page.value = 0
  await fetchAdvertisements()
}

async function fetchAdvertisements() {
  try {
    let field = 'publishedAt'
    let direction = 'asc'
    if (orderBy.value == 1 || orderBy.value == 4) {
      direction = 'desc'
    }
    if (orderBy.value == 3 || orderBy.value == 4) {
      field = 'price'
    }
    const result: Search = await searchAdvertisements(
      SIZE,
      page.value,
      keyWord.value,
      categoryId.value,
      subCategoryId.value,
      conditions.value,
      counties.value,
      minPrice.value,
      maxPrice.value,
      forSale.value,
      published.value,
      field,
      direction,
    )
    advertisements.value = result.items.content
    results.value = result.items.totalElements
    totalPages.value = result.items.totalPages

    conditionFacet.value = result.conditionFacet
    forSaleFacet.value = result.forSaleFacet
    categoryFacet.value = result.categoryFacet
    subCategoryFacet.value = result.subCategoryFacet
    countyFacet.value = result.countyFacet
    publishedTodayFacet.value = result.publishedTodayFacet

    console.log('SEARCH')
    console.log(advertisements.value)
  } catch (error) {
    console.error(error)
  }
}

async function changePage(newPage: number) {
  page.value = newPage
  await fetchAdvertisements()
}

watch(orderBy, async () => {
  page.value = 0
  await updateRoute()
})

function toggleDisplay() {
  displayList.value = !displayList.value
}
</script>

<template>
  <div class="search-content">
    <div class="filter-menu">
      <h1 class="page-title">{{ $t('title-advertisements') }}</h1>
      <FilterMenu
        @update-filter="newFilters"
        @update-price="newPrice"
        :for-sale="forSale"
        :for-free="forFree"
        :category-id="categoryId"
        :sub-category-id="subCategoryId"
        :conditions="conditions"
        :counties="counties"
        :max-price="maxPrice"
        :min-price="minPrice"
        :for-sale-facet="forSaleFacet"
        :condition-facet="conditionFacet"
        :county-facet="countyFacet"
        :category-facet="categoryFacet"
        :subcategory-facet="subCategoryFacet"
        :published-today-facet="publishedTodayFacet"
      />
    </div>

    <div class="main-content">
      <div class="search-box">
        <simple-search @update-keyword="newKeyword" />
      </div>

      <label class="results">{{ results }}&nbsp;{{ $t('label-results') }}</label>
      <hr class="divider" />
      <div class="display">
        <div class="display-options">
          <button class="display-button" id="view-option" @click="toggleDisplay">
            <img
              v-if="displayList"
              src="@/assets/icons/squares.svg"
              alt="display boxes"
              class="button-icon"
            />
            <img v-else src="@/assets/icons/list.svg" alt="display list" class="button-icon" />
          </button>
          <select class="display-button" id="filter-dropdown" v-model="orderBy">
            <option :value="1">{{ $t('option-newest') }}</option>
            <option :value="2">{{ $t('option-oldest') }}</option>
            <option :value="3">{{ $t('option-cheapest') }}</option>
            <option :value="4">{{ $t('option-most-expensive') }}</option>
          </select>
        </div>
        <div class="display-box" id="normal">
          <div
            class="result"
            id="class-display"
            v-if="!displayList && advertisements.length > 0"
            v-for="advertisement in advertisements"
          >
            <AdvertisementPreview
              :id="advertisement.id"
              :title="advertisement.name"
              :date="advertisement.publishedAt"
              :image="advertisement.images[0].url"
              :is-bookmarked="advertisement.isBookmarked"
              :city="advertisement.location.city"
              :price="advertisement.price"
              :status="advertisement.status"
            />
          </div>
          <div
            class="result"
            id="list-display"
            v-if="displayList && advertisements.length > 0"
            v-for="advertisement in advertisements"
          >
            <MyAdvertisementPreview
              :id="advertisement.id"
              :title="advertisement.name"
              :date="advertisement.publishedAt"
              :image="advertisement.images[0].url"
              :price="advertisement.price"
              :status="advertisement.status"
              :location="advertisement.location.city"
              :is-bookmarked="advertisement.isBookmarked"
              :display-bookmark="true"
              :display-location="true"
              :display-status="false"
            />
          </div>

          <div class="results" id="no-results" v-if="advertisements.length <= 0">
            <label>{{ $t('placeholder-no-advertisement-match') }}</label>
          </div>
        </div>
        <div class="display-box" id="small">
          <div class="result" id="list-display" v-for="advertisement in advertisements">
            <MyAdvertisementPreview
              :id="advertisement.id"
              :title="advertisement.name"
              :date="advertisement.publishedAt"
              :image="advertisement.images[0].url"
              :price="advertisement.price"
              :status="advertisement.status"
              :location="advertisement.location.city"
              :is-bookmarked="advertisement.isBookmarked"
              :display-bookmark="true"
              :display-location="true"
              :display-status="false"
            />
          </div>
        </div>
        <div class="pagination-box">
          <Pagination @page-change="changePage" :total-pages="totalPages" :current-page="page" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-content {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 170%;
}

.page-title {
  text-decoration: underline;
}

.filter-menu {
  width: 25%;
  height: fit-content;
}

.main-content {
  display: flex;
  flex-direction: column;
  width: 75%;
  height: 100%;
  gap: 10px;
}

.search-box {
  margin-top: 5px;
  height: 2%;
  min-height: 45px;
  width: 100%;
}

.results {
  font-weight: bold;
}

.divider {
  border: none;
  border-top: var(--global-thicc-border-size) solid var(--color-gray-divider);
}

.display {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 90%;
  place-content: start;
  justify-content: start;
}

.display-options {
  display: flex;
  flex-direction: row;
  place-content: end;
  width: 100%;
  height: 5%;
  gap: 10px;
}

.display-button {
  height: 4vh;
  min-height: 30px;
}

.button-icon {
  height: 100%;
}

.display-box {
  display: flex;
  flex-wrap: wrap;
  align-content: start;

  height: 90%;
  width: 100%;
  gap: 15px;
}

#small {
  display: none;
}

.result {
  width: calc(calc(100% - 25px * 2) / 3);
  min-width: 250px;
  height: calc(calc(100% - 25px * 2) / 3);
}

#list-display {
  width: 100%;
  height: calc(calc(100% - 30px * 1) / 9);
}

.pagination-box {
  display: flex;
  justify-content: center;
  width: 100%;
}

#no-results {
  display: flex;
  width: 100%;
  place-content: center;
}

@media (max-width: 1150px) {
  .result {
    width: calc(calc(100% - 25px * 1) / 2);
    min-width: 250px;
    height: calc(calc(100% - 25px * 3) / 4);
  }

  .filter-menu {
    width: 35%;
  }

  .main-content {
    width: 65%;
  }
}

@media (max-width: 900px) {
  .filter-menu {
    width: 35%;
  }

  .main-content {
    width: 65%;
  }
}
@media (max-width: 850px) {
  #view-option {
    display: none;
  }

  #normal {
    display: none;
  }

  #small {
    display: flex;
  }
}
</style>
