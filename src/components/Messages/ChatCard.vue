<script setup lang="ts">
import type { ChatCardInfo} from '@/interfaces/interfaces.ts'

const props = defineProps<{
  chatCardData: ChatCardInfo,
}>();


</script>

<template>
  <div class="card-box">
    hloe owld
  </div>
</template>

<style scoped>

.card-box {
  border: solid 1px;
  border-radius: var(--global-border-radius);
  padding: 1rem;
  background-color: var(--color-background);
}
</style>
