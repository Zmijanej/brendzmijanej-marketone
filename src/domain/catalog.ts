import type { Product } from '../types/domain'

interface ProductFilters {
  query: string
  category: string
}

export function filterProducts(
  products: Product[],
  { query, category }: ProductFilters,
): Product[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('sq')

  return products.filter((product) => {
    const matchesName = product.name
      .toLocaleLowerCase('sq')
      .includes(normalizedQuery)
    const matchesCategory = !category || product.category === category

    return matchesName && matchesCategory
  })
}

export function getCategories(products: Product[]): string[] {
  return [...new Set(products.map((product) => product.category))].sort(
    (first, second) => first.localeCompare(second, 'sq'),
  )
}

