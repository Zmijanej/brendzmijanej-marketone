export interface Product {
  id: string
  merchantId: string
  name: string
  category: string
  imageUrl: string
  priceCents: number
  stockQuantity: number
}

export type Cart = Record<Product['id'], number>

export interface CartItem {
  product: Product
  quantity: number
  lineTotalCents: number
}

export type CatalogScenario = 'normal' | 'fail-once' | 'empty'

export type CatalogState =
  | { status: 'idle'; products: Product[] }
  | { status: 'loading'; products: Product[] }
  | { status: 'success'; products: Product[] }
  | { status: 'error'; products: Product[]; message: string }

export interface SimulatedSession {
  operatorName: string
  email: string
}
