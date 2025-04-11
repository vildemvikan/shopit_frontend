<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { fetchPostalCodeInfo } from '../../../utils/Advertisement.ts'
import { useAdvertisementStore } from '@/stores/advertisementStore.ts'

const advertisementStore = useAdvertisementStore()

const props = defineProps<{
  postalNumber: string
  postalNumberError: boolean;
}>()

onMounted(() => {
  postNumber.value = props.postalNumber
  fetchPostNumberInformation(postNumber.value);
});

const emit = defineEmits<{
  (e: 'update:postalNumber', value: string): void;
}>()


interface PostalCodeInfo{
  result: string,
  valid: boolean,
  postalCodeType: string
}

const postNumber = ref<string>('')
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
        emit('update:postalNumber', postCode)
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
  if (newVal && newVal.length === 4) {
    fetchPostNumberInformation(newVal);
  } else {
    city.value = null;
    emit('update:postalNumber', '')
  }
});

</script>

<template>
  <h3 class="label">{{ $t('label-shipping') }}</h3>
  <label>{{ $t('label-post-number') }}</label>
  <div class="post-number-box">
    <input type="text"
           v-model="postNumber"
           class="post-number-input"
           :class="{'error':postalNumberError}"
           :placeholder="$t('input-postal-number')"
           @input="sanitizePostalNumberInput"
           maxlength="4">
    <label>{{city}}</label>
  </div>
  <small v-if="postalNumberError" class="error-message">{{$t('postal-number-error')}}</small>



</template>

<style scoped>

H3, label{
  color: var(--color-black-text);
}
.post-number-box{
  display: flex;
  flex-direction: row;
  gap: 10px;

  height: 4vh;
  min-height: 30px;;
}

.post-number-input{
  border-radius: calc(var(--global-border-radius)/2);
}

.label{
  cursor: default;
}

</style>
