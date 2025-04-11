<script setup lang="ts">

import { nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
onMounted( async () => {
  console.log(props.keyWord);
  searchString.value = props.search
})

const props = defineProps<{
  search:String
}>()

const searchString = ref<string>('')

watch(() => props.search, (newSearch) => {
  searchString.value = newSearch
}, { immediate: true }); // Ensure it runs on mount as well


const emit = defineEmits(['updateKeyword'])

function emitKeyWord(){
  emit('updateKeyword', searchString.value)
}
</script>

<template>
  <div class="simple-search">
    <div class="search-bar">
      <img src="@/assets/icons/search.svg" class="inv-icon" alt="search">
      <input
        class="search-input"
        :placeholder="t('label-search')"
        type="text"
        v-model="searchString">
    </div>
    <button class="search-button" @click="emitKeyWord" data-cy="simple-search-button">
      <label>{{$t('button-search')}}</label>
    </button>
  </div>


</template>

<style scoped>
.simple-search{
  display: flex;
  flex-direction: row;
  place-content: center;
  gap: 10px;
  width: 100%;
  height: 100%;

}

.search-bar{
  position: relative;
  display: flex;
  flex-direction: row;
  width: 90%;
  height: 100%;
  align-items: center;
  border: var(--global-border-size) solid;
  border-radius: calc(var(--global-border-radius)/2);
}

.inv-icon{
  height: 60%;
  margin: 10px;
}

.search-input{
  width: 100%;
  height: 90%;
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

.search-button{
  width: 10%;
}

</style>
