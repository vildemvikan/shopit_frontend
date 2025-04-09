<script setup lang="ts">

import { onMounted, ref } from 'vue'
import {DisplayAdvertisement} from '@/interfaces/interfaces.ts'
import { fetchNewestAdvertisements } from '../../../utils/Advertisement.ts'
import AdvertisementPreview from '@/components/AdvertisementPreviewBox.vue'

const SIZE = 5
const advertisements = ref<DisplayAdvertisement[]>([])

async function loadAdvertisements(){
  try{
    const result = await fetchNewestAdvertisements(SIZE)
    advertisements.value = result.content
  }catch (error){
    console.error(error)
  }
}

onMounted(async () => {
  await loadAdvertisements()
})

</script>

<template>
  <div class="content">
    <h2 class="title">{{$t('title-new-advertisements')}}</h2>
    <div class="advertisements">
      <div class="new-advertisement" v-for="advertisement in advertisements">
        <AdvertisementPreview
          :id="advertisement.id"
          :title="advertisement.name"
          :date="advertisement.publishedAt"
          :image="advertisement.images[0].url"
          :city="advertisement.location.city"
          :price="advertisement.price"
          :status="advertisement.status"
          :is-bookmarked="advertisement.isBookmarked"
        />
      </div>
    </div>
  </div>

</template>

<style scoped>

.content{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 10px;
  place-content: space-between;
}

.advertisements{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 85%;
  gap: 20px;
  overflow-x: scroll;
}

.new-advertisement{
  height: 90%;
  aspect-ratio: 4/5;
}

</style>
