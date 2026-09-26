import { useMemo, useState } from 'react'
import { addProduct, getCartItems, getCartTotal, removeProduct, setProductQuantity } from '../domain/cart'
import { filterProducts, getCategories } from '../domain/catalog'
import { formatMoney } from '../domain/money'
import { useCatalog } from '../hooks/useCatalog'
import { resetDemoFailures } from '../services/productService'
import type { Cart, CatalogScenario, Product, SimulatedSession } from '../types/domain'
import { Catalog } from './Catalog'
import { OrderSummary } from './OrderSummary'

interface DashboardProps {
  session: SimulatedSession
  onLogout: () => void
}

export function Dashboard({ session, onLogout }: DashboardProps) {
  const [cart, setCart] = useState<Cart>({})
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [scenario, setScenario] = useState<CatalogScenario>('normal')
  const { state, retry } = useCatalog(scenario)

  const filteredProducts = useMemo(
    () => filterProducts(state.products, { query, category }),
    [category, query, state.products],
  )
  const categories = useMemo(() => getCategories(state.products), [state.products])
  const cartItems = useMemo(
    () => getCartItems(cart, state.products),
    [cart, state.products],
  )
  const totalCents = useMemo(() => getCartTotal(cartItems), [cartItems])
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const filtersActive = Boolean(query || category)

  function clearFilters() {
    setQuery('')
    setCategory('')
  }

  function changeScenario(nextScenario: CatalogScenario) {
    resetDemoFailures()
    setCart({})
    clearFilters()
    setScenario(nextScenario)
  }

  function handleLogout() {
    setCart({})
    onLogout()
  }

  function addToCart(product: Product) {
    setCart((current) => addProduct(current, product))
  }

  function updateQuantity(product: Product, quantity: number) {
    setCart((current) => setProductQuantity(current, product, quantity))
  }

  return (
    <div className={`min-h-dvh bg-canvas ${itemCount > 0 ? 'pb-24 xl:pb-0' : ''}`}>
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <a className="flex items-center gap-3 text-lg font-extrabold tracking-tight" href="#main-content" aria-label="MarketOne — kalo te përmbajtja">
          <span className="hidden sm:inline">MarketOne</span>
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-3 border-r pr-3 sm:pr-5">
            <span className="grid size-9 place-items-center rounded-full bg-mint text-sm font-extrabold text-forest" aria-hidden="true">
              {session.operatorName.charAt(0).toLocaleUpperCase('sq')}
            </span>
            <span className="hidden leading-tight sm:block">
              <strong className="block text-sm">{session.operatorName}</strong>
              <small className="text-xs text-muted">Operator</small>
            </span>
          </div>
          <button className="rounded-lg px-3 py-2 text-sm font-bold text-muted transition hover:bg-slate-100 hover:text-ink" onClick={handleLogout} type="button">
            Dil
          </button>
        </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-[1480px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <section className="mb-8 flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[.16em] text-forest">Paneli i operatorit</p>
            <h1 className="text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Përgatisni porosinë</h1>
            <p className="mt-3 text-sm text-muted sm:text-base">Gjeni produktet që ju duhen dhe ndërtoni një draft porosie.</p>
          </div>
          <label className="w-full md:w-auto">
            <span className="mb-2 block text-[.68rem] font-extrabold uppercase tracking-[.12em] text-muted">Skenar demonstrimi</span>
            <select
              className="h-11 w-full rounded-xl border bg-white px-4 text-sm font-bold shadow-sm md:w-64"
              aria-label="Skenar demonstrimi"
              onChange={(event) => changeScenario(event.target.value as CatalogScenario)}
              value={scenario}
            >
              <option value="normal">Katalog normal</option>
              <option value="fail-once">Gabim, pastaj riprovim</option>
              <option value="empty">Katalog bosh</option>
            </select>
          </label>
        </section>

        <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">
          <Catalog
            cart={cart}
            categories={categories}
            category={category}
            filtersActive={filtersActive}
            onAdd={addToCart}
            onCategoryChange={setCategory}
            onClearFilters={clearFilters}
            onQueryChange={setQuery}
            onRetry={retry}
            products={filteredProducts}
            query={query}
            state={state}
          />
          <OrderSummary
            itemCount={itemCount}
            items={cartItems}
            onRemove={(productId) => setCart((current) => removeProduct(current, productId))}
            onUpdateQuantity={updateQuantity}
            totalCents={totalCents}
          />
        </div>
      </main>

      {itemCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_35px_rgba(23,33,29,.14)] backdrop-blur xl:hidden" aria-live="polite">
          <button
            className="mx-auto flex h-14 w-full max-w-xl items-center justify-between gap-4 rounded-2xl bg-forest px-4 text-left text-white shadow-lg shadow-forest/20 transition active:scale-[.99]"
            onClick={() => document.getElementById('order-summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            type="button"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="grid size-8 shrink-0 animate-[pulse_.45s_ease-out_1] place-items-center rounded-full bg-white text-xs font-black text-forest" key={itemCount}>
                {itemCount}
              </span>
              <span className="min-w-0">
                <strong className="block truncate text-sm">Shiko porosinë</strong>
                <small className="block text-[.68rem] text-emerald-100">
                  {itemCount} {itemCount === 1 ? 'artikull' : 'artikuj'} në draft
                </small>
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2 text-sm font-black">
              {formatMoney(totalCents)}
              <span aria-hidden="true">↑</span>
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
