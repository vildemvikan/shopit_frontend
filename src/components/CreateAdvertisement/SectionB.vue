<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n';

onMounted(() => {
  fetchCategories();
});

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'update:title', value: string): void;
  (e: 'update:description', value: string): void;
  (e: 'update:condition', value: string): void;
  (e: 'update:category', value: string): void;
  (e: 'update:subCategory', value: string): void;
  (e: 'update:tags', value: string[]): void;
}>()

enum Condition {
  New = 'NEW',
  LikeNew = 'LIKE_NEW',
  Good = 'GOOD',
  Acceptable = 'ACCEPTABLE',
  ForParts = 'FOR_PARTS'
}


const title = ref<string>('')
const description = ref<string>('')
const category = ref<string>('')
const subCategory = ref<string>('')

const categories = ref([
  { category: 'Option 1', subCategories: [
      {subCategory: 'Option 1A'},
      {subCategory: 'Option 1B'},
      {subCategory: 'Option 1C'},
      {subCategory: 'Option 1D'},
    ]},
  { category: 'Option 2', subCategories: [
      {subCategory: 'Option 2A'},
      {subCategory: 'Option 2B'},
      {subCategory: 'Option 2C'},
      {subCategory: 'Option 2D'},
    ]},
  { category: 'Option 3', subCategories: [
      {subCategory: 'Option 3A'},
      {subCategory: 'Option 3B'},
      {subCategory: 'Option 3C'},
      {subCategory: 'Option 3D'},
    ]}
])

const subCategories = computed(() => {
  const cat = categories.value.find(item => item.category === category.value)
  return cat ? cat.subCategories : []
})

const condition = ref<Condition>('')

const conditions = ref([
  {text:t('condition-new'), value: Condition.New},
  {text:t('condition-like-new'), value: Condition.LikeNew},
  {text:t('condition-good'), value: Condition.Good},
  {text:t('condition-acceptable'), value: Condition.Acceptable},
  {text:t('condition-for-parts'), value: Condition.ForParts},
])


const tag = ref<string>('')
const tags = ref<string[]>([])
function addTag(tag: string){
  tags.value.push(tag)
  emit('update:tags', tags.value)
}

function removeTag(index: number){
  tags.value.splice(index, 1)
  emit('update:tags', tags.value)
}

async function fetchCategories()

watch(title, (newTitle)=>{
  emit('update:title', newTitle)
})

watch(description, (newDescription)=>{
  console.log(newDescription)
  emit('update:description', newDescription)
})

watch(condition, (newCondition)=>{
  emit('update:condition', newCondition)
})

watch(category, (newCategory)=>{
  emit('update:category', newCategory)
  subCategory.value = ''
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
    :placeholder="$t('input-title')"
    v-model="title">

  <label>{{ $t('label-description') }}</label>
  <textarea class="description" v-model="description"></textarea>

  <label>{{$t('label-condition')}}</label>
  <select id="dropdown" v-model="condition">
    <option disabled value="">{{ $t('drop-down-category') }}</option>>
    <option v-for="condition in conditions" :key="condition.value" :value="condition.value">
      {{ condition.text }}
    </option>
  </select>

  <label>{{ $t('label-category') }}</label>
  <select id="dropdown" v-model="category">
    <option disabled value="">{{ $t('drop-down-category') }}</option>>
    <option v-for="option in categories" :key="option.category" :value="option.category">
      {{ option.category }}
    </option>
  </select>

  <label>{{ $t('label-sub-category') }}</label>
  <select id="dropdown" v-model="subCategory">
    <option disabled value="">{{ $t('drop-down-sub-category') }}</option>>
    <option v-for="option in subCategories" :key="option.subCategory" :value="option.subCategory">
      {{ option.subCategory }}
    </option>
  </select>

  <label>{{ $t('label-tag') }}</label>
  <div class="tag-button-box">
    <input
      type="text"
      v-model="tag"
      :placeholder="$t('input-tag')"
      @keydown.space.prevent>
    <button class="add-tag-button"
            :disabled="!tag"
            @click="addTag(tag)">
      {{$t('button-tag') }}
    </button>
  </div>

  <div class="tags">
    <div
      v-for="(tag, index) in tags"
      :key="index"
      class="tag">
      {{tag}}
      <img
        src="@/assets/icons/exit.svg"
        class="delete-tag"
        alt="delete tag"
        @click="removeTag(index)">
    </div>
  </div>

</template>

<style scoped>

.tags{
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.tag{
  display: inline-flex;
  width: auto;
  background-color: var(--color-purple-button);
  color: var(--color-white-text);

  border-radius: var(--global-border-radius);
  box-shadow: var(--global-box-shaddow);

  padding: 4px;
  gap: 2px;

  align-items: center;
}

.delete-tag{
  max-height: 1.5vh;
}

.delete-tag:hover{
  transform: scale(1.05);
}



</style>
