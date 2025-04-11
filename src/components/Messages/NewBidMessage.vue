<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { BidStatus, Status } from '@/enums/enums.ts'
import type { BidInformation, OrderInformation } from '@/interfaces/interfaces.ts'
import { getOrderById } from '../../../utils/Order.ts'
import { acceptBid, getBidFromId, rejectBid } from '../../../utils/Bid.ts'
import { useToast } from 'vue-toastification'

const toast = useToast()
const name = ref<string>('John Doe')
const amount = ref<number>(1000)
const status = ref<BidStatus>(BidStatus.Pending)

const props = defineProps<{
  id: string
}>()

async function acceptTheBid() {
  try {
    const result = await acceptBid(props.id)
    if (result == 200) {
      status.value = BidStatus.Accepted
    } else {
      toast.error('Error! Could not accept the bid.')
    }
  } catch (error) {
    toast.error('Error! Could not accept the bid.')
  }
}

async function rejectTheBid() {
  try {
    const result = await rejectBid(props.id)
    if (result == 200) {
      status.value = BidStatus.Rejected
    } else {
      toast.error('Error! Could not reject the bid.')
    }
  } catch (error) {
    toast.error('Error! Could not reject the bid.')
  }
}

onMounted(async () => {
  if (props.id !== '') {
    const result: BidInformation = await getBidFromId(props.id)
    name.value = result.bidderName
    amount.value = result.amount
    status.value = result.status
  }
})
</script>

<template>
  <div
    class="bid-box"
    :class="{ rejected: status == BidStatus.Rejected, accepted: status == BidStatus.Accepted }"
  >
    <div class="text-content">
      <label class="variable">{{ name }}</label>
      <label
        >{{ $t('bid-text') }} <label class="variable">{{ amount }} NOK,-</label></label
      >
      <label v-if="status !== BidStatus.Pending"
        >Status: <label class="variable">{{ status }}</label></label
      >
    </div>
    <div class="options" v-if="status == BidStatus.Pending">
      <img
        src="@/assets/icons/check.svg"
        class="answer-icon"
        id="accept"
        alt="accept"
        @click="acceptTheBid"
      />
      <img
        src="@/assets/icons/x.svg"
        class="answer-icon"
        id="reject"
        alt="reject"
        @click="rejectTheBid"
      />
    </div>
  </div>
</template>

<style scoped>
label {
  color: var(--color-black-text);
}

.bid-box {
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

.accepted {
  background-color: var(--color-bid-accepted);
}

.rejected {
  background-color: var(--color-bid-rejected);
}

.text-content {
  display: flex;
  flex-direction: column;
}

.variable {
  font-weight: bold;
}

.options {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.answer-icon:hover {
  transform: scale(1.1);
  cursor: pointer;
}

#reject {
  height: 2em;
}

#accept {
  height: 2em;
}
</style>
