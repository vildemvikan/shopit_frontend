<script setup lang="ts">

import Pagination from '@/components/Pagination.vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { fetchUserBookmarks } from '../../utils/Bookmark.ts'
import type { DisplayAdvertisement } from '@/interfaces/interfaces.ts'
import AdvertisementPreviewBox from '@/components/AdvertisementPreviewBox.vue'
import AdvertisementPreviewList from '@/components/AdvertisementPreviewList.vue'

const pageSize = ref<number>(0)
const page = ref<number>(0)
const totalPages = ref<number>(0)

const orderBy= ref<number>(1)

const bookmarks = ref<DisplayAdvertisement[]>([])

onMounted(async () => {
  await updatePageSize()
  window.addEventListener('resize', updatePageSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePageSize)
})


async function pageChange(newPage: number){
  page.value = newPage
  await loadAdvertisements()
}

async function loadAdvertisements() {
  try {
    let direction = 'desc'
    if (orderBy.value == 1) {
      direction = 'asc'
    }
    const result = await fetchUserBookmarks(pageSize.value, page.value, direction)
    totalPages.value = result.totalPages
    bookmarks.value = result.content
  } catch (error) {
    console.error(error)
  }
}

async function updatePageSize() {
  const width = window.innerWidth
  let newSize: number
  if (width < 650) {
    newSize = 5
  } else if(width < 950){
    newSize = 6
  } else if (width < 1150) {
    newSize = 8
  } else {
    newSize = 10
  } if (pageSize.value !== newSize) {
    pageSize.value = newSize
    await loadAdvertisements()
  }
}

async function removeBookmark(id: number) {
  bookmarks.value = bookmarks.value.filter(bookmark => bookmark.id !== id)
}

watch(orderBy, async () => {
  page.value = 0
  await loadAdvertisements()
})

</script>

<template>
  <div class="bookmarks">
    <h1 class="title">{{$t('title-bookmarks')}}</h1>
    <div class="container">
      <div class="options">
        <select class="display-button" id="filter-dropdown" v-model="orderBy">
          <option :value="1">{{$t('option-newest')}}</option>
          <option :value="2">{{ $t('option-oldest') }}</option>
        </select>
      </div>

      <div class="display">

        <div class="bookmark" id="box" v-for="bookmark in bookmarks">
          <AdvertisementPreviewBox
            @remove-bookmark="removeBookmark(bookmark.id)"
            :id="bookmark.id"
            :title="bookmark.name"
            :date="bookmark.publishedAt"
            :image="bookmark.images[0].url"
            :is-bookmarked="bookmark.isBookmarked"
            :city="bookmark.location.city"
            :price="bookmark.price"
            :status="bookmark.status"
          />
        </div>

        <div class="bookmark" id="list" v-for="bookmark in bookmarks">
          <AdvertisementPreviewList
            @remove-bookmark="removeBookmark(bookmark.id)"
            :id="bookmark.id"
            :title="bookmark.name"
            :date="bookmark.publishedAt"
            :image="bookmark.images[0].url"
            :is-bookmarked="bookmark.isBookmarked"
            :display-bookmark="true"
            :display-location="true"
            :price="bookmark.price"
            :location="bookmark.location.city"
            :display-status="false"
            :status="bookmark.status"/>
        </div>
      </div>

      <Pagination
        @page-change="pageChange"
        :total-pages="totalPages"
        :current-page="page"
      />

    </div>

  </div>

</template>

<style scoped>
.bookmarks{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 10px;
}
.title{
  text-decoration: underline;
}
.container{
  display: flex;
  flex-direction: column;
  height: 90%;
  width: 100%;
  border: var(--global-border-size) solid var(--color-gray-divider);
  box-shadow: var(--global-box-shaddow);
  border-radius: var(--global-border-radius);
  padding: 10px;
  gap: 10px;
  place-content: space-between;
  align-items: center;
}

.options{
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: end;
  align-content: end;
  place-content: end;
  place-items: end;
  justify-items: end;
  justify-content: end;
}

.display-button{
  height: 4vh;
  min-height: 30px;
  width: fit-content;
  padding: 0 20px;
}

.display{
  display: flex;
  flex-wrap: wrap;
  place-content: start;
  align-items: start;

  height: 85%;
  width: 100%;
  gap: 10px;
}

.bookmark{
  height: calc(calc(100% - 20px) /2);
  width: calc(calc(100% - 4*10px) /5);
}

#list{
  display: none;
}

@media (max-width: 1150px) {

  .bookmark{
    width: calc(calc(100% - 3*10px) /4);
  }
}

@media (max-width: 950px) {

  .bookmark{
    width: calc(calc(100% - 2*10px) /3);
  }
}


@media (max-width: 650px) {

  #box{
    display: none;
  }

  #list{
    display: flex;
    height: calc(calc(100% - 4*10px) /5);
    width: 100%;
  }
}

</style>
