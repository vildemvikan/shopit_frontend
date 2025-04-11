<script setup lang="ts">
import { ref } from 'vue'
import { type Status } from '@/enums/enums.ts'
import { Image } from '@/interfaces/interfaces.ts'
import { createBookmark, deleteBookmark } from '../../../utils/Bookmark.ts'
import { useRouter } from 'vue-router'

// Destructure the images prop from defineProps
const props = defineProps<{
  id: string
  images: Image[]
  status: Status
  isOwner: boolean
  isBookmarked: boolean
}>()

const router = useRouter()

const bookmarked = ref<boolean>(props.isBookmarked)
// Use a more descriptive name for the selected index
const selectedIndex = ref<number>(0)
// Reactive variable to control modal visibility
const showModal = ref<boolean>(false)

function previousImage() {
  if (selectedIndex.value > 0) {
    selectedIndex.value -= 1
  } else {
    selectedIndex.value = props.images.length - 1
  }
}

function nextImage() {
  if (selectedIndex.value < props.images.length - 1) {
    selectedIndex.value += 1
  } else {
    selectedIndex.value = 0
  }
}
function openModal() {
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}

async function bookmarkItem() {
  try {
    const result = await createBookmark(props.id)
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
    const result = await deleteBookmark(props.id)
    if (result == 401) {
      await router.push('/auth')
    }
    bookmarked.value = !(result == 204)
  } catch (error) {
    bookmarked.value = true
  }
}
</script>

<template>
  <div class="images">
    <img
      v-for="(img, index) in images"
      :key="index"
      class="image"
      :class="{ selected: index === selectedIndex }"
      :src="img.url"
      alt="Image"
      @click="selectedIndex = index"
    />
  </div>
  <div class="display-image-box" v-if="images && images.length">
    <img
      class="display-image"
      v-if="images.length > selectedIndex"
      :src="images[selectedIndex].url"
      alt="Displayed Image"
      @click="openModal"
    />

    <div v-if="status === 'INACTIVE'" class="status-mark" id="inactive">
      <label class="sold-label">{{ $t('label-inactive') }}</label>
    </div>

    <div v-if="status === 'SOLD'" class="status-mark" id="sold">
      <label class="sold-label">{{ $t('label-sold') }}</label>
    </div>

    <div class="image-caption" v-if="!showModal && images[selectedIndex].caption">
      <label>{{ images[selectedIndex].caption }}</label>
    </div>

    <div class="rotate-buttons" v-if="images.length > 1">
      <button @click="previousImage" class="rotate-button">
        <img src="@/assets/icons/up.svg" class="rotate-icon" id="previous" alt="Previous image" />
      </button>
      <button @click="nextImage" class="rotate-button">
        <img src="@/assets/icons/up.svg" class="rotate-icon" id="next" alt="Next Image" />
      </button>
    </div>
    <img
      src="@/assets/icons/bookmarkNotMarked.svg"
      alt="bookmark"
      class="bookmark"
      v-if="!bookmarked && !isOwner"
      @click.stop="bookmarkItem"
    />
    <img
      src="@/assets/icons/bookmarkMarked.svg"
      alt="bookmark"
      class="bookmark"
      v-if="bookmarked && !isOwner"
      @click.stop="removeBookmark"
    />
  </div>
</template>

<style scoped>
.images {
  display: flex;
  flex-direction: column;
  max-width: 20%;
  height: 100%;
  gap: 10px;
}

.image {
  height: calc(100% / 5);
  object-fit: cover;
  cursor: pointer;
  border-radius: calc(var(--global-border-radius) / 2);
}

.image:hover {
  border: var(--global-thicccc-border-size) solid var(--color-orange-border);
}

.selected {
  border: var(--global-thicccc-border-size) solid var(--color-orange-border);
}

.display-image-box {
  position: relative;
  width: 80%;
  height: 100%;
}

.display-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: calc(var(--global-border-radius) / 2);
}

.status-mark {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 30%;
  aspect-ratio: 4/1;
  border-radius: calc(var(--global-border-radius) / 2) 0 calc(var(--global-border-radius) / 2) 0;
  z-index: 10;
}

#sold {
  background: var(--color-yellow-button);
}

#inactive {
  background-color: var(--color-gray-button);
}

.sold-label {
  color: var(--color-black-text);
  font-weight: bold;
  text-transform: uppercase;
}

/* Position the rotate buttons over the modal image */
.rotate-buttons {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  z-index: 10;
  padding: 0 20px;
}

.rotate-buttons button:hover {
  background-color: var(--color-white-button);
}

.rotate-button {
  display: flex;
  justify-content: center;
  background-color: var(--color-transparent-button);
  border: none;
  max-width: 9.5%;
  aspect-ratio: 1/1;
  border-radius: 100%;
}
.bookmark {
  position: absolute;
  top: 5px;
  right: 0;
  height: 12%;
  z-index: 10;
  cursor: pointer;
}

.bookmark:hover {
  transform: scale(1.01);
}

.rotate-icon {
  max-width: 75%;
}

#next {
  rotate: 90deg;
}

#previous {
  rotate: -90deg;
}

.image-caption {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-white-text);
  background: var(--color-transparent-black-background);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1rem;
  z-index: 5;
  max-width: 90%;
  text-align: center;
}

@media (max-width: 1000px) {
  .images {
    flex-direction: row;
    min-width: 75%;
    height: fit-content;
  }

  .image {
    width: calc(100% / 5);
    height: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
  }

  .display-image-box {
    width: 75%;
    aspect-ratio: 1/1;
  }
}

@media (max-width: 700px) {
  .images {
    flex-direction: row;
    min-width: 100%;
    height: 20%;
  }

  .image {
    width: calc(100% / 5);
    height: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
  }

  .display-image-box {
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
  }
}
</style>
