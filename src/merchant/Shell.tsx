'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'
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
  const drawer = useRef<HTMLDialogElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!mobileOpen) return
    const dialog = drawer.current!
    const trigger = menuButton.current
    const mobile = window.matchMedia('(max-width: 900px)')
    const body = document.body
    const scrollX = window.scrollX,
      scrollY = window.scrollY
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    Object.assign(body.style, {
      position: 'fixed',
      top: '-' + scrollY + 'px',
      left: '-' + scrollX + 'px',
      width: '100%',
      overflow: 'hidden',
    })
    dialog.showModal()
    const closeOnDesktop = () => {
      if (!mobile.matches) dialog.close()
    }
    mobile.addEventListener('change', closeOnDesktop)
    return () => {
      mobile.removeEventListener('change', closeOnDesktop)
      dialog.close()
      Object.assign(body.style, previous)
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' })
      if (mobile.matches) trigger?.focus({ preventScroll: true })
    }
  }, [mobileOpen])
  useEffect(() => {
    if (drawer.current?.open) drawer.current.close()
  }, [path])
  return (
    <div className="merchant-app">
      <a className="m-skip" href="#merchant-content">
        Kalo te përmbajtja
      </a>
      <aside className="m-sidebar">
        <Link className="m-wordmark" href="/overview">
          MarketOne<span> / </span>
        </Link>
        <NavigationContents />
      </aside>
      <dialog
        ref={drawer}
        id="merchant-mobile-menu"
        className="m-mobile-drawer"
        aria-label="Menuja e biznesit"
        onClose={() => setMobileOpen(false)}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])',
          )
          const first = controls[0],
            last = controls[controls.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return
          const rect = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            drawer.current?.close()
        }}
      >
        <div className="m-drawer-header">
          <span className="m-wordmark">
            MarketOne<span> / </span>
          </span>
          <button
            className="m-drawer-close"
            aria-label="Mbyll menunë"
            autoFocus
            onClick={() => drawer.current?.close()}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="m-drawer-scroll">
          <NavigationContents onNavigate={() => drawer.current?.close()} />
        </div>
      </dialog>
      <div className="m-workspace">
        <header className="m-topbar">
          <button
            ref={menuButton}
            className="m-menu-toggle"
            aria-controls="merchant-mobile-menu"
            aria-haspopup="dialog"
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
function NavigationContents({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname(),
    ws = useWorkspace()
  return (
    <>
      <p className="m-nav-label">HAPËSIRA E BIZNESIT</p>
      <nav aria-label="Navigimi kryesor">
        {navigation.map(([href, label, num]) => (
          <Link
            key={href}
            href={href}
            aria-current={path.startsWith(href) ? 'page' : undefined}
            onClick={onNavigate}
          >
            <span className="m-nav-number">{num}</span>
            {label}
            {href === '/financing' &&
              ws.state.application?.status === 'information_required' && (
                <span className="m-nav-dot" aria-label="Kërkesë e re" />
              )}
          </Link>
        ))}
      </nav>
      <div className="m-sidebar-bottom">
        <span className="m-avatar">DL</span>
        <b>{ws.state.profile.name}</b>
        <small>Tregti me pakicë · demo</small>
        <Link href="/legacy-demo" onClick={onNavigate}>
          Demonstrimi i porositjes ↗
        </Link>
      </div>
    </>
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
