<script setup lang="ts">

import { fetchCategories } from '../../../utils/Categories.ts'
import { onMounted, ref } from 'vue'
import type {Category} from '@/interfaces/interfaces.ts'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(async () => {
  await loadCategories()
})

const categories = ref<Category[]>([])

async function loadCategories() {
  try {
    categories.value = await fetchCategories()
    console.log(categories.value)
  } catch (error) {
    console.error(error)
  }
}

async function searchCategory(categoryId: number){
  await router.push({name: 'search', query: {category: categoryId}})

}

</script>

<template>
  <div class="content">
    <h2 class="title">{{$t('title-popular-categories')}}</h2>
    <div class="categories">
      <div class="category" v-for="category in categories">
        <div class="image-background" @click="searchCategory(category.id)">
          <img :src="category.image.url" class="category-image" alt="category image">
        </div>
        <label class="category-name">{{category.name}}</label>
      </div>
    </div>
  </div>

</template>

<style scoped>

.content{
  display: flex;
  flex-direction: column;
  place-content: space-between;
}

.categories{
  display: flex;
  flex-direction: row;
  height: 80%;
  width: 100%;
  overflow-y: scroll;
  gap: 20px;
}

.category{
  display: flex;
  flex-direction: column;
  height: 100%;
  aspect-ratio: 4/5;
  align-items: start;
  justify-items: center;
  place-content: center;
}

.category-name{
  height: 10%;
  width: 100%;
  text-align: center;
}

.image-background{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
  width: 100%;
  background-color: var(--color-lavendel-background);
  border-radius: var(--global-border-radius);
}

.image-background:hover{
  transform: scale(1.02);
}

.category-image{
  height: 50%;
  aspect-ratio: 1/1;
}

</style>
