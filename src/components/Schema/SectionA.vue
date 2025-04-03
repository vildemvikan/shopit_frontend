<script setup lang="ts">

import { onMounted, ref, watch } from 'vue'

onMounted(() => {
  forSale.value = props.forSale
  images.value = props.images
});

const emit = defineEmits<{
  (e: 'update:forSale', value: boolean): void;
  (e: 'update:images', value: Image[]): void;
}>()

const props = defineProps<{
  forSale: boolean
  images: Image[]
  imagesError: boolean;
}>()

interface Image{
  url: string,
  caption: string
  publicId: number|null
}
const forSale = ref(true)
const images = ref<Image[]>([])

const fileInput = ref<HTMLInputElement | null>(null)

function activateInput(){
  fileInput.value?.click()
}

function moveImageUp(index: number){
  if(index <= 0) return;
  [images.value[index - 1], images.value[index]] = [images.value[index], images.value[index - 1]];
  emit('update:images', images.value);
}

function moveImageDown(index: number){
  if(index >= images.value.length - 1) return;
  [images.value[index + 1], images.value[index]] = [images.value[index], images.value[index + 1]];
  emit('update:images', images.value);
}

function deleteImage(index: number){
  images.value.splice(index, 1);
  emit('update:images', images.value);
}

function addImage(event: Event){
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      images.value.push({
        url: e.target?.result as string,
        caption: '',
        publicId: null
      })
      emit('update:images', images.value);
    }
    reader.readAsDataURL(file)
  }
  // Reset the input so the same file can be re-selected if needed
  target.value = ''
}

function updateDescription(){
  emit('update:images', images.value)
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
      <div class="image-adjustment-box">
        <div class="adjustments">
          <button class="adjustment-button" @click="moveImageUp(index)">
            <img src="@/assets/icons/up.svg" alt="Move up" class="adjustment-icon" id="up">
          </button>
          <button class="adjustment-button" @click="moveImageDown(index)">
            <img src="@/assets/icons/up.svg" alt="Move down" class="adjustment-icon" id="down">
          </button>
        </div>
        <img class="image" :src="image.url" alt="Uploaded Image">

      </div>
      <div class="description-box">
        <button class="delete-image" @click="deleteImage(index)">
          <img src="@/assets/icons/delete.svg" class="delete-icon" alt="Delete image">
          <label>{{$t('label-delete')}}</label>
        </button>
        <textarea
          class="image-description"
          v-model="image.caption"
          @input="updateDescription"
          placeholder="Enter description"></textarea>
      </div>
    </div>


    <input type="file"
           accept="image/*"
           ref="fileInput"
           @change="addImage"
           style="display: none;" />

    <button class="add-image-button"
            :class="{'error':imagesError}"
            @click="activateInput"
            :disabled="images.length > 4">{{ $t('button-images') }}</button>
    <small v-if="imagesError" class="error-message">{{$t('images-error')}}</small>
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
  border-top-left-radius: calc(var(--global-border-radius)/2);
  border-bottom-left-radius:calc(var(--global-border-radius)/2);
}

#right-type-button{
  border-top-right-radius: calc(var(--global-border-radius)/2);
  border-bottom-right-radius: calc(var(--global-border-radius)/2);
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
  place-items: center;
  width: 100%;
  aspect-ratio: 4;
  gap: 5px;
}

.image-adjustment-box{
  display: flex;
  flex-direction: row;
  width: 30%;
}

.adjustments{
  display: flex;
  flex-direction: column;
  max-height: 100%;
  width: 10%;
}

.adjustment-button{
  height: 50%;
  max-width: 100%;
  background-color: transparent;
  border: none;
  border-radius: calc(var(--global-border-radius)/2);
}

.adjustment-button:hover{
  background-color: var(--color-grey-button);
}

.adjustment-button:active{
  background-color: var(--color-lavendel-button);
}
.adjustment-icon{
  max-height: 50%;
  max-width: 100%;
}

#down{
  transform: rotate(180deg);
}

.image{
  width: 90%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: calc(var(--global-border-radius)/2);
}

.description-box{
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100%;
  place-items: flex-end;
  place-content: center;
}

.delete-image{
  display: flex;
  flex-direction: row;

  place-content: center;
  place-items: center;

  background-color: transparent;
  border: none;
}

.delete-icon{
  max-width: 15px;
  max-height: 15px;
}

.delete-image:hover{
  transform: scale(1.05);
}

.image-description{
  width: 100%;
  height: 50%;

  border-radius: calc(var(--global-border-radius)/2);
}

.add-image-button{
  border-radius: calc(var(--global-border-radius)/2);
  width: 30%;
  height: var(--global-button-height);
  min-height: var(--global-button-min-height);

  background-color: var(--color-black-button);
  color: var(--color-white-text);
}

.add-image-button:disabled {
  pointer-events: none;
  cursor: not-allowed;
  opacity: 0.6; /* Optional: to give a more "disabled" look */
}


@media (max-width: 800px) {
  .type-buttons {
    width: 100%;
  }

  .image-adjustment-box{
    width: 40%;
  }

  .description-box{
    width: 60%;
  }
}

</style>
