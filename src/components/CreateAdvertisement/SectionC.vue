<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
  Auction = 'AUCTION',
  None = 'NONE'
}

const price = ref<number>(0)
const payment = ref<PaymentMethod>(PaymentMethod.None)

// Options as an array of strings
const options: Option[] = [
  {text:t('option-vipps'), value: PaymentMethod.Direct},
  {text: t('option-auction'), value: PaymentMethod.Auction}];


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
  price.value = input.value;
}

watch(payment, (newPayment)=>{
  emit("update:payment", newPayment)
})

watch(price, (newPrice)=>{
  if(newPrice == ''){newPrice = 0}
  emit("update:price", newPrice)
})

</script>

<template>
  <label>{{ $t('label-price') }}</label>
  <div class="price-input-container">
    <input type="number"
           class="price-input"
           min="0"
           inputmode="numeric"
           @input="sanitizePriceInput"
           v-model="price">
    <label class="valuta-label">NOK</label>
  </div>

  <div class="checkbox-group">
    <div v-for="option in options" :key="option.value" class="payment-method" @click="togglePayment(option.value)">
      <input
        type="checkbox"
        :value="option.value"
        :checked="checked(option.value)"
      >
      {{ option.text }}
    </div>
  </div>
</template>

<style scoped>
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

.currency-label {
  position: absolute;
  right: 0.5em;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-weight: bold;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-method{
  background-color: white;
  padding: 5px 10px 5px 10px;
  border-radius: calc(var(--global-border-radius)/2);
  box-shadow: var(--global-box-shaddow);
}
</style>
