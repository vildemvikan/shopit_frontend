<script setup lang="ts">
import { Status } from '@/enums/enums.ts'
import dayjs from 'dayjs'
import 'dayjs/locale/nb'
import 'dayjs/locale/en'
import relativeTime from 'dayjs/plugin/relativeTime'
import { computed, ref, watch } from 'vue'
import { createBookmark, deleteBookmark } from '../../utils/Bookmark.ts'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

watch(
  locale,
  (newLocale) => {
    dayjs.locale(newLocale)
  },
  { immediate: true },
)

dayjs.extend(relativeTime)
const router = useRouter()

const emit = defineEmits<{
  (e: 'remove-bookmark'): void
}>()

const props = defineProps<{
  id: number
  title: string
  price: number
  status: Status
  date: string
  image: string
  city: string
  isBookmarked: boolean
}>()

const bookmarked = ref<boolean>(props.isBookmarked)

const timeAgo = computed(() => {
  // Remap "no" to "nb" for Day.js compatibility
  const lang = locale.value === 'no' ? 'nb' : locale.value
  // Ensure that Day.js uses the updated locale for each computation
  return dayjs(props.date).locale(lang).fromNow()
})

async function bookmarkItem() {
  try {
    const result = await createBookmark(props.id.toString())
    if (result == 401) {
      await router.push('/auth')
    }
    bookmarked.value = result === 200
  } catch (error) {
    bookmarked.value = false
  }
}

async function removeBookmark() {
  try {
    const result = await deleteBookmark(props.id.toString())
    if (result == 401) {
      await router.push('/auth')
    }
    bookmarked.value = !(result == 204)
    await emit('remove-bookmark')
  } catch (error) {
    bookmarked.value = true
  }
}

async function goToAdvertisement() {
  await router.push('/advertisement/' + props.id)
}
</script>

<template>
  <div class="advertisement" @click="goToAdvertisement">
    <div class="image-container">
      <img :src="props.image" alt="image" class="display-image" />
      <label class="price-label" v-if="props.price > 0">{{ props.price }},- NOK</label>
      <label class="price-label" v-else>{{ $t('label-free') }}</label>
      <img
        src="../assets/icons/bookmarkNotMarked.svg"
        alt="bookmark"
        class="bookmark"
        v-if="!bookmarked"
        @click.stop="bookmarkItem"
      />
      <img
        src="../assets/icons/bookmarkMarked.svg"
        alt="bookmark"
        class="bookmark"
        v-else
        @click.stop="removeBookmark"
      />
    </div>
    <div class="info">
      <div class="small-info">
        <label>{{ city }}</label>
        <label>{{ timeAgo }}</label>
      </div>
      <h3 class="title">{{ title }}</h3>
    </div>
  </div>
</template>

<style scoped>
.advertisement {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: var(--global-border-size) solid var(--color-gray-divider);
  border-radius: var(--global-border-radius);
  box-shadow: var(--global-box-shaddow);
  overflow: hidden;
  cursor: pointer;
}

.advertisement:hover {
  transform: scale(1.01);
}
.image-container {
  position: relative;
  width: 100%;
  height: 70%;
}

.display-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--global-border-radius) var(--global-border-radius) 0 0;
}

.image-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.5) 90%,
    rgba(0, 0, 0, 0.7) 100%
  );
  pointer-events: none;
}
.price-label {
  position: absolute;
  bottom: 5px;
  left: 10px;
  color: var(--color-white-text);
  font-weight: bold;
  z-index: 1;
}

.bookmark {
  position: absolute;
  top: 5px;
  right: 0;
  height: 20%;
  z-index: 0;
}

.info {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
}

.small-info {
  display: flex;
  flex-direction: row;
  width: 100%;
  place-content: space-between;
}

.title {
  font-weight: bold;
}
</style>
