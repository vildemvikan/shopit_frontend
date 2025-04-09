<script setup lang="ts">

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import {changeStatus} from '../../../utils/Advertisement.ts'
import DeletePopUp from '@/components/popups/DeletePopUp.vue'
const { t } = useI18n();
enum PaymentMethod {
  Direct = 'DIRECT',
  Auction = 'BID',
  None = 'CONTACT'
}
enum Status{
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Sold = 'SOLD'
}

const props = defineProps<{
  owner: boolean
  title: string
  description: string
  forSale: boolean
  postalCode: string
  city: string
  price: string
  payment: PaymentMethod
  condition: Condition
  tags: string[]
  seller: string
  advertisementId: string
  status: Status
}>()

enum Condition {
  New = 'NEW',
  LikeNew = 'LIKE_NEW',
  Good = 'GOOD',
  Acceptable = 'ACCEPTABLE',
  ForParts = 'FOR_PARTS'
}

const conditions = ref([
  {text: t('condition-new'), value: Condition.New},
  {text: t('condition-like-new'), value: Condition.LikeNew},
  {text: t('condition-good'), value: Condition.Good},
  {text: t('condition-acceptable'), value: Condition.Acceptable},
  {text: t('condition-for-parts'), value: Condition.ForParts},
])

const conditionLabel = computed(() =>{
  const found = conditions.value.find(item => item.value === props.condition)
  return found ? found.text : ''
})

const displayDeletePopUp = ref<boolean>(false)

function contactSeller(){
  router.push('/messages')
}

function editAdvertisement(){
  router.push(`/edit-advertisement/${props.advertisementId}`)
}

async function handleStatusChange(status: Status){
  try{
    await changeStatus(status, props.advertisementId)
    await window.location.reload();
  } catch(error){
    console.error(error)
  }
}


</script>


<template>
  <DeletePopUp
    v-if="displayDeletePopUp"
    @close:delete-pop-up="displayDeletePopUp = false"
    :id="advertisementId"
    :type-delete-advertisement="true"
    :type-delete-user="false"
  />

  <H1 class="title" v-if="props.title">{{props.title}}</H1>
  <div>
    <div class="info-box" >
      <label v-if="forSale && props.status !== Status.Sold" class="for-sale-info">{{$t('button-type-sell')}}</label>
      <label v-if="!forSale && props.status !== Status.Sold" class="for-sale-info">{{$t('button-type-free')}}</label>

      <label v-if="props.status === Status.Sold" class="for-sale-info" id="sold">{{$t('label-sold')}}</label>
      <div class="location-info">
        <img src="@/assets/icons/location.svg" alt="Location" class="location-icon">
        <label class="location">{{postalCode}}, {{city}}</label>
      </div>
    </div>
    <h2 class="price" v-if="price > 0">{{price}},- NOK</h2>
    <h2 class="price" v-else>{{$t('label-free')}}</h2>
  </div>


  <div class="button-box" v-if="!owner && props.status !== Status.Sold">
    <button
      v-if="props.payment == PaymentMethod.Auction"
      class="button" id="blue-button" >
      <label class="button-label">{{$t('button-auction')}}</label>
    </button>
    <button
      v-if="props.payment == PaymentMethod.Direct"
      class="button"
      id="orange-button">
      <label class="button-label" id="orange-button-label">{{$t('button-vipps')}}</label>
    </button>
    <button class="button" id="gray-button" @click="contactSeller">
      <label class="button-label" id="gray-button-label">{{$t('button-contact-seller')}}</label>
    </button>
  </div>

  <div class="button-box" v-if="owner">
    <button
      class="button" id="blue-button" @click="editAdvertisement()">
      <label class="button-label" id="blue-button-label">{{$t('button-edit-advertisement')}}</label>
    </button>
    <div class="medium-button-box">
      <button
      class="button"
      id="yellow-button"
      v-if="props.status !== Status.Sold && props.status !== Status.Inactive"
      @click="handleStatusChange(Status.Sold)">
        <label class="button-label" id="yellow-button-label">{{$t('button-sold')}}</label>
      </button>

      <button
        class="button"
        id="gray-button"
        v-else
        @click="handleStatusChange(Status.Active)">
        <label class="button-label" id="gray-button-label">{{$t('button-activate')}}</label>

      </button>
      <button
      class="button" id="red-button" @click="displayDeletePopUp = true">
        <label class="button-label" id="red-button-label">{{$t('button-delete')}}</label>
      </button>

    </div>
  </div>

  <hr class="divider">
  <div class="condition">
    <label>{{$t('label-condition')}}:</label>
    <label class="condition-label">{{conditionLabel}}</label>
  </div>
  <label class="description-label">{{$t('label-description')}}: </label>
  <p class="description">
    {{description}}
  </p>
  <div class="tags">
    <label
      v-for="(tag, index) in tags"
      :key="index"
      class="tag">
      {{tag}}
    </label>
  </div>
  <hr class="divider">
  <div class="payment-info" v-if="owner">
    <label v-if="payment === PaymentMethod.Auction">
      <img class="icon" src="@/assets/icons/check.svg" alt="allows">
      {{ $t('label-allows-auction') }}</label>
    <label v-if="payment !== PaymentMethod.Auction">
      <img class="icon" src="@/assets/icons/x.svg" alt="denies">
      {{ $t('label-denies-auction') }}</label>
    <label v-if="payment === PaymentMethod.Direct">
      <img class="icon" src="@/assets/icons/check.svg" alt="allows">
      {{ $t('label-allows-direct') }}</label>
    <label v-if="payment !== PaymentMethod.Direct">
      <img class="icon" src="@/assets/icons/x.svg" alt="denies">
      {{ $t('label-denies-direct') }}</label>

  </div>
  <div class="seller" v-if="!owner">
    <div class="profile-picture">
      <img src="@/assets/icons/profile.svg" alt="profile-picture" class="inv-image">
    </div>
    <div class="seller-info">
      <label class="seller-name">{{seller}}</label>
    </div>
  </div>

