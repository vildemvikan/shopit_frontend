<script setup lang="ts">
import NewAdvertisements from '@/components/FrontPage/NewAdvertisements.vue'
import PopularCategories from '@/components/FrontPage/PopularCategories.vue'
import Search from '@/components/FrontPage/Search.vue'
</script>

<template>
  <div class="content">
    <div class="search-bar">
      <Search />
    </div>
    <div class="categories">
      <PopularCategories />
    </div>
    <div class="new-advertisements">
      <NewAdvertisements />
    </div>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.search-bar {
  height: 20%;
}

.categories {
  height: 30%;
}
.new-advertisements {
  height: 50%;
  width: 100%;
}
</style>
