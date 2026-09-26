import { describe, expect, it } from 'vitest'
import type { Cart, Product } from '../types/domain'
import { addProduct, getCartItems, getCartTotal, setProductQuantity } from './cart'
import { filterProducts } from './catalog'
import { formatMoney } from './money'

const products: Product[] = [
  {
    id: '1',
    merchantId: 'merchant-1',
    name: 'Organic Bananas',
    category: 'Groceries',
    imageUrl: 'https://example.com/banana.png',
    priceCents: 199,
    stockQuantity: 3,
  },
  {
    id: '2',
    merchantId: 'merchant-1',
    name: 'Red Lipstick',
    category: 'Beauty',
    imageUrl: 'https://example.com/lipstick.png',
    priceCents: 1090,
    stockQuantity: 0,
  },
]

const inStockProduct = products[0]
const outOfStockProduct = products[1]

describe('money', () => {
  it('formats integer cents as USD', () => {
    expect(formatMoney(1090)).toMatch(/10[,.]90\s*US\$|US\$\s*10[,.]90/)
  })
})

describe('catalog filtering', () => {
  it('filters by product name without case sensitivity', () => {
    expect(filterProducts(products, { query: 'BANANAS', category: '' })).toHaveLength(1)
  })

  it('combines name and category filters', () => {
    expect(
      filterProducts(products, { query: 'red', category: 'Beauty' }),
    ).toHaveLength(1)
  })
})

describe('cart rules', () => {
  it('does not add an out-of-stock product', () => {
    const cart: Cart = {}
    expect(addProduct(cart, outOfStockProduct)).toBe(cart)
  })

  it('never exceeds available stock', () => {
    const cart = setProductQuantity({}, inStockProduct, 999)
    expect(cart[inStockProduct.id]).toBe(inStockProduct.stockQuantity)
  })

  it('removes a line when its quantity reaches zero', () => {
    const cart = setProductQuantity({ [inStockProduct.id]: 2 }, inStockProduct, 0)
    expect(cart).toEqual({})
  })

  it('derives line totals and the order total from current products', () => {
    const secondProduct = { ...products[1], stockQuantity: 2 }
    const items = getCartItems(
      { [inStockProduct.id]: 2, [secondProduct.id]: 1 },
      products,
    )

    expect(items[0].lineTotalCents).toBe(inStockProduct.priceCents * 2)
    expect(getCartTotal(items)).toBe(
      inStockProduct.priceCents * 2 + secondProduct.priceCents,
    )
  })
})
