import { formatMoney } from '../domain/money'
import type { CartItem, Product } from '../types/domain'
import { SectionHeading } from './Catalog'

interface OrderSummaryProps {
  itemCount: number
  items: CartItem[]
  onRemove: (productId: Product['id']) => void
  onUpdateQuantity: (product: Product, quantity: number) => void
  totalCents: number
}

export function OrderSummary({ itemCount, items, onRemove, onUpdateQuantity, totalCents }: OrderSummaryProps) {
  const itemLabel = itemCount === 1 ? '1 artikull' : `${itemCount} artikuj`

  return (
    <aside className="scroll-mt-24 xl:sticky xl:top-26" aria-labelledby="order-title" id="order-summary">
      <div className="rounded-3xl border bg-white p-5 shadow-card sm:p-6">
        <SectionHeading
          number="02"
          title="Porosia juaj"
          description={itemCount === 0 ? 'Ende pa artikuj' : `${itemLabel} gjithsej`}
          trailing={itemCount > 0 ? <span className="grid size-8 place-items-center rounded-full bg-forest text-xs font-black text-white" aria-label={itemLabel}>{itemCount}</span> : null}
        />

        {items.length === 0 ? (
          <div className="grid min-h-64 place-items-center border-y text-center">
            <div>
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-canvas text-2xl text-muted" aria-hidden="true">▱</span>
              <h3 className="mt-4 font-extrabold">Porosia është bosh</h3>
              <p className="mt-2 text-sm text-muted">Shtoni produkte nga katalogu për të filluar.</p>
            </div>
          </div>
        ) : (
          <div className="max-h-[46vh] divide-y overflow-y-auto border-y pr-1">
            {items.map((item) => (
              <article className="py-5" key={item.product.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold leading-5">{item.product.name}</h3>
                    <p className="mt-1 text-xs text-muted">{formatMoney(item.product.priceCents)} / njësi</p>
                  </div>
                  <button aria-label={`Hiq ${item.product.name}`} className="grid size-7 shrink-0 place-items-center rounded-lg text-lg text-muted transition hover:bg-red-50 hover:text-red-700" onClick={() => onRemove(item.product.id)} type="button">×</button>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex h-9 items-center overflow-hidden rounded-lg border" aria-label={`Sasia për ${item.product.name}`}>
                    <button className="grid h-full w-9 place-items-center text-lg font-bold hover:bg-slate-100" aria-label={`Zvogëlo sasinë e ${item.product.name}`} onClick={() => onUpdateQuantity(item.product, item.quantity - 1)} type="button">−</button>
                    <input className="h-full w-10 border-x text-center text-sm font-extrabold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" aria-label={`Sasia e ${item.product.name}`} inputMode="numeric" max={item.product.stockQuantity} min="1" onChange={(event) => onUpdateQuantity(item.product, Number(event.target.value))} type="number" value={item.quantity} />
                    <button className="grid h-full w-9 place-items-center text-base font-bold hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300" aria-label={`Rrit sasinë e ${item.product.name}`} disabled={item.quantity >= item.product.stockQuantity} onClick={() => onUpdateQuantity(item.product, item.quantity + 1)} type="button">＋</button>
                  </div>
                  <strong className="text-sm">{formatMoney(item.lineTotalCents)}</strong>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="pt-5">
          <div className="mb-5 flex items-end justify-between gap-4">
            <span className="text-sm font-bold text-muted">Totali i porosisë</span>
            <strong className="text-2xl font-black tracking-[-.04em]">{formatMoney(totalCents)}</strong>
          </div>
          <button className="h-12 w-full cursor-not-allowed rounded-xl bg-slate-200 px-4 text-sm font-extrabold text-slate-500" disabled type="button">Dërgimi nuk përfshihet në prototip</button>
        </div>
      </div>
    </aside>
  )
}
