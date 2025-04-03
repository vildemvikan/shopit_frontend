<script setup lang="ts">
import ChatCard from '@/components/Messages/ChatCard.vue'

const props = defineProps({chatCardData: ChatCard});

</script>

<template>
  {{props}}
</template>

<style scoped>

</style>
