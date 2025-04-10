<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { BidStatus} from '@/enums/enums.ts'
import type { BidInformation } from '@/interfaces/interfaces.ts'
import { getBidFromId } from '../../../utils/Bid.ts'

const name = ref<string>('John Doe')
const amount = ref<number>(1000)
const status = ref<BidStatus>(BidStatus.Pending)

const props = defineProps<{
  id: string
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
      <label>
        {{$t('your-bid-text')}}
        <label class="variable">{{ amount }} NOK,-</label>
      </label>
    </div>
    <div class="status">
      <label>Status: <label class="variable">{{status}}</label></label>
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
  flex-wrap: wrap;
}

.variable{
  font-weight: bold;
}


</style>