</template>

<style scoped>

.title{
  font-weight: bold;
}

.info-box{
  display: flex;
  flex-direction: row;
  place-content: space-between;
}

.for-sale-info{
  display: flex;
  place-content: center;
  font-weight: bold;
  padding-right: 10px;
  padding-left: 10px;
  background-color: var(--color-gray-button);
  border-radius: calc(var(--global-border-radius)/2);
  color: var(--color-black-text);
}

#sold{
  background-color: var(--color-yellow-button);
}

.location-info{
  display: flex;
  flex-direction: row;
  place-items: center;

}

.location-icon{
  height: 1em;
}

.location{
  font-weight: bold;
}

.price{
  font-weight: bold;
}

.button-box{
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.medium-button-box{
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.button{
  width: 100%;
  height: 5vh;
  min-height: 35px;
  border-radius: calc(var(--global-border-radius)/2);
  border: none;
  box-shadow: var(--global-box-shaddow);
}

#orange-button{
  background-color: var(--color-orange-border);
}

#orange-button:hover{
  background-color: var(--color-dark-orange-button);
}

#blue-button{
  background-color: var(--color-light-blue-button);
}

#blue-button:hover{
  background-color: var(--color-blue-button);
}

#yellow-button{
  background-color: var(--color-yellow-button);
}

#yellow-button:hover{
  background-color: var(--color-dark-yellow-button);
}

#red-button{
  background-color: var(--color-light-red-button);
}

#red-button:hover{
  background-color: var(--color-light-dark-red-button);
}

.button-label{
  font-weight: bold;
  cursor: pointer;
}


#blue-button-label, #gray-button-label, #red-button-label, #yellow-button-label{
  color: var(--color-black-text);
}

#orange-button-label{
  color: var(--color-white-text);
}

.divider{
  border: none;
  border-top: var(--global-thicc-border-size) solid var(--color-gray-divider);
  margin-bottom: 10px;
  margin-top: 10px;
}

.condition{
  display: flex;
  flex-direction: row;
  place-items: center;
  place-content: center;

  width: 100%;
  height: 5vh;
  min-height: 35px;

  padding: 2px;
  border-radius: calc(var(--global-border-radius)/2);
  border: var(--global-border-size) solid var(--color-text);
}

.condition-label, .description-label{
  font-weight: bold;
}

.description{
  min-height: 15%;
  place-content: center;
}

.tags{
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.tag{
  background-color: var(--color-purple-button);
  color: var(--color-white-text);
  border-radius: calc(var(--global-border-radius)/2);
  padding: 3px;
  align-items: center;
}

.seller{
  display: flex;
  flex-direction: row;
  width: 100%;
  place-items: center;
  gap: 10px;
}

.profile-picture{
  width: 15%;
  max-width: 100px;
  aspect-ratio: 1/1;
  border: var(--global-border-size) solid var(--color-text);
  border-radius: 100%;
}

.inv-image{
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
}

.seller-name{
  font-weight: bold;
}

.seller-info{
  height: fit-content;
}

.payment-info{
  width: 100%;
  display: flex;
  flex-direction: column;
}

.icon{
  height: 1em;
}

@media (max-width: 1000px){
 .profile-picture{
   width: 10%;
 }
}

@media (max-width: 700px){
  .profile-picture{
    width: 20%;
    max-width: 100px;
  }
}



</style>
