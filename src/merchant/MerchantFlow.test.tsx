import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usePathname } from 'next/navigation'
import type { AnchorHTMLAttributes } from 'react'
import { WorkspaceProvider } from './Workspace'
import { MerchantShell } from './Shell'
import { Overview } from './Overview'
import { ApplicationPage, Financing } from './Financing'
import { Business, Payments, Products, Sales } from './Operations'
import { seedWorkspace } from './domain'
import { SESSION_KEY, STORAGE_KEY } from './repository'

const navigation = vi.hoisted(() => ({
  path: '/overview',
  listeners: new Set<() => void>(),
  navigate: vi.fn(),
}))
vi.mock('next/navigation', async () => {
  const { useSyncExternalStore } = await import('react')
  const subscribe = (listener: () => void) => {
    navigation.listeners.add(listener)
    return () => {
      navigation.listeners.delete(listener)
    }
  }
  const read = () => navigation.path
  return {
    usePathname: () => useSyncExternalStore(subscribe, read).split('?')[0],
    useSearchParams: () =>
      new URLSearchParams(useSyncExternalStore(subscribe, read).split('?')[1] ?? ''),
    useRouter: () => ({ push: navigation.navigate, replace: navigation.navigate }),
  }
})
vi.mock('next/link', () => ({
  default: ({ href, children, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        event.preventDefault()
        onClick?.(event)
        navigation.navigate(href)
      }}
    >
      {children}
    </a>
  ),
}))
function TestApp() {
  const path = usePathname()
  const view =
    path === '/overview' ? (
      <Overview />
    ) : path === '/financing' ? (
      <Financing />
    ) : path === '/financing/application' ? (
      <ApplicationPage />
    ) : path === '/business' ? (
      <Business />
    ) : path === '/products' ? (
      <Products />
    ) : path === '/payments' ? (
      <Payments />
    ) : (
      <Sales />
    )
  return (
    <WorkspaceProvider>
      <MerchantShell>{view}</MerchantShell>
    </WorkspaceProvider>
  )
}
function fill(id: string, value: string) {
  fireEvent.change(document.getElementById(id)!, { target: { value } })
}
async function openApplication(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('link', { name: /Fillo aplikimin/ }))
  await user.click(await screen.findByRole('button', { name: /Fillo aplikimin/ }))
  await screen.findByLabelText('Shuma e kërkuar (USD)')
}
async function next(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Vazhdo' }))
}
beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  sessionStorage.setItem(SESSION_KEY, 'owner-demo')
  navigation.path = '/overview'
  navigation.navigate.mockImplementation((path: string) => {
    navigation.path = path
    navigation.listeners.forEach((listener) => listener())
  })
})
describe('Merchant interface', () => {
  it('confirms an order from its task and retains it across a reload', async () => {
    const user = userEvent.setup(),
      view = render(<TestApp />)
    await screen.findByRole('heading', { name: 'Mirë se erdhët, Ana.' })
    await user.click(screen.getAllByRole('link', { name: /Hap detyrën/ })[0])
    await user.click(await screen.findByRole('button', { name: 'Konfirmo porosinë' }))
    await user.click(screen.getByRole('link', { name: /Përmbledhje/ }))
    expect(screen.queryByText('Konfirmoni porosinë MO-1041')).not.toBeInTheDocument()
    view.unmount()
    render(<TestApp />)
    await screen.findByRole('heading', { name: 'Mirë se erdhët, Ana.' })
    expect(screen.queryByText('Konfirmoni porosinë MO-1041')).not.toBeInTheDocument()
  })
  it('reports partial dashboard failures and recovers without losing tasks', async () => {
    const user = userEvent.setup()
    render(<TestApp />)
    await screen.findByText('Konfirmoni porosinë MO-1041')
    await user.click(screen.getByText('Skenar demonstrimi'))
    await user.click(screen.getByLabelText('Gabim i të dhënave të panelit'))
    expect(screen.getByText('Përmbledhja nuk u rifreskua')).toBeInTheDocument()
    expect(screen.getByText('Konfirmoni porosinë MO-1041')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Provo përsëri' }))
    expect(await screen.findByRole('link', { name: /Shitje në MarketOne/ })).toBeInTheDocument()
  })
  it('saves a draft, retains it after logout and refresh, and reports failed saves honestly', async () => {
    const user = userEvent.setup(),
      view = render(<TestApp />)
    await openApplication(user)
    fill('credit-amount', '3000')
    fill('credit-explanation', 'Stok demonstrues')
    await user.click(screen.getByText('Skenar demonstrimi'))
    await user.click(screen.getByLabelText('Dështim i ruajtjes lokale'))
    await user.click(screen.getByRole('button', { name: 'Ruaj dhe dil' }))
    expect(await screen.findByText(/Ndryshimet e fundit nuk u ruajtën/)).toBeInTheDocument()
    expect(screen.getByLabelText('Shuma e kërkuar (USD)')).toHaveValue('3000')
    expect(navigation.path).toContain('/financing/application')
    await user.click(screen.getByLabelText('Dështim i ruajtjes lokale'))
    await user.click(screen.getByRole('button', { name: 'Ruaj dhe dil' }))
    await screen.findByRole('heading', { name: 'Mirë se erdhët, Ana.' })
    await user.click(screen.getByRole('button', { name: 'Dil' }))
    expect(await screen.findByRole('button', { name: /Hyr në hapësirën/ })).toBeInTheDocument()
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).application.form.amount).toBe('3000')
    view.unmount()
    render(<TestApp />)
    await user.click(await screen.findByRole('button', { name: /Hyr në hapësirën/ }))
    await user.click(screen.getByRole('link', { name: /Vazhdo aplikimin/ }))
    expect(await screen.findByLabelText('Shuma e kërkuar (USD)')).toHaveValue('3000')
  })
  it('completes the wizard, reconciles timeout, and answers a bank request with separate consent', async () => {
    const user = userEvent.setup()
    render(<TestApp />)
    await openApplication(user)
    await next(user)
    expect(
      await screen.findByText('Shkruani një shumë pozitive me deri në dy shifra dhjetore.', {
        selector: 'p',
      }),
    ).toBeInTheDocument()
    fill('credit-amount', '3000')
    fill('credit-explanation', 'Rimbushje stoku për dyqanin')
    await next(user)
    expect(await screen.findByLabelText('Emri i biznesit')).toHaveValue('Dyqani i Lagjes')
    await next(user)
    await screen.findByLabelText('Xhiro e deklaruar (USD)')
    fill('credit-turnover', '8000')
    fill('credit-expenses', '6000')
    await user.click(screen.getByText('Skenar demonstrimi'))
    await user.selectOptions(screen.getByLabelText('Skenari i dokumentit'), 'format')
    await user.selectOptions(screen.getByLabelText('Mostra për Regjistrimi i biznesit'), 'sample')
    await user.click(screen.getByRole('button', { name: /Përdor mostrën.*Regjistrimi/ }))
    expect(await screen.findByText(/Format i papranueshëm · gabim i simuluar/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Riprovo mostrën.*Regjistrimi/ }))
    await screen.findByText('Gati', { selector: '.m-badge' })
    for (const label of ['Identiteti / përfaqësimi', 'Dokumenti i qarkullimit']) {
      await user.selectOptions(screen.getByLabelText('Mostra për ' + label), 'sample')
      const row = screen.getByText(label, { selector: 'b' }).closest('.m-document')!
      await user.click(within(row as HTMLElement).getByRole('button', { name: /Përdor mostrën/ }))
      await waitFor(() => expect(within(row as HTMLElement).getByText('Gati')).toBeInTheDocument())
    }
    await next(user)
    const consent = await screen.findByRole('checkbox', {
      name: /Autorizoj ndarjen e këtij versioni/,
    })
    expect(consent).not.toBeChecked()
    await user.click(consent)
    await user.click(screen.getByLabelText('Timeout gjatë dërgimit'))
    await user.click(screen.getByRole('button', { name: 'Dërgo te banka demo' }))
    await screen.findByRole('heading', { name: 'Marrja ende nuk është konfirmuar' })
    await user.click(screen.getByRole('button', { name: 'Kontrollo marrjen' }))
    await screen.findByRole('heading', { name: 'Marrë nga banka demo' })
    await user.click(screen.getByRole('button', { name: 'Nis shqyrtimin' }))
    await user.click(screen.getByRole('button', { name: 'Kërko dokument shtesë' }))
    await screen.findByRole('heading', { name: 'Plotësoni kërkesën e bankës' })
    await user.selectOptions(
      screen.getByLabelText('Mostra për Dokumenti shtesë i qarkullimit'),
      'sample',
    )
    await user.click(screen.getByRole('button', { name: /Përdor mostrën.*shtesë/ }))
    await waitFor(() =>
      expect(
        screen.getByRole('checkbox', { name: /Autorizoj ndarjen e dokumentit shtesë/ }),
      ).toBeEnabled(),
    )
    await user.click(
      screen.getByRole('checkbox', { name: /Autorizoj ndarjen e dokumentit shtesë/ }),
    )
    await user.click(screen.getByRole('button', { name: 'Dërgo përgjigjen te banka demo' }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Kontrollo marrjen e përgjigjes' })).toBeEnabled(),
    )
    await user.click(screen.getByRole('button', { name: 'Kontrollo marrjen e përgjigjes' }))
    await screen.findByRole('heading', { name: 'Në shqyrtim' })
    await user.click(screen.getByRole('button', { name: 'Simulo miratimin' }))
    await screen.findByRole('heading', { name: 'Miratuar · simulim' })
    expect(screen.getByText(/Miratimi nuk është disbursim/)).toBeInTheDocument()
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(saved.bankReceipts).toHaveLength(2)
    expect(saved.application.submission.snapshot.documents).toHaveLength(3)
    expect(document.querySelector('input[type=file]')).toBeNull()
  }, 20000)
  it('offers recovery for corrupt storage instead of silently overwriting it', async () => {
    localStorage.setItem(STORAGE_KEY, 'corrupt')
    render(<TestApp />)
    expect(
      await screen.findByRole('heading', { name: 'Të dhënat lokale kërkojnë vëmendje' }),
    ).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toBe('corrupt')
  })
  it('provides actionable setup for a new business and persists a new product', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedWorkspace(true)))
    const user = userEvent.setup()
    render(<TestApp />)
    await screen.findByRole('heading', { name: 'Le ta përgatisim biznesin tuaj' })
    await user.click(screen.getByRole('link', { name: 'Produkti i parë' }))
    await user.click(screen.getByRole('button', { name: /Shto produkt/ }))
    fill('product-name', 'Produkt demo')
    fill('product-price', '2.50')
    fill('product-stock', '10')
    await user.click(screen.getByRole('button', { name: 'Ruaj produktin' }))
    expect(await screen.findByText('Produkt demo', { selector: 'b' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).products[0].price).toBe(250)
  })
})
