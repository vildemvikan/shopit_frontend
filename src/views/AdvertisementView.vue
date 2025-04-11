<script setup lang="ts">
import ImageBox from '@/components/Advertisement/ImageCarousel.vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchAdvertisement, fetchCategories } from '../../utils/Advertisement.ts'
import Info from '@/components/Advertisement/Info.vue'
import router from '@/router'
import type { Advertisement } from '@/interfaces/interfaces.ts'

const route = useRoute()
const id = route.params.id as string

const advertisement = ref<Advertisement|null>(null)

onMounted(async () => {
  try {
    advertisement.value = await fetchAdvertisement(id)
    console.log('Fetched advertisement:', advertisement.value)
  } catch (error) {
    console.error('Error fetching advertisement:', error)
  }
})

async function toProfile(){
  await router.push('/profile')
}

async function goToCategory(){
  await router.push({name: 'search', query: {category: advertisement.value?.categoryId}})
}

async function goToSubCategory(){
  await router.push({name: 'search', query: {subCategory: advertisement.value?.subCategoryId}})
}


</script>

<template>
  <div class="advertisement" v-if="advertisement">
    <div class="item-path">
      <label
        v-if="advertisement.isOwner"
        class="route-label"
        id="back-to"
        @click="toProfile()">
        <img class="inv-icon" src="@/assets/icons/back.svg" alt="Back to profile">
        {{$t('label-back-to-profile')}}
        &nbsp;</label>
      <label class="route-label" id="category" @click="goToCategory">{{advertisement.categoryName}}</label>
      /
      <label class="route-label" id="category" @click="goToSubCategory">{{advertisement.subCategoryName}}</label>
    </div>

    <div class="content">
      <div class="image-carousel">
        <image-box
          :id="advertisement.id"
          :images="advertisement.images"
          :status="advertisement.status"
          :is-bookmarked="advertisement.isBookmarked"
          :is-owner="advertisement.isOwner"
        />
      </div>
      <div class="info">
        <Info
          :owner="advertisement.isOwner"
          :description="advertisement.description"
          :title="advertisement.name"
          :for-sale="advertisement.forSale"
          :postal-code="advertisement.location.postalCode"
          :location="advertisement.location"
          :price="advertisement.price"
          :payment="advertisement.listingType"
          :condition="advertisement.condition"
          :tags="advertisement.tags"
          :seller="advertisement.sellerFullName"
          :advertisement-id="advertisement.id"
          :status="advertisement.status"
          :seller-picture="advertisement.sellerPicture"
        />
      </div>
    </div>
  </div>

</template>

<style scoped>

.advertisement{
  width: 100%;
  height: 100%;
}

.item-path{
  display: flex;
  flex-direction: row;
  height: 5%;
  gap: 10px;
  place-items: center;
}

.route-label{
  cursor: pointer;
}

.route-label:hover{
  text-decoration: underline;
}

.inv-icon{
  height: 1em;
}

#back-to{
  display: flex;
  flex-direction: row;
  font-weight: bold;
  place-items: center;

}

#category{
  color: var(--color-dark-orange-text);
}

.content{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 95%;
  gap: 10px;
}

.image-carousel{
  display: flex;
  flex-direction: row;
  width: 60%;
  max-height: 95%;
  aspect-ratio: 1/1;
  gap: 10px;
}

.info{
  display: flex;
  flex-direction: column;
  width: 40%;
  max-height: 95%;
  gap: 15px;
  overflow-y: scroll;
  padding-right: 10px;
}


@media (max-width: 1000px){

  .advertisement{
    height: fit-content;
  }
  .content{
    display: flex;
    flex-direction: column;
    height: fit-content;
  }

  .image-carousel{
   display: flex;
   flex-direction: column-reverse;
   align-items: center;
   height: fit-content;
   overflow: visible;
   width: 100%;
 }

  .info{
    width: 100%;
    height: fit-content;
    overflow: visible;
  }
}
</style>
