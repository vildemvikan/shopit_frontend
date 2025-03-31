<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n';
import {fetchCategories} from '../../../utils/CreateAdvertisement.ts'
import { useAdvertisementStore } from '@/stores/advertisementStore.ts'

const { t } = useI18n();
const advertisementStore = useAdvertisementStore()

const props = defineProps<{
  title: string;
  description: string;
  condition: Condition|string;
  category: number|string;
  subCategory: number|string;
  tags: string[]
  titleError: boolean;
  descriptionError: boolean;
  conditionError: boolean;
  categoryError: boolean;
  subCategoryError: boolean;
}>()


onMounted(() => {
  fetchCategoriesAndSubCategories();

  title.value = props.title
  description.value = props.description
  condition.value = props.condition
  category.value = props.category
  subCategory.value = props.subCategory
  tags.value = props.tags
});


const emit = defineEmits<{
  (e: 'update:title', value: string): void;
  (e: 'update:description', value: string): void;
  (e: 'update:condition', value: string|Condition): void;
  (e: 'update:category', value: string|number): void;
  (e: 'update:subCategory', value: string|number): void;
  (e: 'update:tags', value: string[]): void;
}>()
enum Condition {
  New = 'NEW',
  LikeNew = 'LIKE_NEW',
  Good = 'GOOD',
  Acceptable = 'ACCEPTABLE',
  ForParts = 'FOR_PARTS'
}

interface Category{
  id: number,
  name:string,
  subcategories: []
}

interface SubCategory{
  id:number,
  name: string
}


const title = ref<string>('')
const description = ref<string>('')
const condition = ref<Condition|string>('')
const category = ref<number|string>('')
const subCategory = ref<number|string>('')

const categories = ref<Category[]>([])

const subCategories = computed(() => {
  const cat = categories.value.find(item => item.id === category.value)
  return cat ? cat.subcategories : []
})

const conditions = ref([
  {text:t('condition-new'), value: Condition.New},
  {text:t('condition-like-new'), value: Condition.LikeNew},
  {text:t('condition-good'), value: Condition.Good},
  {text:t('condition-acceptable'), value: Condition.Acceptable},
  {text:t('condition-for-parts'), value: Condition.ForParts},
])


const tag = ref<string>('')
const tags = ref<string[]>([])
function addTag(){
  tags.value.push(tag.value)
  emit('update:tags', tags.value)
  tag.value = ''
}

function removeTag(index: number){
  tags.value.splice(index, 1)
  emit('update:tags', tags.value)
}

async function fetchCategoriesAndSubCategories(){
  try {
    categories.value = await fetchCategories()
  } catch (error){
    console.error(error)
  }
}

watch(title, (newTitle)=>{
  emit('update:title', newTitle)
})

watch(description, (newDescription)=>{
  emit('update:description', newDescription)
})

watch(condition, (newCondition)=>{
  emit('update:condition', newCondition)
})

watch(category, (newCategory)=>{
  emit('update:category', newCategory)
})

watch(subCategory, (newSubCategory)=>{
  emit('update:subCategory', newSubCategory)
})

</script>

<template>
  <label>{{ $t('label-title') }}</label>
  <input
    type="text"
    class="title-input"
    :class="{'error':titleError}"
    :placeholder="$t('input-title')"
    v-model="title">
  <small v-if="titleError" class="error-message">{{$t('title-error')}}</small>

  <label>{{ $t('label-description') }}</label>
  <textarea
    class="description"
    :class="{'error':descriptionError}"
    :placeholder="$t('input-description')"
    v-model="description"></textarea>
  <small v-if="descriptionError" class="error-message">{{$t('description-error')}}</small>

  <label>{{$t('label-condition')}}</label>
  <select id="dropdown" :class="{'error':conditionError}" v-model="condition">
    <option disabled value="">{{ $t('drop-down-category') }}</option>>
    <option v-for="condition in conditions" :key="condition.value" :value="condition.value">
      {{ condition.text }}
    </option>
  </select>
  <small v-if="conditionError" class="error-message">{{$t('condition-error')}}</small>

  <label>{{ $t('label-category') }}</label>
  <select id="dropdown" :class="{'error':categoryError}" v-model="category">
    <option disabled value="">{{ $t('drop-down-category') }}</option>>
    <option v-for="option in categories" :key="option.id" :value="option.id">
      {{ option.name }}
    </option>
  </select>
  <small v-if="categoryError" class="error-message">{{$t('category-error')}}</small>

  <label>{{ $t('label-sub-category') }}</label>
  <select id="dropdown" :class="{'error':subCategoryError}" v-model="subCategory">
    <option disabled value="">{{ $t('drop-down-sub-category') }}</option>>
    <option v-for="option in subCategories" :key="option.id" :value="option.id">
      {{ option.name }}
    </option>
  </select>
  <small v-if="subCategoryError" class="error-message">{{$t('sub-category-error')}}</small>

  <label>{{ $t('label-tag') }}</label>
  <div class="tag-button-box">
    <input
      type="text"
      v-model="tag"
      :placeholder="$t('input-tag')"
      class="tag-input"
      @keydown.space.prevent>
    <button class="add-tag-button"
            :disabled="!tag"
            @click="addTag()">
      {{$t('button-tag') }}
    </button>
  </div>

  <div class="tags">
    <div
      v-for="(tag, index) in tags"
      :key="index"
      class="tag">
      <label>{{tag}}</label>
      <img
        src="@/assets/icons/exit.svg"
        class="delete-tag"
        alt="delete tag"
        @click="removeTag(index)">
    </div>
  </div>

</template>

<style scoped>

.title-input{
  width: 100%;
  height: 5vh;
  min-height: 35px;
  border-radius: calc(var(--global-border-radius)/2);
}

.description{
  height: 15vh;
  min-height: 100px;
  border-radius: calc(var(--global-border-radius)/2);
}

.tag-button-box{
  height: 4vh;
  min-height: 30px;
}

.tag-input{
  height: 100%;
  border-radius: calc(var(--global-border-radius)/2);
}

.add-tag-button{
  height: 100%;
}

.tags{
  display: flex;
  flex-direction: row;
  gap: 10px;
}

#dropdown{
  height: 5vh;
  min-height: 35px;
  border-radius: calc(var(--global-border-radius)/2);
}

.tag{
  display: inline-flex;
  width: auto;
  background-color: var(--color-purple-button);
  color: var(--color-white-text);

  border-radius: calc(var(--global-border-radius)/2);
  box-shadow: var(--global-box-shaddow);
  padding: 4px;
  gap: 2px;
  align-items: center;
}

.delete-tag{
  max-height: 1.5vh;
  cursor: pointer;
}





</style>
