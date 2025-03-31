<script setup lang="ts">
import { ref } from 'vue'
import SectionA from '@/components/CreateAdvertisement/SectionA.vue'
import SectionB from '@/components/CreateAdvertisement/SectionB.vue'
import SectionD from '@/components/CreateAdvertisement/SectionD.vue'
import SectionC from '@/components/CreateAdvertisement/SectionC.vue'
import type { Image } from '@/interfaces/interfaces.ts'


export enum PaymentMethod {
  Direct = 'DIRECT',
  Auction = 'AUCTION',
  None = 'NONE'
}

enum Condition {
  New = 'NEW',
  LikeNew = 'LIKE_NEW',
  Good = 'GOOD',
  Acceptable = 'ACCEPTABLE',
  ForParts = 'FOR_PARTS'
}

const title = ref<string>('');
const description = ref<string>('');
const condition = ref<Condition|null>(null)
const category = ref<string>('');
const subCategory = ref<string>('');
const tags = ref<string[] | null>(null);

const images = ref<Image[] | null>(null);

const forSale = ref<boolean>(true)
const payment = ref<PaymentMethod>(PaymentMethod.None);

const price = ref<number>(0);
const postalNumber = ref<number | null>(null);


function updateImages(newImageList: Image[]){
  images.value = newImageList
  console.log(images.value)
}

function updateTitle(newTitle: string) {
  title.value = newTitle;
  console.log(title.value)
}

function updateDescription(newDescription: string) {
  description.value = newDescription;
  console.log(description.value)
}

function updateCondition(newCondition: Condition){
  condition.value = newCondition;
  console.log(condition.value)
}

function updateCategory(newCategory: string) {
  category.value = newCategory;
  console.log(category.value)
}

function updateSubCategory(newSubCategory: string) {
  subCategory.value = newSubCategory;
  console.log(subCategory.value)
}
function updateTags(newTagList: string[]){
  tags.value = newTagList;
  console.log(tags.value);
}
function updateForSale(newStatus: boolean){
  forSale.value = newStatus
  console.log(forSale.value)
}
function updatePrice(newPrice: number){
  price.value = newPrice
  console.log(price.value)
}
function updatePayment(newPaymentMethod: PaymentMethod){
  payment.value = newPaymentMethod
  console.log(payment.value)
}
function updatePostalNumber(newPostalNumber: string|null){
  postalNumber.value = newPostalNumber
  console.log(postalNumber.value)
}

</script>

<template>

  <h2>{{ $t('create-advertisement') }}</h2>

  <div class="sections">
    <div class="section">
      <SectionA
        @update:forSale="updateForSale"
        @update:images="updateImages"/>
    </div>
    <div class="section">
      <SectionB
        @update:title="updateTitle"
        @update:description="updateDescription"
        @update:condition="updateCondition"
        @update:category="updateCategory"
        @update:subCategory="updateSubCategory"
        @update:tags="updateTags"
      />
    </div>
    <div class="section">
      <SectionC
        @update:price="updatePrice"
        @update:payment="updatePayment"/>
    </div>
    <div class="section">
      <SectionD
      @update:postalNumber="updatePostalNumber"/>
    </div>
  </div>

</template>

<style scoped>

.sections{
  display: flex;
  flex-direction: column;
  gap: 2vh;
}

.section{
  display: flex;
  flex-direction: column;
  width: 100%;


  background-color: var(--color-lavendel-background);
  padding: 3.5%;

  gap: 10px;



  border-radius: var(--global-border-radius);
}

</style>
