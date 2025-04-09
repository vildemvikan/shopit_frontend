<script setup lang="ts">
import { ref } from 'vue'
import SectionA from '@/components/Schema/SectionA.vue'
import SectionB from '@/components/Schema/SectionB.vue'
import SectionD from '@/components/Schema/SectionD.vue'
import SectionC from '@/components/Schema/SectionC.vue'
import { useAdvertisementStore } from '@/stores/advertisementStore.ts'
import {
  createAdvertisement,
  fetchAdvertisement,
  updateAdvertisement
} from '../../utils/Advertisement.ts'
import router from '@/router'

const advertisementStore = useAdvertisementStore()

const props = defineProps<{
  new: boolean;
  preview: boolean;
  id: string|null;
  advertisement: any|null;
}>()

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

enum Status{
  Inactive = 'INACTIVE',
  Active = 'ACTIVE',
  Sold = 'SOLD'
}

interface Image{
  url: string,
  caption: string
  publicId: number|null
}

const title = ref<string>(
  props.new ? advertisementStore.title : props.advertisement?.name || ''
);
const description = ref<string>(
  props.new ? advertisementStore.description : props.advertisement?.description || ''
);
const condition = ref<Condition | string>(
  props.new ? advertisementStore.condition : props.advertisement?.condition || ''
);
const category = ref<string | number>(
  props.new ? advertisementStore.category : props.advertisement?.categoryId || ''
);
const subCategory = ref<string | number>(
  props.new ? advertisementStore.subCategory : props.advertisement?.subCategoryId || ''
);
const tags = ref<string[] | null>(
  props.new ? advertisementStore.tags : props.advertisement?.tags || null
);
const images = ref<Image[]>(
  props.new ? advertisementStore.images : props.advertisement?.images || []
);
const forSale = ref<boolean>(
  props.new ? advertisementStore.forSale : props.advertisement?.forSale ?? true
);
const payment = ref<PaymentMethod>(
  props.new ? advertisementStore.payment : props.advertisement?.listingType|| PaymentMethod.None
);
const price = ref<number>(
  props.new ? advertisementStore.price : props.advertisement?.price || 0
);
const postalNumber = ref<string>(
  props.new ? advertisementStore.postalNumber : props.advertisement?.location.postalCode|| ''
);

const titleError = ref<boolean>(false)
const descriptionError = ref<boolean>(false)
const conditionError = ref<boolean>(false)
const categoryError= ref<boolean>(false)
const subCategoryError = ref<boolean>(false)
const imagesError= ref<boolean>(false)
const priceError = ref<boolean>(false)
const postalNumberError = ref<boolean>(false)

function titleCheck(){
  titleError.value = title.value == ''
}
function descriptionCheck(){
  descriptionError.value = description.value == ''
}
function conditionCheck(){
  conditionError.value = condition.value == ''
}
function categoryCheck() {
  categoryError.value = category.value == ''
}
function subCategoryCheck() {
  subCategoryError.value = subCategory.value == ''
}
function imagesCheck() {
  imagesError.value = images.value.length == 0
}

function priceCheck() {
  priceError.value = forSale.value && price.value === 0;
}

function postalNumberCheck() {
  postalNumberError.value = !postalNumber.value;
}


function validateInput() {
  titleCheck();
  descriptionCheck();
  conditionCheck();
  categoryCheck();
  subCategoryCheck();
  imagesCheck();
  priceCheck();
  postalNumberCheck();

  return (
    titleError.value ||
    descriptionError.value ||
    conditionError.value ||
    categoryError.value ||
    subCategoryError.value ||
    imagesError.value ||
    priceError.value ||
    postalNumberError.value
  );
}

function updateImages(newImageList: Image[]) {
  images.value = newImageList
  if(props.new){advertisementStore.updateImages(newImageList)}
  imagesCheck()
}

function updateTitle(newTitle: string) {
  title.value = newTitle
  if(props.new){advertisementStore.updateTitle(newTitle)}
  titleCheck()
}

function updateDescription(newDescription: string) {
  description.value = newDescription
  if(props.new){advertisementStore.updateDescription(newDescription)}
  descriptionCheck()
}

function updateCondition(newCondition: Condition) {
  condition.value = newCondition;
  if(props.new){advertisementStore.updateCondition(newCondition)}
  conditionCheck()
}

function updateCategory(newCategory: number | string) {
  category.value = newCategory;
  if(props.new){advertisementStore.updateCategory(newCategory)}
  categoryCheck()
}

function updateSubCategory(newSubCategory: number | string) {
  subCategory.value = newSubCategory;
  if(props.new){advertisementStore.updateSubCategory(newSubCategory)}
  subCategoryCheck()
}

function updateTags(newTagList: string[]) {
  tags.value = newTagList;
  if(props.new){advertisementStore.updateTags(newTagList)}
}

