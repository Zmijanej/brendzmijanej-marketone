import type { Cart, CartItem, Product } from '../types/domain'

export function addProduct(cart: Cart, product: Product): Cart {
  const currentQuantity = cart[product.id] ?? 0

  if (product.stockQuantity === 0 || currentQuantity >= product.stockQuantity) {
    return cart
  }

  return { ...cart, [product.id]: currentQuantity + 1 }
}

export function setProductQuantity(
  cart: Cart,
  product: Product,
  requestedQuantity: number,
): Cart {
  if (requestedQuantity <= 0) {
    return removeProduct(cart, product.id)
  }

  if (product.stockQuantity === 0) {
    return cart
  }

  const safeQuantity = Math.min(
    Math.max(1, Math.trunc(requestedQuantity)),
    product.stockQuantity,
  )

  return { ...cart, [product.id]: safeQuantity }
}

export function removeProduct(cart: Cart, productId: Product['id']): Cart {
  if (!(productId in cart)) {
    return cart
  }

  const nextCart = { ...cart }
  delete nextCart[productId]
  return nextCart
}

export function getCartItems(cart: Cart, products: Product[]): CartItem[] {
  return products.flatMap((product) => {
    const quantity = cart[product.id]

    return quantity
      ? [{ product, quantity, lineTotalCents: product.priceCents * quantity }]
      : []
  })
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.lineTotalCents, 0)
}

