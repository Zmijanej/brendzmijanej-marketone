import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { loadProducts } from './services/productService'
import type { Product } from './types/domain'

vi.mock('./services/productService', () => ({
  loadProducts: vi.fn(),
  resetDemoFailures: vi.fn(),
}))

const products: Product[] = [
  {
    id: '1',
    merchantId: 'merchant-1',
    name: 'Organic Bananas',
    category: 'Groceries',
    imageUrl: 'https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp',
    priceCents: 199,
    stockQuantity: 2,
  },
  {
    id: '2',
    merchantId: 'merchant-1',
    name: 'Red Lipstick',
    category: 'Beauty',
    imageUrl: 'https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp',
    priceCents: 1090,
    stockQuantity: 0,
  },
]

async function login() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Emri i operatorit'), 'Ana Kola')
  await user.type(screen.getByLabelText('Email-i i punës'), 'ana@example.com')
  await user.click(screen.getByRole('button', { name: /Hyr në panel/i }))
  return user
}

describe('Operator flow', () => {
  beforeEach(() => {
    vi.mocked(loadProducts).mockReset().mockResolvedValue(products)
  })

  it('rejects an operator name containing only whitespace', async () => {
    render(<App />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Emri i operatorit'), '   ')
    await user.type(screen.getByLabelText('Email-i i punës'), 'ana@example.com')
    await user.click(screen.getByRole('button', { name: /Hyr në panel/i }))

    expect(screen.getByRole('alert')).toHaveTextContent('Shkruani emrin e operatorit.')
    expect(screen.getByRole('heading', { name: 'Mirë se u kthyet' })).toBeInTheDocument()
    expect(loadProducts).not.toHaveBeenCalled()
  })

  it('logs in, builds an order within stock, removes it, and logs out', async () => {
    render(<App />)
    const user = await login()

    expect(await screen.findByText('Organic Bananas')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'I padisponueshëm' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /Shto në porosi/i }))
    expect(screen.getByText('1 artikull gjithsej')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Rrit sasinë e Organic Bananas/i }))
    expect(screen.getByLabelText('Sasia e Organic Bananas')).toHaveValue(2)
    expect(screen.getByRole('button', { name: /Rrit sasinë e Organic Bananas/i })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /Hiq Organic Bananas/i }))
    expect(screen.getByText('Porosia është bosh')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Dil' }))
    expect(screen.getByRole('heading', { name: 'Mirë se u kthyet' })).toBeInTheDocument()
  })

  it('shows no results separately and clears the search', async () => {
    render(<App />)
    const user = await login()
    await screen.findByText('Organic Bananas')

    await user.type(screen.getByPlaceholderText('Kërko produktin...'), 'nuk ekziston')
    expect(screen.getByText('Asnjë rezultat')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Pastro filtrat' }))
    expect(screen.getByText('Organic Bananas')).toBeInTheDocument()
  })

  it('filters the catalog by category', async () => {
    render(<App />)
    const user = await login()
    await screen.findByText('Organic Bananas')

    await user.selectOptions(screen.getByLabelText('Filtro sipas kategorisë'), 'Beauty')

    expect(screen.getByText('Red Lipstick')).toBeInTheDocument()
    expect(screen.queryByText('Organic Bananas')).not.toBeInTheDocument()
    expect(screen.getByText('1 produkte')).toBeInTheDocument()
  })

  it('shows an error and recovers through retry', async () => {
    vi.mocked(loadProducts).mockRejectedValueOnce(new Error('Gabim prove')).mockResolvedValueOnce(products)
    render(<App />)
    const user = await login()

    expect(await screen.findByText('Katalogu nuk u ngarkua')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Provo përsëri' }))
    expect(await screen.findByText('Organic Bananas')).toBeInTheDocument()
  })

  it('shows the distinct empty-catalog state', async () => {
    vi.mocked(loadProducts).mockResolvedValue([])
    render(<App />)
    await login()

    await waitFor(() => expect(screen.getByText('Katalogu është bosh')).toBeInTheDocument())
    expect(screen.queryByText('Asnjë rezultat')).not.toBeInTheDocument()
  })
})
