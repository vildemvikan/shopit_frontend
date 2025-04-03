<script setup lang="ts">

import { Status } from '@/enums/enums.ts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { computed } from 'vue'

dayjs.extend(relativeTime)

const props = defineProps<{
  title: string
  price: number
  status: Status;
  date: string
  image: string
}>()

const timeAgo = computed(() => {
  return dayjs(props.date).fromNow()
})


</script>

<template>
  <div class="my-advertisement-preview">
    <div class="image-box">
      <img :src="props.image" class="display-image" alt="display image">
    </div>
    <div class="text-info">
      <div class="date-info">
        <label id="date">{{timeAgo}}</label>
      </div>
      <h3>{{props.title}}</h3>
      <div class="info">
        <label id="price" v-if="props.price > 0">{{props.price}},- NOK</label>
        <label id="price" v-else>{{$t('label-free')}}</label>
        <label class="status" id="status-active"
               v-if="props.status == Status.Active">{{$t('label-active')}}</label>
        <label class="status"
               id="status-inactive" v-if="props.status == Status.Inactive">{{$t('label-inactive')}}</label>
        <label class="status"
               id="status-sold" v-if="props.status == Status.Sold">{{$t('label-sold')}}</label>
      </div>
    </div>
  </div>

</template>

<style scoped>
.my-advertisement-preview{
  display: flex;
  flex-direction: row;
  align-content: center;
  width: 100%;
  height: 100%;
  padding: 10px;
  gap: 10px;
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
  place-content: end;
}

#date, #price {
  font-weight:bold;
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
