import { ref, computed } from 'vue'

export function usePagination({ total = 0, pageSize = 10, defaultPage = 1 } = {}) {
  const currentPage = ref(defaultPage)
  const limit = ref(pageSize)

  const count = ref(total)

  // 计算总页数
  const totalPages = computed(() => Math.ceil(count.value / limit.value))

  // 是否有上一页 / 下一页
  const hasPrevPage = computed(() => currentPage.value > 1)
  const hasNextPage = computed(() => currentPage.value < totalPages.value)

  // 跳转到指定页
  const goToPage = (page: number) => {
    if (page < 1) page = 1
    if (page > totalPages.value) page = totalPages.value
    currentPage.value = page
  }

  // 上一页 / 下一页
  const prevPage = () => goToPage(currentPage.value - 1)
  const nextPage = () => goToPage(currentPage.value + 1)

  const reset = () => {
    currentPage.value = defaultPage
    count.value = total
  }

  return {
    currentPage,
    totalPages,
    count,
    limit,
    hasPrevPage,
    hasNextPage,
    goToPage,
    prevPage,
    nextPage,
    reset,
  }
}
