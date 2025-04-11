<script setup lang="ts">
import Pagination from '@/components/Pagination.vue'
import MyAdvertisementPreview from '@/components/AdvertisementPreviewList.vue'
import { onMounted, ref, watch } from 'vue'
import { fetchUserAdvertisements, fetchUserInformation } from '../../../utils/Profile.ts'
import type { DisplayAdvertisement } from '@/interfaces/interfaces.ts'
import { useRouter } from 'vue-router'
import { Status } from '@/enums/enums.ts'

const router = useRouter()

const advertisements = ref<DisplayAdvertisement[]>([])

const SIZE = 4
const currentPage = ref<number>(0)
const totalPages = ref<number>(0)

const dateFilter = ref<number>(1)
const statusFilter = ref<Status | null>(null)

onMounted(async () => {
  await loadAdvertisements()
})

function goToAdvertisement(id: number) {
  router.push('/advertisement/' + id)
}

async function pageChange(page: number) {
  currentPage.value = page
  await loadAdvertisements()
}

async function loadAdvertisements() {
  try {
    const result = await fetchUserAdvertisements(
      SIZE,
      currentPage.value,
      dateFilter.value,
      statusFilter?.value,
    )

    totalPages.value = result.totalPages
    advertisements.value = result.content
  } catch (error) {
    console.error(error)
  }
}

watch(dateFilter, async (newVal, oldVal) => {
  currentPage.value = 0
  await loadAdvertisements()
})

watch(statusFilter, async (newVal, oldVal) => {
  currentPage.value = 0
  await loadAdvertisements()
})
</script>

<template>
  <div class="my-advertisements">
    <label class="title">{{ $t('label-my-advertisements') }}</label>

    <div class="filter-options">
      <select id="filter-dropdown" v-model="statusFilter">
        <option :value="null">{{ $t('option-status-all') }}</option>
        <option :value="Status.Active">{{ $t('option-status-active') }}</option>
        <option :value="Status.Inactive">{{ $t('option-status-inactive') }}</option>
        <option :value="Status.Sold">{{ $t('option-status-sold') }}</option>
      </select>

      <select id="filter-dropdown" v-model="dateFilter">
        <option :value="1">{{ $t('option-newest') }}</option>
        <option :value="2">{{ $t('option-oldest') }}</option>
      </select>
    </div>

    <div class="advertisements">
      <div
        v-for="advertisement in advertisements"
        class="advertisement"
        v-if="advertisements.length > 0"
      >
        <MyAdvertisementPreview
          :id="advertisement.id"
          :title="advertisement.name"
          :status="advertisement.status"
          :price="advertisement.price"
          :date="advertisement.publishedAt"
          :image="advertisement.images[0].url"
          :location="advertisement.location.city"
          :isBookmarked="advertisement.isBookmarked"
          :display-location="false"
          :display-bookmark="false"
          :display-status="true"
          @click="goToAdvertisement(advertisement.id)"
        />
      </div>
      <div class="advertisement" v-else id="no-created-advertisements">
        <label>{{ $t('placeholder-no-created-advertisements') }}</label>
      </div>
    </div>

    <div class="pagination">
      <Pagination @page-change="pageChange" :total-pages="totalPages" :current-page="currentPage" />
    </div>
  </div>
</template>

<style scoped>
.my-advertisements {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  place-content: space-between;
  gap: 20px;
}

.title {
  font-weight: bold;
}

.filter-options {
  display: flex;
  flex-direction: row;
  height: 5%;
  width: 100%;
  place-content: end;
  gap: 10px;
}

.advertisements {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 75%;
  gap: 20px;
}

.advertisement {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(calc(100% - 80px) / 4);
}

.advertisement:hover {
  transform: scale(1.01);
}

.pagination {
  display: flex;
  flex-direction: row;
  place-content: center;
}

#no-created-advertisements {
  height: 90%;
  place-content: center;
  align-items: center;
}
</style>
