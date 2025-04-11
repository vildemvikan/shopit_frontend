<script setup lang="ts">

import type { Category } from '@/interfaces/interfaces.ts'
import { onMounted, ref } from 'vue'
import {fetchCategoriesWithSubCategories } from '../../../utils/Categories.ts'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

onMounted(async () => {
  await loadAdvertisements()
})

const categories = ref<Category[]>([])
const showDropDown = ref<boolean>(false)
const category = ref<number|null>(null)
const searchString = ref<string>('')

async function loadAdvertisements() {
  try {
    categories.value = await fetchCategoriesWithSubCategories()
  } catch (error) {
    console.error(error)
  }
}

function toggleCategories(){
  showDropDown.value = !showDropDown.value
}

async function searchCategory(categoryId:string, subCategoryId:string){
  if(categoryId && subCategoryId){
    await router.push({name: 'search', query: {category: categoryId, subCategory: subCategoryId}})
  } else {
    await router.push({name: 'search', query: {category: categoryId}})
  }
}

async function search(){

  const validSearch = searchString.value.trim() !== ''
  const validCategory = category.value !== null

  if(validSearch && validCategory){
    await router.push({name: 'search', query: {search: searchString.value, category: category.value}} )
  }if(validSearch && !validCategory){
    await router.push({name: 'search', query: {search: searchString.value}})
  }if(!validSearch && validCategory){
    await router.push({name: 'search', query: {category: category.value}})
  } if(!validSearch && !validCategory) {
    await router.push({name: 'search'})
  }
}
</script>

<template>
  <div class="search-content">
    <div class="categories" @click="toggleCategories">
      <small class="categories-label">{{$t('label-shop-by-category')}}</small>
      <img src="@/assets/icons/up.svg" alt="icon" class="invertible-icon" :class="{open: showDropDown}">
    </div>

    <div class="search-bar">
      <img src="@/assets/icons/search.svg" class="inv-icon" alt="search">
      <input
        class="search-input"
        :placeholder="t('label-search')"
        type="text"
        v-model="searchString">
      <select class="category-option" v-model="category">
        <option :value="null"> {{$t('option-category-all')}}</option>
        <option :value="category.id" v-for="category in categories">{{category.name}}</option>
      </select>

      <div class="mega-menu-dropdown" v-if="showDropDown">
        <div class="mega-menu-column" v-for="category in categories" :key="category.id">
          <h3 class="mega-menu-heading"
              @click="searchCategory(category.id, null)">{{ category.name }}</h3>
          <ul v-if="category.subcategories && category.subcategories.length">
            <li v-for="subCategory in category.subcategories"
                :key="subCategory.id" @click="searchCategory(category.id, subCategory.id)">
              {{ subCategory.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <button class="search-button" @click="search">
      {{$t('button-search')}}
    </button>

  </div>

</template>

<style scoped>

.search-content {
  position: relative; /* New: establish positioning context */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  gap: 10px;
}

.categories{
  display: flex;
  width:  6%;
  height: 30%;
  background: transparent;
  border: none;
  cursor: pointer;
  justify-content: center;
  place-items: center;
}

.categories-label{
  cursor: pointer;
  width: 85%;
}

.invertible-icon{
  height: 1em;
  transform: rotate(180deg);
  cursor: pointer;
}

.open{
  transform: rotate(0deg);
}


.search-bar{
  position: relative;
  display: flex;
  flex-direction: row;
  width: 60%;
  height: 30%;
  align-items: center;
  border: var(--global-border-size) solid;
  border-radius: calc(var(--global-border-radius)/2);
}

.inv-icon{
  height: 60%;
  margin: 10px;
}

.search-input{
  width: 80%;
  height: 100%;
  border: none;
  background-color: var(--color-background);
  color: var(--color-text);
}

.search-input:focus{
  outline: none;
}

.search-input:focus::placeholder {
  color: transparent;
}

.category-option{
  min-width: 20%;
  height: 100%;
  border: none;
  border-left: var(--global-border-size) solid var(--color-text);
  color: var(--color-text);
  background-color: transparent;
  padding: 10px;
}

.search-button{
  height: 30%;
  aspect-ratio: 2/1;
  background-color: var(--color-gray-button);
  border-radius: calc(var(--global-border-radius)/2);
  border: var(--global-border-size) solid;
}

.search-button:hover{
  background-color: var(--color-dark-gray-button);
}



.mega-menu-dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background-color: var(--color-background);
  border: var(--global-border-size) solid var(--color-gray-divider);
  border-radius: calc(var(--global-border-radius)/2);
  box-shadow: var(--global-box-shaddow);
  display: flex;
  flex-wrap: wrap;
  z-index: 1;
  padding: 20px;
}

.mega-menu-column {
  width: calc(100% /3);
}

.mega-menu-heading {
  margin-bottom: 10px;
  font-weight: bold;
  cursor: pointer;
}

.mega-menu-heading:hover{
  text-decoration: underline;
}

.mega-menu-column ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mega-menu-column li {
  padding: 5px 0;
  cursor: pointer;
}

.mega-menu-column li:hover {
  text-decoration: underline;
}

@media (max-width: 1000px){
  .search-bar{
    width: 80%;
  }

  .categories{
    width: 8.5%;
  }
}

@media (max-width: 700px){
  .search-bar{
    width: 80%;
  }

  .categories{
    display: none;
  }

  .category-option{
    display: none;
  }
}
</style>
