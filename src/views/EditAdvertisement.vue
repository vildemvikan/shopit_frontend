<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Schema from '@/components/Schema.vue'
import { fetchAdvertisement } from '../../utils/CreateAdvertisement.ts'

const route = useRoute()
const id = route.params.id as string
const advertisement = ref(null)

onMounted(async () => {
  try {
    advertisement.value = await fetchAdvertisement(id.toString())
    console.log(advertisement.value)
  } catch (error) {
    console.error('Error fetching advertisement:', error)
  }
})
</script>

<template>
  <h2>{{ $t('edit-advertisement') }}</h2>
  <schema
    :new="false"
    :preview="false"
    :id="id"
    :advertisement="advertisement"
    v-if="advertisement"
  />
</template>

<style scoped>

</style>
