'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { bankTransition } from './domain'
import { useWorkspace } from './Workspace'
import type { CreditStatus, DemoFaults } from './model'

const navigation = [
  ['/overview', 'Përmbledhje', '01'],
  ['/sales', 'Shitje', '02'],
  ['/products', 'Produkte', '03'],
  ['/payments', 'Pagesa', '04'],
  ['/financing', 'Financim', '05'],
  ['/business', 'Profili i biznesit', '06'],
]
export function MerchantShell({ children }: { children: ReactNode }) {
  const path = usePathname(),
    ws = useWorkspace()
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])
  return (
    <div className="merchant-app">
      <a className="m-skip" href="#merchant-content">
        Kalo te përmbajtja
      </a>
      <aside className={'m-sidebar' + (mobileOpen ? ' is-open' : '')}>
        <Link className="m-wordmark" href="/overview" onClick={() => setMobileOpen(false)}>
          MarketOne<span> / </span>
        </Link>
        <p className="m-nav-label">HAPËSIRA E BIZNESIT</p>
        <nav aria-label="Navigimi kryesor">
          {navigation.map(([href, label, num]) => (
            <Link
              key={href}
              href={href}
              aria-current={path.startsWith(href) ? 'page' : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <span className="m-nav-number">{num}</span>
              {label}
              {href === '/financing' && ws.state.application?.status === 'information_required' && (
                <span className="m-nav-dot" aria-label="Kërkesë e re" />
              )}
            </Link>
          ))}
        </nav>
        <div className="m-sidebar-bottom">
          <span className="m-avatar">DL</span>
          <b>{ws.state.profile.name}</b>
          <small>Tregti me pakicë · demo</small>
          <Link href="/legacy-demo">Demonstrimi i porositjes ↗</Link>
        </div>
      </aside>
      <div className="m-workspace">
        <header className="m-topbar">
          <button
            className="m-menu-toggle"
            aria-expanded={mobileOpen}
            aria-label="Hap ose mbyll menunë"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰ Menu
          </button>
          <div className="m-breadcrumb">
            Biznesi <span>/</span> <b>{navigation.find(([href]) => path.startsWith(href))?.[1]}</b>
          </div>
          <div className="m-top-actions">
            <span className="m-demo-tag">DEMO</span>
            <span className="m-operator">
              Ana Demo <small>Pronare</small>
            </span>
            <button className="m-quiet" onClick={() => void ws.logout()} disabled={ws.busy}>
              Dil
            </button>
          </div>
        </header>
        <div className="m-local-notice">
          <span>Vetëm aktiviteti në MarketOne · Të dhëna ilustruese</span>
          <span role="status" aria-live="polite">
            {ws.saveStatus === 'saved'
              ? 'Ruajtur në këtë browser'
              : ws.saveStatus === 'pending'
                ? 'Ndryshime në pritje të ruajtjes…'
                : 'Ndryshimet nuk u ruajtën'}
          </span>
        </div>
        {ws.error && (
          <div className="m-alert" role="alert">
            {ws.error}
            <button className="m-text-link" onClick={() => void ws.flush()}>
              Provo ruajtjen përsëri
            </button>
          </div>
        )}
        <main className="m-main" id="merchant-content" key={ws.state.instanceId}>
          {children}
          <DemoControls />
        </main>
        <footer className="m-footer">
          <span>MarketOne / Biznesi në qendër</span>
          <span>Pa lidhje bankare aktive · Një browser, një skenar</span>
        </footer>
      </div>
    </div>
  )
}
function DemoControls() {
  const ws = useWorkspace()
  const changeBank = (status: CreditStatus) => void ws.transact((s) => bankTransition(s, status))
  const app = ws.state.application
  return (
    <details className="m-demo-controls">
      <summary>
        Skenar demonstrimi <span>Kontrolle për rishikuesin</span>
      </summary>
      <p>
        Këto kontrolle simulojnë sjelljen e platformës dhe bankës. Nuk janë veprime të operatorit në
        një shërbim real.
      </p>
      <div className="m-actions">
        <button
          className="m-button secondary"
          onClick={() => {
            if (window.confirm('Të zëvendësohet skenari dhe çdo draft lokal me biznesin shembull?'))
              void ws.reset(false)
          }}
        >
          Biznes ekzistues / rivendos
        </button>
        <button
          className="m-button secondary"
          onClick={() => {
            if (window.confirm('Të zëvendësohet skenari dhe çdo draft lokal me një biznes të ri?'))
              void ws.reset(true)
          }}
        >
          Biznes i ri
        </button>
      </div>
      <div className="m-form-grid">
        <label className="m-check">
          <input
            type="checkbox"
            checked={ws.faults.dashboard}
            onChange={(e) => ws.setFaults({ dashboard: e.target.checked })}
          />
          Gabim i të dhënave të panelit
        </label>
        <label className="m-check">
          <input
            type="checkbox"
            checked={ws.faults.saving}
            onChange={(e) => ws.setFaults({ saving: e.target.checked })}
          />
          Dështim i ruajtjes lokale
        </label>
        <label className="m-check">
          <input
            type="checkbox"
            checked={ws.faults.transmission}
            onChange={(e) => ws.setFaults({ transmission: e.target.checked })}
          />
          Timeout gjatë dërgimit
        </label>
        <label className="m-field">
          Përpunimi i mostrës
          <select
            aria-label="Skenari i dokumentit"
            value={ws.faults.document}
            onChange={(e) => ws.setFaults({ document: e.target.value as DemoFaults['document'] })}
          >
            <option value="none">Përfundon me sukses</option>
            <option value="format">Format i papranueshëm</option>
            <option value="size">Madhësi mbi kufirin demo</option>
            <option value="interrupted">Përpunim i ndërprerë</option>
          </select>
        </label>
      </div>
      <p>
        <b>Përgjigjja e bankës së simuluar</b> · Zgjidhni vetëm një hap të mundshëm nga gjendja
        aktuale.
      </p>
      <div className="m-actions">
        <button
          className="m-button secondary"
          disabled={ws.busy || app?.status !== 'received'}
          onClick={() => changeBank('under_review')}
        >
          Nis shqyrtimin
        </button>
        <button
          className="m-button secondary"
          disabled={ws.busy || app?.status !== 'under_review' || !!app.request}
          onClick={() => changeBank('information_required')}
        >
          Kërko dokument shtesë
        </button>
        <button
          className="m-button secondary"
          disabled={ws.busy || app?.status !== 'under_review'}
          onClick={() => changeBank('approved')}
        >
          Simulo miratimin
        </button>
        <button
          className="m-button secondary"
          disabled={ws.busy || app?.status !== 'under_review'}
          onClick={() => changeBank('rejected')}
        >
          Simulo refuzimin
        </button>
      </div>
      <p className="m-muted">
        Për të demonstruar një aplikim tjetër, rivendosni skenarin. Dalja ruan draftin; rivendosja e
        zëvendëson.
      </p>
    </details>
  )
}
