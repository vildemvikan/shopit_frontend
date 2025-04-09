<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n';
import { useAdvertisementStore } from '@/stores/advertisementStore.ts'

const { t } = useI18n();
const advertisementStore = useAdvertisementStore()

const props = defineProps<{
  price: number
  payment: PaymentMethod
  priceError: boolean;
}>()

onMounted(() => {
  price.value = props.price
  payment.value = props.payment
});

const emit = defineEmits<{
  (e: 'update:price', value: number): void;
  (e: 'update:payment', value: PaymentMethod): void;
}>()

interface Option {
  text: string;
  value: PaymentMethod;
}
enum PaymentMethod {
  Direct = 'DIRECT',
  Auction = 'BID',
  None = 'CONTACT'
}

const price = ref<number>(0)
const payment = ref<PaymentMethod>(PaymentMethod.None)

const options = computed<Option[]>(() => [
  { text: t('option-vipps'), value: PaymentMethod.Direct },
  { text: t('option-auction'), value: PaymentMethod.Auction }
]);

function checked(state: PaymentMethod){
  return state === payment.value
}

function togglePayment(option: PaymentMethod) {
  // Toggle: if the clicked option is already selected, deselect it; otherwise, select it.
  payment.value = payment.value === option ? PaymentMethod.None : option;
}

function sanitizePriceInput(e: Event) {

  const input = e.target as HTMLInputElement;
  input.value = input.value.replace(/\D/g, '');

  if(input.value == ''){
    emit('update:price', 0)
  } else{
    emit('update:price', Number(price.value))
  }
}

watch(payment, (newPayment)=>{
  emit("update:payment", newPayment)
})

</script>

<template>
  <label>{{ $t('label-price') }}</label>
  <div class="price-input-container">
    <input type="number"
           class="price-input"
           :class="{'error': priceError}"
           min="0"
           inputmode="numeric"
           @input="sanitizePriceInput"
           v-model="price">
    <label class="valuta-label">NOK</label>
  </div>
  <small v-if="priceError" class="error-message">{{$t('price-error')}}</small>

  <div class="checkbox-group">
    <div v-for="option in options" :key="option.value" class="payment-method" @click="togglePayment(option.value)">
      <input
        type="checkbox"
        :value="option.value"
        :checked="checked(option.value)"
      >
      <label>{{ option.text }}</label>
    </div>
  </div>
</template>

<style scoped>

H3, label{
  color: var(--color-black-text);
}
.price-input-container {
  display: flex;
  flex-direction: row;
  align-content: center;
  gap: 10px;
  font-weight: bold;
}

.price-input {
  direction: rtl;
  text-align: left;
  padding-right: 3em;
  min-height: 30px;
  border-radius: calc(var(--global-border-radius)/2);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-method{
  display: flex;
  flex-direction: row;
  cursor: pointer;

  gap: 10px;

  background-color: var(--color-light-lavendel-background);
  padding: 5px 10px 5px 10px;
  border-radius: calc(var(--global-border-radius)/2);
  box-shadow: var(--global-box-shaddow);
}

.payment-method:hover{
  background-color: var(--color-lavendel-background);
}
</style>
