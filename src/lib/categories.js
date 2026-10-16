export const CATEGORIES = [
  { value: 'scrubs', label: 'سكربات', filterLabel: 'سكربات' },
  { value: 'footwear', label: 'أحذية طبية', filterLabel: 'أحذية' },
  { value: 'accessories', label: 'إكسسوارات', filterLabel: 'إكسسوارات' },
]

export function getCategoryLabel(value) {
  const category = CATEGORIES.find((item) => item.value === value)
  return category ? category.label : value
}

export function getCategoryFilterLabel(value) {
  const category = CATEGORIES.find((item) => item.value === value)
  return category ? category.filterLabel : value
}
