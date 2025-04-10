<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { BidStatus, Status } from '@/enums/enums.ts'
import type { BidInformation } from '@/interfaces/interfaces.ts'
import { getBidFromId } from '../../../utils/Bid.ts'

const amount = ref<string>('John Doe')
const price = ref<number>(1000)
const status = ref<BidStatus>(BidStatus.Accepted)

const props = defineProps<{
  id: number
}>()

onMounted(async () => {
  if(props.id !== ''){
    const result:BidInformation = await getBidFromId(props.id)
    name.value = result.bidderName
    amount.value = result.amount
    status.value = result.status
  }
})

</script>

<template>
  <div class="bid-box"
       :class="{rejected: status == BidStatus.Rejected, accepted: status == BidStatus.Accepted}">
    <div class="text-content">
      <label class="variable">{{ amount }}</label>
      <label v-if="status == BidStatus.Accepted">
        {{$t('bid-changed-accepted-text')}} <label class="variable">{{price}} NOK,-</label></label>
      <label v-if="status == BidStatus.Rejected">
        {{$t('bid-changed-rejected-text')}} <label class="variable">{{price}} NOK,-</label></label>
    </div>
  </div>
</template>

<style scoped>

label{
  color: var(--color-black-text);
}

.bid-box{
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  padding: 10px;
  border: var(--global-border-size) solid var(--color-gray-divider);
  border-radius: var(--global-border-radius);
  place-content: space-between;
  place-items: center;
  background-color: var(--color-background);
}

.accepted{
  background-color: var(--color-bid-accepted);
}

.rejected{
  background-color: var(--color-bid-rejected);
}

.text-content{
  display: flex;
  flex-direction: column;
}

.variable{
  font-weight: bold;
}


</style>
