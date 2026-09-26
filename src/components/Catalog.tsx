import Image from 'next/image'
import { formatMoney } from '../domain/money'
import type { Cart, CatalogState, Product } from '../types/domain'

interface CatalogProps {
  cart: Cart
  categories: string[]
  category: string
  filtersActive: boolean
  onAdd: (product: Product) => void
  onCategoryChange: (category: string) => void
  onClearFilters: () => void
  onQueryChange: (query: string) => void
  onRetry: () => void
  products: Product[]
  query: string
  state: CatalogState
}

export function Catalog({
  cart,
  categories,
  category,
  filtersActive,
  onAdd,
  onCategoryChange,
  onClearFilters,
  onQueryChange,
  onRetry,
  products,
  query,
  state,
}: CatalogProps) {
  return (
    <section aria-labelledby="catalog-title">
      <SectionHeading
        number="01"
        title="Katalogu"
        description="Zgjidhni produktet për porosinë tuaj."
        trailing={
          state.status === 'success' && state.products.length > 0 ? (
            <span className="rounded-full border bg-white px-3 py-1 text-xs font-bold text-muted">
              {products.length} produkte
            </span>
          ) : null
        }
      />

      <div className="mb-6 grid gap-3 rounded-2xl border bg-white p-3 shadow-sm sm:grid-cols-[minmax(220px,1fr)_220px_auto]" role="search">
        <label className="relative">
          <span className="sr-only">Kërko sipas emrit</span>
          <svg className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          <input
            className="h-11 w-full rounded-xl border bg-canvas/60 pl-10 pr-4 text-sm placeholder:text-slate-400"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Kërko produktin..."
            type="search"
            value={query}
          />
        </label>
        <label>
          <span className="sr-only">Filtro sipas kategorisë</span>
          <select
            className="h-11 w-full rounded-xl border bg-canvas/60 px-3 text-sm font-semibold"
            onChange={(event) => onCategoryChange(event.target.value)}
            value={category}
          >
            <option value="">Të gjitha kategoritë</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <button
          className="h-11 rounded-xl px-4 text-sm font-bold text-forest transition hover:bg-mint disabled:cursor-not-allowed disabled:text-slate-300"
          disabled={!filtersActive}
          onClick={onClearFilters}
          type="button"
        >
          Pastro
        </button>
      </div>

      {state.status === 'loading' && <CatalogLoading />}
      {state.status === 'error' && (
        <StatePanel action="Provo përsëri" description={state.message} icon="!" onAction={onRetry} title="Katalogu nuk u ngarkua" tone="error" />
      )}
      {state.status === 'success' && state.products.length === 0 && (
        <StatePanel description="Burimi publik u përgjigj me sukses, por ky skenar nuk përmban produkte." icon="○" title="Katalogu është bosh" />
      )}
      {state.status === 'success' && state.products.length > 0 && products.length === 0 && (
        <StatePanel action="Pastro filtrat" description="Nuk gjetëm produkte që përputhen me kërkimin ose kategorinë e zgjedhur." icon="⌕" onAction={onClearFilters} title="Asnjë rezultat" />
      )}
      {state.status === 'success' && products.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
          {products.map((product) => {
            const quantity = cart[product.id] ?? 0
            const unavailable = product.stockQuantity === 0
            const atLimit = quantity >= product.stockQuantity

            return (
              <article className={`group flex min-h-80 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-card ${unavailable ? 'opacity-65' : ''}`} key={product.id}>
                <div className="relative grid h-36 place-items-center overflow-hidden bg-[#f0f3ef]">
                  <Image className="object-contain p-3 transition duration-300 group-hover:scale-105" src={product.imageUrl} alt="" fill sizes="(max-width: 640px) 100vw, 300px" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[.64rem] font-extrabold uppercase tracking-[.08em] text-forest backdrop-blur">{product.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className={`mb-3 flex items-center gap-1.5 text-xs font-bold ${unavailable ? 'text-red-700' : 'text-emerald-700'}`}>
                    <span className={`size-1.5 rounded-full ${unavailable ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    {unavailable ? 'Pa stok' : `${product.stockQuantity} në stok`}
                  </div>
                  <h3 className="line-clamp-2 min-h-12 font-extrabold leading-6">{product.name}</h3>
                  <p className="mt-2 text-xl font-black tracking-[-.03em]">{formatMoney(product.priceCents)} <span className="text-xs font-medium text-muted">/ njësi</span></p>
                  <button
                    className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-forest text-sm font-extrabold text-forest transition hover:bg-forest hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                    disabled={unavailable || atLimit}
                    onClick={() => onAdd(product)}
                    type="button"
                  >
                    {unavailable ? 'I padisponueshëm' : atLimit ? 'U arrit stoku' : 'Shto në porosi'}
                    {!unavailable && !atLimit && <span aria-hidden="true">＋</span>}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export function SectionHeading({ number, title, description, trailing }: { number: string; title: string; description: string; trailing?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint text-xs font-black text-forest" aria-hidden="true">{number}</span>
        <div>
          <h2 className="text-xl font-extrabold tracking-[-.025em]" id={number === '01' ? 'catalog-title' : 'order-title'}>{title}</h2>
          <p className="mt-0.5 text-xs text-muted sm:text-sm">{description}</p>
        </div>
      </div>
      {trailing}
    </div>
  )
}

function CatalogLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3" aria-live="polite" aria-label="Katalogu po ngarkohet">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div className="h-80 animate-pulse overflow-hidden rounded-2xl border bg-white" key={item} aria-hidden="true">
          <div className="h-36 bg-slate-100" /><div className="space-y-4 p-4"><div className="h-3 w-20 rounded bg-slate-100"/><div className="h-5 w-4/5 rounded bg-slate-100"/><div className="h-10 rounded bg-slate-100"/></div>
        </div>
      ))}
      <span className="sr-only">Duke ngarkuar produktet…</span>
    </div>
  )
}

interface StatePanelProps { action?: string; description: string; icon: string; onAction?: () => void; title: string; tone?: 'error' }

function StatePanel({ action, description, icon, onAction, title, tone }: StatePanelProps) {
  return (
    <div className={`grid min-h-72 place-items-center rounded-2xl border border-dashed p-8 text-center ${tone === 'error' ? 'border-red-200 bg-red-50' : 'bg-white'}`} role={tone === 'error' ? 'alert' : 'status'}>
      <div>
        <span className={`mx-auto grid size-12 place-items-center rounded-full text-xl font-black ${tone === 'error' ? 'bg-red-100 text-red-700' : 'bg-mint text-forest'}`} aria-hidden="true">{icon}</span>
        <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
        {action && onAction && <button className="mt-5 rounded-xl bg-forest px-5 py-2.5 text-sm font-extrabold text-white hover:bg-forest-dark" onClick={onAction} type="button">{action}</button>}
      </div>
    </div>
  )
}
