<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Schema from '@/components/Schema.vue'
import { fetchAdvertisement } from '../../utils/Advertisement.ts'

const route = useRoute()
const id = route.params.id as string
const advertisement = ref(null)

onMounted(async () => {
  try {
    advertisement.value = await fetchAdvertisement(id.toString())
  } catch (error) {
    console.error('Error fetching advertisement:', error)
  }
})
</script>

<template>
  <h1 class="title">{{ $t('edit-advertisement') }}</h1>
  <schema
    :new="false"
    :preview="false"
    :id="id"
    :advertisement="advertisement"
    v-if="advertisement"
  />
</template>

<style scoped>

.title{
  text-decoration: underline;
}

</style>
