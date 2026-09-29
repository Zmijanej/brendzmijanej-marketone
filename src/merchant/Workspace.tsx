'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  acknowledge,
  beginSubmission,
  createApplication,
  simulateReceipt,
  updateDocument,
} from './domain'
import { defaultFaults, type DemoFaults, type DocumentKind, type Workspace } from './model'
import { DemoRepository, SESSION_KEY } from './repository'

type SaveStatus = 'saved' | 'pending' | 'error'
interface ContextValue {
  state: Workspace
  faults: DemoFaults
  setFaults: (patch: Partial<DemoFaults>) => void
  change: (transform: (state: Workspace) => Workspace) => void
  flush: () => Promise<boolean>
  transact: (transform: (state: Workspace) => Workspace) => Promise<boolean>
  saveStatus: SaveStatus
  error: string
  busy: boolean
  logout: () => Promise<void>
  reset: (fresh: boolean) => Promise<void>
  startApplication: () => Promise<boolean>
  processDocument: (kind: DocumentKind) => Promise<void>
  submit: (supplement?: boolean, consent?: boolean) => Promise<boolean>
  checkReceipt: (supplement?: boolean) => Promise<void>
}
const WorkspaceContext = createContext<ContextValue | null>(null)
export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) throw new Error('Merchant workspace provider missing')
  return context
}
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, replace] = useReducer((_old: Workspace | null, next: Workspace) => next, null)
  const current = useRef<Workspace | null>(null)
  const repo = useRef<DemoRepository | null>(null)
  const dirty = useRef(false),
    revision = useRef(0),
    generation = useRef(0),
    working = useRef(false)
  const [hydrated, setHydrated] = useState(false),
    [session, setSession] = useState(false)
  const [loadError, setLoadError] = useState(''),
    [error, setError] = useState('')
  const [faults, updateFaults] = useState<DemoFaults>(defaultFaults)
  const faultsRef = useRef(faults)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved'),
    [busy, setBusy] = useState(false)
  const setFaults = (patch: Partial<DemoFaults>) => {
    faultsRef.current = { ...faultsRef.current, ...patch }
    updateFaults(faultsRef.current)
  }
  const install = useCallback((next: Workspace) => {
    current.current = next
    replace(next)
  }, [])
  const initialize = useCallback(async () => {
    const token = generation.current
    try {
      repo.current = new DemoRepository(window.localStorage)
      const data = await repo.current.load()
      if (token !== generation.current) return
      install(data)
      try {
        setSession(window.sessionStorage.getItem(SESSION_KEY) === 'owner-demo')
      } catch {
        setSession(false)
      }
      setLoadError('')
    } catch (e) {
      if (token !== generation.current) return
      setLoadError(e instanceof Error ? e.message : 'Ruajtja lokale nuk është e disponueshme.')
    }
    setHydrated(true)
  }, [install])
  const invalidatePending = useCallback(() => {
    generation.current++
  }, [])
  useEffect(() => {
    let active = true
    void Promise.resolve().then(() => {
      if (active) void initialize()
    })
    return () => {
      active = false
      invalidatePending()
    }
  }, [initialize, invalidatePending])
  const change = useCallback(
    (transform: (s: Workspace) => Workspace) => {
      if (!current.current) return
      const next = transform(current.current)
      if (next === current.current) return
      revision.current++
      dirty.current = true
      setSaveStatus('pending')
      install({ ...next, updatedAt: new Date().toISOString() })
    },
    [install],
  )
  const flush = useCallback(async () => {
    if (!current.current) return false
    const rev = revision.current
    try {
      if (faultsRef.current.saving) throw new Error('Ruajtja dështoi në këtë skenar demonstrimi.')
      if (!repo.current) repo.current = new DemoRepository(window.localStorage)
      await repo.current.save(current.current)
      if (rev === revision.current) {
        dirty.current = false
        setSaveStatus('saved')
        setError('')
      }
      return true
    } catch (e) {
      dirty.current = true
      setSaveStatus('error')
      setError(
        (e instanceof Error ? e.message : 'Ruajtja nuk është e disponueshme.') +
          ' Ndryshimet e fundit nuk u ruajtën. Provoni përsëri.',
      )
      return false
    }
  }, [])
  useEffect(() => {
    if (!state || !dirty.current) return
    const timer = window.setTimeout(() => {
      void flush()
    }, 500)
    return () => window.clearTimeout(timer)
  }, [state, faults.saving, flush])
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty.current) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [])
  const transact = useCallback(
    async (transform: (s: Workspace) => Workspace) => {
      if (!current.current || !(await flush())) return false
      try {
        const next = transform(current.current)
        if (next === current.current) return true
        const result = { ...next, updatedAt: new Date().toISOString() }
        await repo.current!.save(result)
        revision.current++
        install(result)
        dirty.current = false
        setSaveStatus('saved')
        setError('')
        return true
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Veprimi dështoi. Provoni përsëri.')
        return false
      }
    },
    [flush, install],
  )
  const reset = async (fresh: boolean) => {
    generation.current++
    working.current = false
    setBusy(false)
    try {
      if (!repo.current) repo.current = new DemoRepository(window.localStorage)
      const next = await repo.current.reset(fresh)
      dirty.current = false
      revision.current++
      install(next)
      setFaults(defaultFaults)
      setSaveStatus('saved')
      setError('')
      setLoadError('')
    } catch {
      setLoadError('Nuk mund të rivendosen të dhënat. Lejoni ruajtjen lokale dhe provoni përsëri.')
    }
  }
  const processDocument = async (kind: DocumentKind) => {
    if (working.current) return
    working.current = true
    setBusy(true)
    const token = generation.current,
      fault = faultsRef.current.document
    if (fault !== 'none') setFaults({ document: 'none' })
    const set = (status: Parameters<typeof updateDocument>[2], message = '') =>
      change((s) =>
        s.application
          ? { ...s, application: updateDocument(s.application, kind, status, message) }
          : s,
      )
    try {
      set('selected')
      await new Promise((resolve) => setTimeout(resolve, 200))
      if (token !== generation.current) return
      set('processing')
      await new Promise((resolve) => setTimeout(resolve, 300))
      if (token !== generation.current) return
      set('checking')
      await new Promise((resolve) => setTimeout(resolve, 300))
      if (token !== generation.current) return
      const messages = {
        format: 'Format i papranueshëm · gabim i simuluar. Zgjidhni një mostër tjetër.',
        size: 'Mostra tejkalon kufirin demo prej 5 MB.',
        interrupted: 'Përpunimi i simuluar u ndërpre. Provoni përsëri.',
        none: '',
      }
      set(fault === 'none' ? 'ready' : 'failed', messages[fault])
      await flush()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Dokumenti nuk u përpunua.')
    } finally {
      if (token === generation.current) {
        working.current = false
        setBusy(false)
      }
    }
  }
  const submit = async (supplement = false, consent = false) => {
    if (working.current) return false
    working.current = true
    setBusy(true)
    const token = generation.current
    try {
      if (!(await transact((s) => beginSubmission(s, supplement, consent)))) return false
      await new Promise((resolve) => setTimeout(resolve, 600))
      if (token !== generation.current) return false
      return await transact((s) => simulateReceipt(s, faultsRef.current.transmission, supplement))
    } finally {
      if (token === generation.current) {
        working.current = false
        setBusy(false)
      }
    }
  }
  const checkReceipt = async (supplement = false) => {
    await transact((s) => {
      const record = supplement ? s.application?.supplement : s.application?.submission
      if (!record) return s
      // An interrupted browser may not have run the simulator yet. Reuse the reference.
      return s.bankReceipts.includes(record.reference)
        ? acknowledge(s, supplement)
        : simulateReceipt(s, false, supplement)
    })
  }
  const logout = async () => {
    if (busy || !(await flush())) return
    try {
      window.sessionStorage.removeItem(SESSION_KEY)
      setSession(false)
    } catch {
      setError('Dalja nuk mund të ruhet. Provoni përsëri.')
    }
  }
  if (!hydrated)
    return (
      <main className="m-loading" aria-busy="true">
        <span className="m-wordmark">
          MarketOne<span> / </span>
        </span>
        <p role="status">Po rikthehet hapësira e biznesit…</p>
      </main>
    )
  if (loadError || !state)
    return (
      <main className="m-loading">
        <div className="m-panel">
          <h1>Të dhënat lokale kërkojnë vëmendje</h1>
          <p role="alert">{loadError}</p>
          <p>
            Asgjë nuk është mbishkruar. Mund të provoni përsëri ose të nisni një demonstrim të ri.
          </p>
          <div className="m-actions">
            <button className="m-button" onClick={() => void initialize()}>
              Provo përsëri
            </button>
            <button
              className="m-button secondary"
              onClick={() => {
                if (window.confirm('Të zëvendësohen të dhënat lokale të demonstrimit?'))
                  void reset(false)
              }}
            >
              Rivendos demonstrimin
            </button>
          </div>
        </div>
      </main>
    )
  if (!session)
    return (
      <main className="m-entry">
        <section>
          <div className="m-wordmark">
            MarketOne<span> / </span>
          </div>
          <p className="m-eyebrow">Hapësira e biznesit</p>
          <h1>
            Biznesi juaj.
            <br />
            Hapi i radhës,
            <br />
            <em>më i qartë.</em>
          </h1>
          <p>
            Aktiviteti i ditës, veprimet që presin dhe financimi i biznesit — në një hapësirë të
            vetme.
          </p>
          <div className="m-entry-foot">
            01 / Kuptoni aktivitetin
            <br />
            02 / Menaxhoni biznesin
            <br />
            03 / Përgatitni financimin
          </div>
        </section>
        <section className="m-entry-form">
          <div className="m-panel">
            <span className="m-badge">Prototip interaktiv</span>
            <h2>Mirë se u kthyet</h2>
            <p>Hyni si Ana Demo, pronarja e Dyqanit të Lagjes.</p>
            <div className="m-note">
              <b>Vetëm të dhëna demonstrimi.</b>
              <p>
                Hyrja është e simuluar. Draftet ruhen në këtë browser, edhe pas daljes. Përdorni
                vetëm të dhëna fiktive; ruajtja lokale nuk është një llogari e sigurt bankare.
              </p>
            </div>
            <button
              className="m-button wide"
              onClick={() => {
                try {
                  window.sessionStorage.setItem(SESSION_KEY, 'owner-demo')
                  setSession(true)
                } catch {
                  setError('Lejoni ruajtjen për këtë sesion dhe provoni përsëri.')
                }
              }}
            >
              Hyr në hapësirën e biznesit <span aria-hidden="true">→</span>
            </button>
            {error && <p role="alert">{error}</p>}
            <a className="m-text-link" href="/legacy-demo">
              Hap demonstrimin e mëparshëm të porositjes ↗
            </a>
          </div>
        </section>
      </main>
    )
  return (
    <WorkspaceContext.Provider
      value={{
        state,
        faults,
        setFaults,
        change,
        flush,
        transact,
        saveStatus,
        error,
        busy,
        logout,
        reset,
        startApplication: () =>
          transact((s) => (s.application ? s : { ...s, application: createApplication(s) })),
        processDocument,
        submit,
        checkReceipt,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}