function updateForSale(newStatus: boolean) {
  forSale.value = newStatus
  if(!newStatus){
    price.value = 0
    payment.value = PaymentMethod.None
  }
  if(props.new){advertisementStore.updateForSale(newStatus)}
}

function updatePrice(newPrice: number) {
  price.value = newPrice
  if(props.new){advertisementStore.updatePrice(newPrice)}
  priceCheck()
}

function updatePayment(newPaymentMethod: PaymentMethod) {
  payment.value = newPaymentMethod
  if(props.new){advertisementStore.updatePayment(newPaymentMethod)}
}

function updatePostalNumber(newPostalNumber: string) {
  postalNumber.value = newPostalNumber
  if(props.new){advertisementStore.updatePostalNumber(newPostalNumber)}
  postalNumberCheck()
}

function discardChanges(){
  window.location.reload();
}

async function saveDraft() {
  const valid = validateInput()
  if (valid) {
    const body = buildJSONBody(Status.Inactive)
    try {
      await createAdvertisement(body)
      await router.push('profile')
    } catch (error) {
      console.log(error)
    }
  }
}

async function publish() {
  const invalid = validateInput();
  if (!invalid) {
    const body = buildJSONBody(Status.Inactive)
    try {
      await createAdvertisement(body)
      await router.push('profile')
    } catch (error) {
      console.log(error)
    }
  }
}

async function commitChanges(){
  const invalid = validateInput();
  console.log(invalid)
  if(!invalid){
    const body = buildJSONBody(Status.Active)
    try{
      await updateAdvertisement(body, props.id);
      await router.push(`/advertisement/${props.id}`)
    } catch (error){
      console.log(error)
    }
  }
}

function preview() {
  if (validateInput()) {
  }
}

function buildJSONBody(status: Status) {
  const body = {
    itemName: title.value,
    description: description.value,
    price: price.value,
    tags: tags.value,
    postalCode: postalNumber.value,
    subcategoryId: subCategory.value,
    listingType: payment.value,
    condition: condition.value,
    status: status,
    forSale: forSale.value,
    images: images.value
  };

  return JSON.stringify(body);
}

</script>

<template>

  <div class="sections">
    <div class="section">
      <SectionA
        @update:forSale="updateForSale"
        @update:images="updateImages"
        :for-sale="forSale"
        :images="images"
        :images-error="imagesError"/>
    </div>
    <div class="section">
      <SectionB
        @update:title="updateTitle"
        @update:description="updateDescription"
        @update:condition="updateCondition"
        @update:category="updateCategory"
        @update:subCategory="updateSubCategory"
        @update:tags="updateTags"
        :title="title"
        :description="description"
        :condition="condition"
        :category="category"
        :sub-category="subCategory"
        :tags="tags"
        :title-error="titleError"
        :description-error="descriptionError"
        :condition-error="conditionError"
        :category-error="categoryError"
        :sub-category-error="subCategoryError"
      />
    </div>
    <div class="section" v-if="forSale">
      <SectionC
        @update:price="updatePrice"
        @update:payment="updatePayment"
        :payment="payment"
        :price="price"
        :price-error="priceError"
      />
    </div>
    <div class="section">
      <SectionD
        @update:postalNumber="updatePostalNumber"
        :postal-number="postalNumber"
        :postal-number-error="postalNumberError"/>
    </div>
    <div class="button-box">
      <div class="top-button-box">
        <button
          class="top-button"
          id="preview-button"
          :disabled="!props.preview"
          @click="preview()">{{$t('button-preview')}}</button>
        <button  v-if="props.new" class="top-button" id="draft-button" @click="saveDraft()">{{$t('button-draft')}}</button>
        <button  v-else class="top-button" id="discard-button" @click="discardChanges()">{{$t('button-discard')}}</button>
      </div>
      <button v-if="props.new" class="bottom-button" id="publish-button" @click="publish()">{{$t('button-publish')}}</button>
      <button v-else class="bottom-button" id="edit-button" @click="commitChanges()">{{$t('button-edit')}}</button>
    </div>
  </div>

</template>

<style scoped>

.sections{
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: fit-content;
  gap: 2vh;
  background-color: var(--color-lavendel-background);
  place-items: center;
  padding: 2vh 20vh 2ch  20vh;
  border-radius: var(--global-border-radius);
}

.section{
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  padding: 3.5%;
  gap: 10px;
  border-radius: var(--global-border-radius);
}


button{
  height: 5vh;
  min-height: 35px;
}

.button-box{
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
}

.top-button-box{
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 5px;
}

.top-button{
  width: 50%;
  border-radius: calc(var(--global-border-radius)/2);
}

#discard-button{
  background-color: var(--color-gray-button);
}

.bottom-button{
  width: 100%;
  background-color: var(--color-black-button);
  color: var(--color-white-text);
  border-radius: calc(var(--global-border-radius)/2);
}


@media (max-width: 1000px){
  .sections{
    padding: 2vh;
  }
}

</style>
