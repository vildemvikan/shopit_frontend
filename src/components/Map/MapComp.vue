<template>
  <div id="map" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  lat: string,
  lng: string
}>()

onMounted(() => {
  const lat = parseFloat(props.lat);
  const lng = parseFloat(props.lng);

  const map = L.map('map', {
    center: [lat, lng],
    zoom: 15,
    scrollWheelZoom: false
    }
  )

  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
  }).addTo(map)

  L.marker([lat, lng])
    .addTo(map)
})
</script>

<style scoped>
.map-container {
  height: 500px;
  width: 100%;
}
</style>
