<script setup lang="ts">
import ImageBox from '@/components/Advertisement/ImageCarousel.vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchAdvertisement, fetchCategories } from '../../utils/Advertisement.ts'
import Info from '@/components/Advertisement/Info.vue'
import router from '@/router'

interface Image {
  url: string,
  caption: string,
  publicId: number | null
}

interface Category {
  id: number,
  name: string,
  subcategories: any[]
}

enum PaymentMethod {
  Direct = 'DIRECT',
  Auction = 'BID',
  None = 'CONTACT'
}

enum Condition {
  New = 'NEW',
  LikeNew = 'LIKE_NEW',
  Good = 'GOOD',
  Acceptable = 'ACCEPTABLE',
  ForParts = 'FOR_PARTS'
}

const route = useRoute()
const id = route.params.id as string

// Create reactive refs for categories and advertisement
const advertisement = ref<any>(null)

// Local reactive variables for advertisement fields
const title = ref<string>('')
const description = ref<string>('')
const condition = ref<string>('')
const category = ref<[string, number] | number>(['', 0])
const subCategory = ref<[string, number] | number>(['', 0])
const tags = ref<string[] | null>(null)
const images = ref<Image[]>([])
const forSale = ref<boolean>(true)
const payment = ref<string>('')
const price = ref<number>(0)
const postalNumber = ref<string>('')
const city = ref<string>('')
const seller = ref<string>('')
const status = ref<Status>()

const owner = ref<boolean>(true)

onMounted(async () => {
  try {
    advertisement.value = await fetchAdvertisement(id)
    console.log('Fetched advertisement:', advertisement.value)
  } catch (error) {
    console.error('Error fetching advertisement:', error)
  }
})

// Watch for changes in the fetched advertisement data and update local fields accordingly.
watch(advertisement, (newAd) => {
  if (newAd) {
    title.value = newAd.name || ''
    description.value = newAd.description || ''
    condition.value = newAd.condition || ''
    category.value = [newAd.categoryId, newAd.categoryName]
    subCategory.value = [newAd.subCategoryId, newAd.subCategoryName]
    tags.value = newAd.tags || null
    images.value = newAd.images || []
    forSale.value = newAd.forSale ?? true
    payment.value =  newAd.listingType|| 'NONE';
    price.value = newAd.price || 0
    postalNumber.value = newAd.location?.postalCode || ''
    city.value = newAd.location?.city || ''
    seller.value = newAd.sellerFullName||''
    status.value = newAd.status || ''
  }
})

function toProfile(){
  router.push('/profile')
}
</script>

<template>
  <div class="item-path">
    <label
      v-if="owner"
      class="route-label"
      id="back-to"
      @click="toProfile()">
      <img class="label-icon" src="@/assets/icons/back.svg" alt="Back to profile">
      {{$t('label-back-to-profile')}}
      &nbsp;</label>
    <label class="route-label" id="category">{{category[1]}}</label>
    /
    <label class="route-label" id="category">{{subCategory[1]}}</label>
  </div>

  <div class="content">
    <div class="image-carousel">
      <image-box :images="images" :status="status"/>
    </div>
    <div class="info">
      <Info
        :owner="false"
        :description="description"
        :title="title"
        :for-sale="forSale"
        :postal-code="postalNumber"
        :city="city"
        :price="price"
        :payment="payment"
        :condition="condition"
        :tags="tags"
        :seller="seller"
        :advertisement-id="id"
        :status="status"
      />
    </div>
  </div>
</template>

<style scoped>

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

.label-icon{
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
