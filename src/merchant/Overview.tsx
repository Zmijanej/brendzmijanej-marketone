'use client'
import Link from 'next/link'
import { useState } from 'react'
import { creditLabels } from './model'
import {
  dateLabel,
  dateTime,
  fundingAction,
  money,
  profileComplete,
  salesTotal,
  tasks,
} from './domain'
import { useWorkspace } from './Workspace'
import { ActionLink, Empty, PageHeading, Panel } from './ui'

export function Overview() {
  const ws = useWorkspace(),
    s = ws.state,
    taskList = tasks(s),
    funding = fundingAction(s.application)
  const [days, setDays] = useState(7),
    [allTasks, setAllTasks] = useState(false),
    [refreshing, setRefreshing] = useState(false)
  const setupDone = profileComplete(s.profile) && s.profile.configured && s.products.length > 0
  const activity = [
    ...s.activity,
    ...(s.application?.events ?? []).map((e) => ({
      id: e.id,
      text: e.actor + ': ' + e.text,
      at: e.at,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5)
  return (
    <>
      <PageHeading
        eyebrow="PANELI I BIZNESIT"
        title="Mirë se erdhët, Ana."
        description="Një pamje e qartë e aktivitetit. Një hap i dobishëm përpara."
        action={<span className="m-date">{dateLabel(new Date())}</span>}
      />
      {!setupDone && (
        <Panel title="Le ta përgatisim biznesin tuaj" className="m-setup">
          <p>Plotësoni hapin e radhës për ta bërë hapësirën tuaj më të dobishme.</p>
          <ol className="m-setup-list">
            {[
              { done: profileComplete(s.profile), title: 'Profili i biznesit', href: '/business' },
              { done: s.profile.configured, title: 'Konfigurimi i dyqanit', href: '/business' },
              { done: !!s.products.length, title: 'Produkti i parë', href: '/products' },
            ].map((item, index) => (
              <li key={item.title}>
                <span>{item.done ? '✓' : String(index + 1).padStart(2, '0')}</span>
                <Link href={item.href}>{item.title}</Link>
                <small>{item.done ? 'Përfunduar' : 'Për t’u bërë'}</small>
              </li>
            ))}
          </ol>
          <p className="m-muted">
            Mungesa e historikut në platformë nuk është vendim për pranimin e kredisë.
          </p>
        </Panel>
      )}
      <section className="m-attention" aria-labelledby="attention-title">
        <div className="m-section-heading">
          <div>
            <p className="m-eyebrow">HAPI I RADHËS</p>
            <h2 id="attention-title">
              {taskList.length ? 'Kërkon vëmendjen tuaj' : 'Jeni në rregull për momentin'}
            </h2>
          </div>
          <span className="m-count">
            {taskList.length} {taskList.length === 1 ? 'veprim' : 'veprime'}
          </span>
        </div>
        {taskList.length ? (
          <div>
            {taskList.slice(0, allTasks ? undefined : 3).map((task, index) => (
              <div className="m-task" key={task.id}>
                <span className="m-task-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.detail}</p>
                </div>
                <Link href={task.href} className={index === 0 ? 'm-button' : 'm-button secondary'}>
                  Hap detyrën <span aria-hidden="true">↗</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>Nuk keni veprime në pritje. Shihni aktivitetin e biznesit më poshtë.</p>
        )}
        {taskList.length > 3 && (
          <button className="m-text-link" onClick={() => setAllTasks(!allTasks)}>
            {allTasks ? 'Shfaq më pak' : 'Shiko të gjitha detyrat'}
          </button>
        )}
      </section>
      <section className="m-metrics-section" aria-labelledby="activity-title">
        <div className="m-section-heading">
          <div>
            <p className="m-eyebrow">VETËM NË MARKETONE</p>
            <h2 id="activity-title">Aktiviteti i biznesit</h2>
          </div>
          <label className="m-period">
            Periudha e shitjeve
            <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
              <option value={7}>7 ditët e fundit</option>
              <option value={30}>30 ditët e fundit</option>
            </select>
          </label>
        </div>
        {refreshing ? (
          <div className="m-panel m-skeleton" role="status" aria-busy="true">
            Po rifreskohet përmbledhja…
          </div>
        ) : ws.faults.dashboard ? (
          <div className="m-panel m-error-block" role="alert">
            <h3>Përmbledhja nuk u rifreskua</h3>
            <p>
              Porositë dhe veprimet e tjera mbeten të disponueshme. Përditësimi i fundit:{' '}
              {dateTime(s.updatedAt)}.
            </p>
            <button
              className="m-button secondary"
              onClick={() => {
                setRefreshing(true)
                window.setTimeout(() => {
                  ws.setFaults({ dashboard: false })
                  setRefreshing(false)
                }, 500)
              }}
            >
              Provo përsëri
            </button>
          </div>
        ) : !s.orders.length ? (
          <Empty title="Ende nuk ka aktivitet në MarketOne">
            Shitjet dhe pagesat do të shfaqen këtu kur të ketë aktivitet.
          </Empty>
        ) : (
          <div className="m-metrics">
            <Link href={'/sales?period=' + days + '&status=completed'} className="m-metric">
              <span>
                Shitje në MarketOne <span aria-hidden="true">↗</span>
              </span>
              <strong>{money(salesTotal(s, days))}</strong>
              <small>Porosi të përfunduara · {days} ditë</small>
            </Link>
            <Link href="/sales?status=pending" className="m-metric">
              <span>
                Porosi për veprim <span aria-hidden="true">↗</span>
              </span>
              <strong>
                {s.orders.filter((o) => o.status === 'pending').length}
                <em>porosi</em>
              </strong>
              <small>Gjendja aktuale · presin konfirmim</small>
            </Link>
            <Link href="/payments?status=pending" className="m-metric">
              <span>
                Pagesa për t’u marrë <span aria-hidden="true">↗</span>
              </span>
              <strong>
                {money(
                  s.payouts.filter((p) => p.status === 'pending').reduce((n, p) => n + p.amount, 0),
                )}
              </strong>
              <small>Gjendja aktuale · nga MarketOne</small>
            </Link>
          </div>
        )}
        <p className="m-caption">
          Përditësuar: {dateTime(s.updatedAt)}. Pagesat e pritshme nuk janë bilanci bankar ose
          fitimi.
        </p>
      </section>
      <div className="m-two-columns">
        <section className="m-finance-card">
          <p className="m-eyebrow">FINANCIMI I BIZNESIT</p>
          <span className="m-finance-mark" aria-hidden="true">
            ↗
          </span>
          <h2>
            {s.application
              ? 'Hapi i radhës për aplikimin tuaj.'
              : 'Më shumë hapësirë për planet tuaja.'}
          </h2>
          <p>
            {s.application
              ? s.application.submission && s.application.submission.delivery !== 'acknowledged'
                ? 'Pritet konfirmimi i marrjes nga banka demo.'
                : creditLabels[s.application.status]
              : 'Përgatitni një kërkesë për stok ose pajisje. Banka shqyrton aplikimin dhe përcakton kushtet.'}
          </p>
          <ActionLink href={funding.href}>{funding.label}</ActionLink>
          <small>Demonstrim i procesit · Pa ofertë ose vendim real kredie</small>
        </section>
        <Panel title="Aktiviteti i fundit">
          <ol className="m-timeline">
            {activity.map((item) => (
              <li key={item.id}>
                <span className="m-timeline-dot" />
                <div>
                  <p>{item.text}</p>
                  <time>{dateTime(item.at)}</time>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </>
  )
}
