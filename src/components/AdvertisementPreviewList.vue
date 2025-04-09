<script setup lang="ts">

import { Status } from '@/enums/enums.ts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createBookmark, deleteBookmark } from '../../utils/Bookmark.ts'

dayjs.extend(relativeTime)
const router = useRouter();
const props = defineProps<{
  id: number
  title: string
  price: number
  status: Status;
  date: string
  image: string
  location: string
  isBookmarked: boolean
  displayLocation: boolean
  displayBookmark: boolean
  displayStatus: boolean
}>()

const bookmarked = ref<boolean>(props.isBookmarked)

const timeAgo = computed(() => {
  return dayjs(props.date).fromNow()
})

async function bookmarkItem(){
  try{
    const result = await createBookmark(props.id.toString())
    if(result == 401){
      await router.push('/auth')
    }
    bookmarked.value = result === 200

  } catch (error){
    bookmarked.value = false
  }
}

async function removeBookmark(){
  try{
    const result = await deleteBookmark(props.id.toString())
    if(result == 401){
      await router.push('/auth')
    }
    bookmarked.value = !(result == 204)
  } catch (error){
    bookmarked.value = true
  }
}

async function goToAdvertisement(){
  await router.push('/advertisement/' + props.id)
}

</script>

<template>
  <div class="my-advertisement-preview" @click="goToAdvertisement">
    <div class="image-box">
      <img :src="props.image" class="display-image" alt="display image">
    </div>
    <div class="text-info">
      <div class="date-info">
        <div class="corner-text">
          <label id="date">{{timeAgo}}</label>
          <small v-if="displayLocation">{{location}}</small>
        </div>

        <img src="../assets/icons/bookmarkNotMarked.svg"
             alt="bookmark" class="bookmark" v-if="!bookmarked && displayBookmark" @click.stop="bookmarkItem"/>
        <img src="../assets/icons/bookmarkMarked.svg"
             alt="bookmark" class="bookmark" v-if="bookmarked && displayBookmark" @click.stop="removeBookmark"/>
      </div>

      <h3>{{props.title}}</h3>
      <div class="info">
        <label id="price" v-if="props.price > 0">{{props.price}},- NOK</label>
        <label id="price" v-else>{{$t('label-free')}}</label>
        <label class="status" id="status-active"
               v-if="props.status == Status.Active && displayStatus">
          {{$t('label-active')}}</label>
        <label class="status"
               id="status-inactive" v-if="props.status == Status.Inactive && displayStatus">
          {{$t('label-inactive')}}</label>
        <label class="status"
               id="status-sold" v-if="props.status == Status.Sold">
          {{$t('label-sold')}}</label>
      </div>

    </div>
  </div>

</template>

<style scoped>
.my-advertisement-preview{
  position: relative;
  display: flex;
  flex-direction: row;
  align-content: center;
  width: 100%;
  height: 100%;
  padding: 10px;
  gap: 10px;

  box-shadow: var(--global-box-shaddow);
  border-radius: var(--global-border-radius);
  border: var(--global-border-size) solid var(--color-gray-divider);
}

.my-advertisement-preview:hover{
  transform: scale(1.01);
  cursor: pointer;
}

.image-box{
  height: 100%;
}

.display-image{
  height: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: calc(var(--global-border-radius)/2);
}

.text-info{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.date-info{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 35%;
  place-content: end;
  align-items: center;
  gap: 20px;
}

.corner-text{
  display: flex;
  flex-direction: column;
}

#date, #price {
  font-weight:bold;
}

.bookmark{
  height: 100%;
}

.info{
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.status{
  border-radius: calc(var(--global-border-radius)/2);
  padding-left: 5%;
  padding-right: 5%;
}

#status-active{
  background-color: var(--color-light-blue-button);
}

#status-inactive{
  background-color: var(--color-gray-button);
}

#status-sold{
  background-color: var(--color-yellow-button);
}

</style>
