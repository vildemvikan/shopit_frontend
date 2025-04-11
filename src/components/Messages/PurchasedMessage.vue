<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { BidStatus } from '@/enums/enums.ts'
import { getOrderById } from '../../../utils/Order.ts'
import type { OrderInformation } from '@/interfaces/interfaces.ts'

const name = ref<string>('John Doe')
const price = ref<number>(1000)

const props = defineProps<{
  id: string
  buyer:boolean
}>()


onMounted(async () => {
  if(props.id !== ''){
    const result:OrderInformation = await getOrderById(props.id)
    name.value = result.buyerName
    price.value = result.price
  }
})

</script>

<template>
  <div class="bid-box">
    <label class="variable" v-if="!buyer">{{name}}</label>
    <div class="text-content">
      <label v-if="buyer">
        {{$t('you-purchased-text')}}
        <label class="variable">{{price}} NOK,-</label>
      </label>
      <label v-if="!buyer">
        {{$t('purchased-text')}}
        <label class="variable">{{price}} NOK,-</label>
      </label>
    </div>
  </div>
</template>

<style scoped>
label{
  color: var(--color-black-text);
}

.bid-box{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 10px;
  border: var(--global-border-size) solid var(--color-gray-divider);
  border-radius: var(--global-border-radius);
  place-content: space-between;
  place-items: start;
  justify-content: center;
  background-color: var(--color-purchased-message);
}

.text-content{
  display: flex;
  flex-wrap: wrap;
}

.variable{
  font-weight: bold;
}


</style>
