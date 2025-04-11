import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '@/components/Pagination.vue'

describe('Pagination.vue', () => {
  const factory = (props = { totalPages: 10, currentPage: 0 }) => {
    return mount(Pagination, {
      props
    })
  }

  it('renders numeric page buttons based on visibleCount', () => {
    const wrapper = factory({ totalPages: 10, currentPage: 0 })
    const pageButtons = wrapper.findAll('.pagination-button')
    // Expected: 4 page buttons + Prev + Next = 6 (no ellipsis at start, 1 at end)
    expect(pageButtons.length).toBeGreaterThanOrEqual(6)
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('4')
  })

  it('emits page-change with 0-indexed value when a page is clicked', async () => {
    const wrapper = factory({ totalPages: 10, currentPage: 0 })
    const pageBtn = wrapper.findAll('.pagination-button').find(btn => btn.text() === '3')
    await pageBtn?.trigger('click')
    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')![0]).toEqual([2]) // index 2 for page 3
  })

  it('emits previous page only when not on first page', async () => {
    const wrapper = factory({ totalPages: 10, currentPage: 2 })
    const prevBtn = wrapper.findAll('.pagination-button')[0]
    await prevBtn.trigger('click')
    expect(wrapper.emitted('page-change')![0]).toEqual([1])
  })

  it('does not emit previous when on first page', async () => {
    const wrapper = factory({ totalPages: 10, currentPage: 0 })
    const prevBtn = wrapper.findAll('.pagination-button')[0]
    await prevBtn.trigger('click')
    expect(wrapper.emitted('page-change')).toBeFalsy()
  })

  it('emits next page when not on last page', async () => {
    const wrapper = factory({ totalPages: 10, currentPage: 4 })
    const nextBtn = wrapper.findAll('.pagination-button').pop()
    await nextBtn?.trigger('click')
    expect(wrapper.emitted('page-change')![0]).toEqual([5])
  })

  it('does not emit next page when on last page', async () => {
    const wrapper = factory({ totalPages: 10, currentPage: 9 })
    const nextBtn = wrapper.findAll('.pagination-button').pop()
    await nextBtn?.trigger('click')
    expect(wrapper.emitted('page-change')).toBeFalsy()
  })

  it('shows ellipsis correctly', () => {
    const wrapper = factory({ totalPages: 10, currentPage: 5 })
    expect(wrapper.findAll('.ellipsis').length).toBeGreaterThan(0)
  })

  it('marks the correct page as active', () => {
    const wrapper = factory({ totalPages: 10, currentPage: 2 })
    const activeBtn = wrapper.find('.pagination-button.active')
    expect(activeBtn.text()).toBe('3')
  })

  it('disables Prev and Next at edges', () => {
    const wrapperStart = factory({ totalPages: 5, currentPage: 0 })
    const wrapperEnd = factory({ totalPages: 5, currentPage: 4 })

    const prevStart = wrapperStart.findAll('.pagination-button')[0]
    const nextEnd = wrapperEnd.findAll('.pagination-button').pop()

    expect(prevStart.attributes('disabled')).toBeDefined()
    expect(nextEnd?.attributes('disabled')).toBeDefined()
  })
})
