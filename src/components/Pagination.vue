<script setup lang="ts">
import { computed } from 'vue'

// Define props interface: note that currentPage is 0-indexed
interface Props {
  totalPages: number,
  currentPage: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

// Number of numeric page buttons to display at a time
const visibleCount = 4

// Compute the displayed current page (1-indexed)
const displayCurrent = computed(() => props.currentPage + 1)

// Computed property: a sliding window of page numbers (displayed as 1-indexed)
const pages = computed(() => {
  let start = Math.max(1, displayCurrent.value - Math.floor(visibleCount / 2))
  let end = start + visibleCount - 1
  if (end > props.totalPages) {
    end = props.totalPages
    start = Math.max(1, end - visibleCount + 1)
  }
  const pageNumbers: number[] = []
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i)
  }
  return pageNumbers
})

// When a page button is clicked, convert the display page (1-indexed)
// back to a 0-indexed page number before emitting
function goToPage(page: number) {
  const index = page - 1;
  if (index < 0 || index >= props.totalPages) return;
  emit('page-change', index);
}

function previousPage() {
  if (props.currentPage > 0) {
    emit('page-change', props.currentPage - 1);
  }
}

function nextPage() {
  if (props.currentPage < props.totalPages - 1) {
    emit('page-change', props.currentPage + 1);
  }
}
</script>

<template>
  <div class="pagination">
    <button
      class="pagination-button"
      :disabled="props.currentPage === 0"
      @click="previousPage">
      Prev
    </button>

    <span v-if="pages[0] > 1" class="ellipsis">...</span>

    <button
      v-for="page in pages"
      :key="page"
      class="pagination-button"
      :class="{ active: (page - 1) === props.currentPage }"
      @click="goToPage(page)">
      {{ page }}
    </button>

    <span v-if="pages[pages.length - 1] < props.totalPages" class="ellipsis">...</span>

    <button
      class="pagination-button"
      :disabled="props.currentPage === props.totalPages - 1 || props.currentPage === props.totalPages"
      @click="nextPage">
      Next
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-button {
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.ellipsis {
  padding: 0 0.5rem;
  user-select: none;
}
</style>
