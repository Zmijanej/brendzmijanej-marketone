'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { cents, confirmOrder, dateTime, money, orderTotal, profileComplete } from './domain'
import { orderLabels, type BusinessProfile, type MerchantProduct } from './model'
import { useWorkspace } from './Workspace'
import { Empty, Field, PageHeading, Panel } from './ui'

export function Sales() {
  const ws = useWorkspace(),
    query = useSearchParams()
  const filter = query.get('status') ?? 'all',
    selected = query.get('order'),
    period = Number(query.get('period'))
  const from = new Date()
  from.setHours(0, 0, 0, 0)
  from.setDate(from.getDate() - (period || 7) + 1)
  const orders = ws.state.orders.filter(
    (o) => (filter === 'all' || o.status === filter) && (!period || new Date(o.createdAt) >= from),
  )
  const order = ws.state.orders.find((o) => o.id === selected)
  return (
    <>
      <PageHeading
        eyebrow="OPERACIONET"
        title="Shitjet e biznesit"
        description="Porositë që kalojnë përmes MarketOne, nga konfirmimi te përfundimi."
      />
      <div className="m-tabs" aria-label="Filtro porositë">
        {[
          ['all', 'Të gjitha'],
          ['pending', 'Për konfirmim'],
          ['confirmed', 'Konfirmuar'],
          ['completed', 'Përfunduar'],
        ].map(([value, label]) => (
          <Link
            key={value}
            href={'/sales?status=' + value}
            aria-current={filter === value ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
      </div>
      {period > 0 && (
        <p className="m-note">
          Shfaqen {period} ditët e fundit. <Link href="/sales">Pastro periudhën</Link>
        </p>
      )}
      {!orders.length ? (
        <Empty title="Nuk ka porosi në këtë pamje">
          Porositë e platformës shfaqen këtu. Provoni një filtër tjetër.
        </Empty>
      ) : (
        <Panel>
          <div className="m-record-list">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={'/sales?order=' + o.id + '&status=' + filter}
                className="m-record"
              >
                <span>
                  <b>{o.id}</b>
                  <small>
                    {o.customer} · {dateTime(o.createdAt)}
                  </small>
                </span>
                <span className={'m-badge ' + (o.status === 'pending' ? 'amber' : '')}>
                  {orderLabels[o.status]}
                </span>
                <strong>{money(orderTotal(o))} ↗</strong>
              </Link>
            ))}
          </div>
        </Panel>
      )}
      {order && (
        <Panel title={'Porosia ' + order.id}>
          <p>
            {order.customer} · {orderLabels[order.status]}
          </p>
          <ul className="m-line-items">
            {order.lines.map((line, i) => (
              <li key={i}>
                <span>
                  {line.name} × {line.quantity}
                </span>
                <b>{money(line.price * line.quantity)}</b>
              </li>
            ))}
          </ul>
          <p className="m-total">
            Totali <strong>{money(orderTotal(order))}</strong>
          </p>
          {order.status === 'pending' && (
            <button
              className="m-button"
              onClick={() => void ws.transact((s) => confirmOrder(s, order.id))}
            >
              Konfirmo porosinë
            </button>
          )}
          <p className="m-muted">
            Konfirmimi pranon porosinë. Shitja e përfunduar, stoku dhe pagesa nuk ndryshojnë
            automatikisht në këtë demonstrim.
          </p>
        </Panel>
      )}
    </>
  )
}
export function Payments() {
  const { state } = useWorkspace(),
    query = useSearchParams(),
    selected = query.get('payout'),
    pending = query.get('status') === 'pending'
  const payouts = state.payouts.filter((p) => !pending || p.status === 'pending'),
    payout = state.payouts.find((p) => p.id === selected)
  return (
    <>
      <PageHeading
        eyebrow="AKTIVITETI NË MARKETONE"
        title="Pagesat e biznesit"
        description="Shihni çfarë është kaluar te biznesi dhe çfarë mbetet për t’u marrë."
      />
      <div className="m-tabs">
        <Link href="/payments" aria-current={!pending ? 'page' : undefined}>
          Të gjitha
        </Link>
        <Link href="/payments?status=pending" aria-current={pending ? 'page' : undefined}>
          Në pritje
        </Link>
      </div>
      <p className="m-note">
        Këto janë pagesa të platformës, jo bilanci i llogarisë bankare. Nuk kryhen tërheqje ose
        transferta në këtë demo.
      </p>
      {!payouts.length ? (
        <Empty title="Nuk ka pagesa në këtë pamje">
          Pagesat shfaqen pasi të ketë aktivitet në platformë.
        </Empty>
      ) : (
        <Panel>
          {payouts.map((p) => (
            <Link
              key={p.id}
              className="m-record"
              href={'/payments?payout=' + p.id + (pending ? '&status=pending' : '')}
            >
              <span>
                <b>{p.id}</b>
                <small>{dateTime(p.createdAt)}</small>
              </span>
              <span className={'m-badge ' + (p.status === 'pending' ? 'amber' : '')}>
                {p.status === 'pending' ? 'Për t’u marrë' : 'E kaluar'}
              </span>
              <strong>{money(p.amount)} ↗</strong>
            </Link>
          ))}
        </Panel>
      )}
      {payout && (
        <Panel title={'Detajet e pagesës ' + payout.id}>
          <p className="m-display-amount">{money(payout.amount)}</p>
          <p>
            {payout.status === 'pending'
              ? 'Pagesa pret përfundimin e procesit të platformës. Nuk ka afat të konfirmuar në këtë skenar.'
              : 'Pagesë e përfunduar në skenarin demonstrues.'}
          </p>
          <h3>Aktiviteti përkatës</h3>
          {payout.orderIds.map((id) => (
            <p key={id}>
              <Link className="m-text-link" href={'/sales?order=' + id}>
                {id} →
              </Link>
            </p>
          ))}
          <p className="m-muted">
            Në këto mostra, pagesa përputhet me porositë përkatëse, pa tarifa ose rregullime të
            simuluara.
          </p>
        </Panel>
      )}
    </>
  )
}
export function Products() {
  const ws = useWorkspace(),
    [editing, setEditing] = useState<MerchantProduct | null>(null),
    [adding, setAdding] = useState(false)
  return (
    <>
      <PageHeading
        eyebrow="BIZNESI JUAJ"
        title="Produktet dhe disponueshmëria"
        description="Një katalog i vogël i biznesit tuaj. I ndarë nga demonstrimi i porositjes."
        action={
          <button
            className="m-button"
            onClick={() => {
              setEditing(null)
              setAdding(true)
            }}
          >
            Shto produkt +
          </button>
        }
      />
      {!ws.state.products.length ? (
        <Empty title="Shtoni produktin tuaj të parë">
          Emri, çmimi dhe disponueshmëria e bëjnë dyqanin gati për aktivitet.
        </Empty>
      ) : (
        <Panel>
          {ws.state.products.map((p) => (
            <div className="m-record" key={p.id}>
              <span>
                <b>{p.name}</b>
                <small>
                  {p.stock} njësi në stok · {p.active ? 'Aktiv' : 'Joaktiv'}
                </small>
              </span>
              <strong>{money(p.price)}</strong>
              <button
                className="m-button secondary"
                onClick={() => {
                  setAdding(false)
                  setEditing(p)
                }}
              >
                Ndrysho <span className="m-sr-only">{p.name}</span>
              </button>
            </div>
          ))}
        </Panel>
      )}
      {(adding || editing) && (
        <ProductEditor
          key={editing?.id ?? 'new'}
          product={editing}
          onClose={() => {
            setEditing(null)
            setAdding(false)
          }}
        />
      )}
    </>
  )
}
function ProductEditor({
  product,
  onClose,
}: {
  product: MerchantProduct | null
  onClose: () => void
}) {
  const ws = useWorkspace(),
    [name, setName] = useState(product?.name ?? ''),
    [price, setPrice] = useState(product ? String(product.price / 100) : ''),
    [stock, setStock] = useState(String(product?.stock ?? 0)),
    [active, setActive] = useState(product?.active ?? true),
    [error, setError] = useState('')
  const save = async (event: FormEvent) => {
    event.preventDefault()
    const amount = cents(price)
    if (
      !name.trim() ||
      amount === null ||
      amount <= 0 ||
      !/^\d+$/.test(stock) ||
      !Number.isSafeInteger(Number(stock))
    ) {
      setError('Shkruani emrin, një çmim pozitiv dhe stok si numër i plotë jo negativ.')
      return
    }
    const value = {
      id: product?.id ?? 'p-' + crypto.randomUUID(),
      name: name.trim(),
      price: amount,
      stock: Number(stock),
      active,
    }
    if (
      await ws.transact((s) => ({
        ...s,
        products: product
          ? s.products.map((p) => (p.id === product.id ? value : p))
          : [...s.products, value],
      }))
    )
      onClose()
  }
  return (
    <Panel title={product ? 'Ndrysho produktin' : 'Produkti i ri'}>
      <form onSubmit={(e) => void save(e)}>
        <div className="m-form-grid">
          <Field
            id="product-name"
            label="Emri i produktit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Field
            id="product-price"
            label="Çmimi (USD)"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Field
            id="product-stock"
            label="Njësi në stok"
            inputMode="numeric"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <label className="m-check">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Produkt aktiv
          </label>
        </div>
        {error && (
          <p role="alert" className="m-field-error">
            {error}
          </p>
        )}
        <div className="m-actions">
          <button className="m-button" type="submit">
            Ruaj produktin
          </button>
          <button className="m-button secondary" type="button" onClick={onClose}>
            Anulo
          </button>
        </div>
      </form>
    </Panel>
  )
}
export function Business() {
  const { state } = useWorkspace()
  return (
    <>
      <PageHeading
        eyebrow="BAZA E HAPËSIRËS SUAJ"
        title="Profili i biznesit"
        description="Të dhëna të ripërdorshme për punën e përditshme dhe aplikimet e ardhshme."
      />
      <BusinessEditor key={JSON.stringify(state.profile)} profile={state.profile} />
    </>
  )
}
function BusinessEditor({ profile }: { profile: BusinessProfile }) {
  const ws = useWorkspace(),
    [draft, setDraft] = useState(profile),
    [error, setError] = useState(''),
    [saved, setSaved] = useState(false)
  const fields: [keyof Omit<BusinessProfile, 'configured'>, string][] = [
    ['name', 'Emri i biznesit'],
    ['activity', 'Aktiviteti'],
    ['registration', 'Numri i regjistrimit demonstrues'],
    ['address', 'Adresa demonstruese'],
    ['representative', 'Përfaqësuesi'],
    ['email', 'Email demonstrues'],
    ['phone', 'Telefon demonstrues'],
  ]
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!profileComplete(draft)) {
      setError('Plotësoni të gjitha fushat dhe një email të vlefshëm demonstrues.')
      return
    }
    if (
      await ws.transact((s) => ({
        ...s,
        profile: draft,
        activity: [
          {
            id: crypto.randomUUID(),
            text: 'Profili i biznesit u përditësua.',
            at: new Date().toISOString(),
          },
          ...s.activity,
        ],
      }))
    ) {
      setSaved(true)
      setError('')
    }
  }
  return (
    <Panel title="Biznesi dhe përfaqësuesi">
      <p>
        Përdorni vetëm të dhëna fiktive. Ndryshimi i profilit nuk ndryshon një aplikim ekzistues.
      </p>
      <form onSubmit={(e) => void submit(e)}>
        <div className="m-form-grid">
          {fields.map(([key, label]) => (
            <Field
              key={key}
              id={'business-' + key}
              label={label}
              value={draft[key]}
              type={key === 'email' ? 'email' : 'text'}
              onChange={(e) => {
                setDraft({ ...draft, [key]: e.target.value })
                setSaved(false)
              }}
              required
            />
          ))}
        </div>
        <label className="m-check">
          <input
            type="checkbox"
            checked={draft.configured}
            onChange={(e) => setDraft({ ...draft, configured: e.target.checked })}
          />
          Konfirmoj konfigurimin demonstrues të dyqanit dhe kontaktit.
        </label>
        {error && (
          <p role="alert" className="m-field-error">
            {error}
          </p>
        )}
        <div className="m-actions">
          <button className="m-button" type="submit">
            Ruaj profilin
          </button>
          <span role="status">{saved ? 'Profili u ruajt në këtë browser.' : ''}</span>
        </div>
      </form>
    </Panel>
  )
}
