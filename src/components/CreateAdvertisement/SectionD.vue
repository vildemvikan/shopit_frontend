<script setup lang="ts">
import { ref, watch } from 'vue'
import { fetchPostalCodeInfo } from '/utils/CreateAdvertisement.ts'
import { PostalCodeInfo } from '@/interfaces/interfaces.ts'

const emit = defineEmits<{
  (e: 'update:postalNumber', value: number|null): void;
}>()


const postNumber = ref<string|null>(null)
const city = ref<string|null>('')

function sanitizePostalNumberInput(e: Event) {
  const input = e.target as HTMLInputElement;
  input.value = input.value.replace(/\D/g, '');
  postNumber.value = input.value;
}

async function fetchPostNumberInformation(postCode: string) {

  if (postCode.length === 4) {
    try {
      const info: PostalCodeInfo = await fetchPostalCodeInfo(postCode);
      if (info.valid){
        city.value = info.result
        emit('update:postalNumber', Number(postCode))
      } else {
        city.value = null
      }
    } catch (error) {
      console.error('Failed to fetch postal code information:', error);
      city.value = null
    }
  }
}

watch(postNumber, (newVal) => {
  if (newVal.length === 4) {
    fetchPostNumberInformation(newVal);
  } else {
    city.value = null;
    emit('update:postalNumber', null)
  }
});

</script>

<template>
  <h3>{{ $t('label-shipping') }}</h3>
  <label>{{ $t('label-post-number') }}</label>
  <div class="post-number-box">
    <input type="text"
           v-model="postNumber"
           @input="sanitizePostalNumberInput"
           maxlength="4">
    <label>{{city}}</label>
  </div>


</template>

<style scoped>
.post-number-box{
  display: flex;
  flex-direction: row;
  gap: 10px;
}

</style>
