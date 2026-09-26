import type { CatalogScenario, Product } from '../types/domain'

const API_URL =
  'https://dummyjson.com/products?limit=12&select=id,title,category,price,stock,thumbnail'
const ERROR_URL = 'https://dummyjson.com/products/endpoint-qe-nuk-ekziston'
const failedOnce = new Set<CatalogScenario>()

interface ApiProduct {
  id: number
  title: string
  category: string
  price: number
  stock: number
  thumbnail: string
}

interface ProductsResponse {
  products: ApiProduct[]
}

function titleCaseCategory(category: string): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function loadProducts(
  scenario: CatalogScenario = 'normal',
): Promise<Product[]> {
  const shouldFail = scenario === 'fail-once' && !failedOnce.has(scenario)
  if (shouldFail) {
    failedOnce.add(scenario)
  }

  const response = await fetch(shouldFail ? ERROR_URL : API_URL, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Katalogu nuk mund të ngarkohej. Ju lutemi provoni përsëri.')
  }

  const data = (await response.json()) as ProductsResponse

  if (scenario === 'empty') return []

  return data.products.map((product, index) => ({
    id: String(product.id),
    merchantId: 'merchant-dummyjson-01',
    name: product.title,
    category: titleCaseCategory(product.category),
    imageUrl: product.thumbnail,
    priceCents: Math.round(product.price * 100),
    // One deterministic out-of-stock item demonstrates the required state.
    stockQuantity: index === data.products.length - 1 ? 0 : product.stock,
  }))
}

export function resetDemoFailures(): void {
  failedOnce.clear()
}
