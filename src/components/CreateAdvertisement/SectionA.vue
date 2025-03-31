<script setup lang="ts">

import { ref, watch } from 'vue'
import type { Image } from '@/interfaces/interfaces.ts'

const emit = defineEmits<{
  (e: 'update:forSale', value: boolean): void;
  (e: 'update:images', value: Image[]): void;
}>()

const forSale = ref(true)

const fileInput = ref<HTMLInputElement | null>(null)

const images = ref<Image[]>([])

function activateInput(){
  fileInput.value?.click()
}

function addImage(event: Event){
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      // Push an object with both src and description (initially empty)
      images.value.push({
        src: e.target?.result as string,
        description: ''
      })
    }
    reader.readAsDataURL(file)
  }
  // Reset the input so the same file can be re-selected if needed
  target.value = ''
}

watch(forSale, (newValue)=>{
  emit('update:forSale', newValue)
})

</script>

<template>
  <label>{{ $t('label-type') }}</label>
  <div class="type-buttons">
    <button class="type-button"
            :class="{active: forSale}"
            id="left-type-button"
            @click="forSale = true">{{ $t('button-type-sell') }}</button>
    <button class="type-button"
            :class="{active: !forSale}"
            id="right-type-button"
            @click="forSale = false">{{ $t('button-type-free') }}</button>
  </div>

  <div class="images">

    <label>{{ $t('label-images') }}</label>

    <div class="image-box" v-for="(image, index) in images" :key="index">
      <div class="adjustments">

      </div>
      <img class="image" :src="image.src" alt="Uploaded Image">
      <textarea class="image-description" v-model="image.description" placeholder="Enter description"></textarea>
    </div>


    <input type="file"
           accept="image/*"
           ref="fileInput"
           @change="addImage"
           style="display: none;" />

    <button class="add-image-button" @click="activateInput">{{ $t('button-images') }}</button>
  </div>

</template>

<style scoped>

.type-buttons{
  display: flex;
  flex-direction: row;

  width: 30%;
  height: var(--global-button-height);
  min-height: var(--global-button-min-height);
}

.type-button{
  width: 50%;
  background-color: white;
  box-shadow: var(--global-box-shaddow);
}

.type-button.active{
  background-color: var(--color-black-button);
  color: var(--color-white-text);
}

#left-type-button{
  border-top-left-radius: var(--global-border-radius);
  border-bottom-left-radius: var(--global-border-radius);
}

#right-type-button{
  border-top-right-radius: var(--global-border-radius);
  border-bottom-right-radius: var(--global-border-radius);
}

.images{
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.image-box{
  display: flex;
  flex-direction: row;
  place-content: space-between;
  width: 100%;
  gap: 10px;
}

.adjustments{
  display: flex;
  flex-direction: column;
}

.image{
  width: 20%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: var(--global-border-radius);
}

.image-description{
  width: 70%;
}

.add-image-button{
  border-radius: var(--global-border-radius);
  width: 30%;
  height: var(--global-button-height);
  min-height: var(--global-button-min-height);

  background-color: var(--color-black-button);
  color: var(--color-white-text);
}

</style>
