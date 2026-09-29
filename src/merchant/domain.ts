import {
  BANK,
  type ApplicationForm,
  type CreditApplication,
  type CreditStatus,
  type DemoDocument,
  type DocumentKind,
  type DocumentStatus,
  type SubmissionRecord,
  type Workspace,
} from './model'

export const money = (cents: number) =>
  new Intl.NumberFormat('sq-AL', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code',
  }).format(cents / 100)
const months = [
  'janar',
  'shkurt',
  'mars',
  'prill',
  'maj',
  'qershor',
  'korrik',
  'gusht',
  'shtator',
  'tetor',
  'nëntor',
  'dhjetor',
]
export const dateLabel = (date: Date) =>
  date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear()
export const dateTime = (value: string) => {
  const date = new Date(value)
  return (
    dateLabel(date) +
    ', ' +
    String(date.getHours()).padStart(2, '0') +
    ':' +
    String(date.getMinutes()).padStart(2, '0')
  )
}
export function cents(value: string): number | null {
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(value.trim())) return null
  const [whole, fraction = ''] = value.trim().replace(',', '.').split('.')
  const amount = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  return Number.isSafeInteger(amount) ? amount : null
}
export const orderTotal = (order: Workspace['orders'][number]) =>
  order.lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
export function salesTotal(state: Workspace, days: number, now = new Date()) {
  const from = new Date(now)
  from.setHours(0, 0, 0, 0)
  from.setDate(from.getDate() - days + 1)
  return state.orders
    .filter(
      (o) =>
        o.status === 'completed' && new Date(o.createdAt) >= from && new Date(o.createdAt) <= now,
    )
    .reduce((sum, order) => sum + orderTotal(order), 0)
}
export function profileComplete(profile: Workspace['profile']) {
  return (
    ['name', 'activity', 'registration', 'address', 'representative', 'email', 'phone'].every(
      (key) => String(profile[key as keyof typeof profile]).trim(),
    ) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)
  )
}
export function seedWorkspace(fresh = false, now = new Date()): Workspace {
  const at = (days: number) => new Date(now.getTime() - days * 86400000).toISOString()
  return {
    version: 1,
    instanceId: 'demo-' + now.getTime(),
    updatedAt: at(0),
    profile: {
      name: 'Dyqani i Lagjes',
      activity: 'Tregti me pakicë',
      registration: fresh ? '' : 'DEMO-024',
      address: fresh ? '' : 'Rruga e Shembullit, 12 · adresë fiktive',
      representative: 'Ana Demo',
      email: 'ana@example.com',
      phone: fresh ? '' : '+355000000000',
      configured: !fresh,
    },
    products: fresh
      ? []
      : [
          { id: 'p1', name: 'Oriz, 1 kg', price: 250, stock: 40, active: true },
          { id: 'p2', name: 'Vaj ulliri, 1 l', price: 900, stock: 18, active: true },
          { id: 'p3', name: 'Kafe, 250 g', price: 600, stock: 0, active: false },
        ],
    orders: fresh
      ? []
      : [
          {
            id: 'MO-1042',
            customer: 'Klient demonstrues A',
            status: 'pending',
            createdAt: at(0),
            lines: [{ name: 'Oriz, 1 kg', price: 250, quantity: 4 }],
          },
          {
            id: 'MO-1041',
            customer: 'Klient demonstrues B',
            status: 'pending',
            createdAt: at(1),
            lines: [{ name: 'Vaj ulliri, 1 l', price: 900, quantity: 2 }],
          },
          {
            id: 'MO-1040',
            customer: 'Klient demonstrues C',
            status: 'completed',
            createdAt: at(2),
            lines: [{ name: 'Porosi e përfunduar · mostër', price: 38000, quantity: 1 }],
          },
          {
            id: 'MO-1039',
            customer: 'Klient demonstrues D',
            status: 'completed',
            createdAt: at(4),
            lines: [{ name: 'Porosi e përfunduar · mostër', price: 86000, quantity: 1 }],
          },
          {
            id: 'MO-1038',
            customer: 'Klient demonstrues E',
            status: 'cancelled',
            createdAt: at(5),
            lines: [{ name: 'Kafe, 250 g', price: 600, quantity: 2 }],
          },
        ],
    payouts: fresh
      ? []
      : [
          {
            id: 'PAY-024',
            amount: 38000,
            status: 'pending',
            orderIds: ['MO-1040'],
            createdAt: at(1),
          },
          { id: 'PAY-023', amount: 86000, status: 'paid', orderIds: ['MO-1039'], createdAt: at(3) },
        ],
    application: null,
    bankReceipts: [],
    activity: [
      {
        id: 'joined',
        text: fresh
          ? 'Biznesi demonstrues u bashkua me rrjetin.'
          : 'Profili i biznesit u përditësua.',
        at: at(0),
      },
    ],
  }
}
const blankDocument = (kind: DocumentKind): DemoDocument => ({
  kind,
  status: 'missing',
  sampleId: '',
  message: '',
})
export function createApplication(state: Workspace, now = new Date()): CreditApplication {
  const { name, activity, registration, address, representative, email, phone } = state.profile
  const period = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return {
    id: 'MO-DEMO-024',
    version: 1,
    step: 1,
    status: 'draft',
    authorisedVersion: null,
    submission: null,
    supplement: null,
    form: {
      amount: '',
      purpose: 'Rimbushje stoku',
      months: '12',
      explanation: '',
      name,
      activity,
      registration,
      address,
      representative,
      email,
      phone,
      turnover: '',
      expenses: '',
      period: period.getFullYear() + '-' + String(period.getMonth() + 1).padStart(2, '0'),
      hasDebt: 'no',
      debt: '',
      installment: '',
    },
    documents: {
      registration: blankDocument('registration'),
      identity: blankDocument('identity'),
      turnover: blankDocument('turnover'),
      supplement: blankDocument('supplement'),
    },
    events: [],
    request: null,
    decision: null,
  }
}
export type Errors = Partial<Record<keyof ApplicationForm | 'documents' | 'authorisation', string>>
export function validateApplication(app: CreditApplication, step?: number): Errors {
  const errors: Errors = {},
    form = app.form
  const required = (key: keyof ApplicationForm, label: string) => {
    if (!form[key].trim()) errors[key] = 'Plotësoni ' + label + '.'
  }
  if (!step || step === 1) {
    if ((cents(form.amount) ?? 0) <= 0)
      errors.amount = 'Shkruani një shumë pozitive me deri në dy shifra dhjetore.'
    if (
      !/^\d+$/.test(form.months) ||
      !Number.isSafeInteger(Number(form.months)) ||
      Number(form.months) < 1
    )
      errors.months = 'Shkruani një numër të plotë pozitiv muajsh.'
    required('purpose', 'qëllimin')
    required('explanation', 'përshkrimin e nevojës')
  }
  if (!step || step === 2) {
    for (const key of [
      'name',
      'activity',
      'registration',
      'address',
      'representative',
      'email',
      'phone',
    ] as const)
      required(key, 'fushën')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = 'Shkruani një email të vlefshëm demonstrues.'
  }
  if (!step || step === 3) {
    if (cents(form.turnover) === null)
      errors.turnover = 'Shkruani xhiron, zero ose një shumë pozitive.'
    if (cents(form.expenses) === null)
      errors.expenses = 'Shkruani shpenzimet, zero ose një shumë pozitive.'
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(form.period))
      errors.period = 'Zgjidhni muajin e raportimit.'
    if (!['yes', 'no'].includes(form.hasDebt)) errors.hasDebt = 'Tregoni nëse ka detyrime.'
    if (form.hasDebt === 'yes') {
      if ((cents(form.debt) ?? 0) <= 0) errors.debt = 'Shkruani detyrimin e mbetur pozitiv.'
      if (cents(form.installment) === null)
        errors.installment = 'Shkruani pagesën periodike, zero ose pozitive.'
    }
  }
  if (!step) {
    if (
      ['registration', 'identity', 'turnover'].some(
        (kind) => app.documents[kind as DocumentKind].status !== 'ready',
      )
    )
      errors.documents = 'Plotësoni tre dokumentet e detyrueshme.'
    if (app.authorisedVersion !== app.version)
      errors.authorisation = 'Autorizoni ndarjen e këtij versioni përpara dërgimit.'
  }
  return errors
}
export function editApplication(app: CreditApplication, patch: Partial<ApplicationForm>) {
  if (app.submission) throw new Error('Aplikimi i dërguar nuk ndryshohet.')
  return {
    ...app,
    form: { ...app.form, ...patch },
    version: app.version + 1,
    authorisedVersion: null,
  }
}
export function updateDocument(
  app: CreditApplication,
  kind: DocumentKind,
  status: DocumentStatus,
  message = '',
) {
  if (
    app.submission &&
    (kind !== 'supplement' || app.status !== 'information_required' || app.supplement)
  )
    throw new Error('Ky dokument nuk mund të ndryshohet.')
  return {
    ...app,
    version: app.version + 1,
    authorisedVersion: null,
    documents: {
      ...app.documents,
      [kind]: { kind, status, sampleId: kind + '-sample.pdf', message },
    },
  }
}
function addEvent(
  app: CreditApplication,
  id: string,
  text: string,
  actor: 'MarketOne' | 'Banka demo',
  now: Date,
) {
  if (app.events.some((event) => event.id === id)) return app
  return { ...app, events: [...app.events, { id, text, actor, at: now.toISOString() }] }
}
export function beginSubmission(
  state: Workspace,
  supplement = false,
  consent = false,
  now = new Date(),
): Workspace {
  const app = state.application
  if (!app) throw new Error('Aplikimi mungon.')
  if (supplement ? app.supplement : app.submission) return state
  if (supplement) {
    if (
      app.status !== 'information_required' ||
      app.documents.supplement.status !== 'ready' ||
      !consent
    )
      throw new Error('Rishikoni dokumentin dhe autorizoni përgjigjen.')
  } else if (Object.keys(validateApplication(app)).length)
    throw new Error('Plotësoni fushat, dokumentet dhe autorizimin.')
  const reference = app.id + (supplement ? '-SUP-1' : '-V' + app.version)
  const base = {
    reference,
    version: app.version,
    delivery: 'sending' as const,
    at: now.toISOString(),
    authorisedAt: now.toISOString(),
  }
  let next: CreditApplication
  if (supplement) {
    next = {
      ...app,
      step: 5,
      supplement: {
        ...base,
        snapshot: {
          applicationReference: app.submission!.reference,
          period: app.request!.period,
          documents: [{ ...app.documents.supplement }],
          bank: BANK,
        },
      },
    }
  } else {
    const record: SubmissionRecord = {
      ...base,
      snapshot: {
        form: structuredClone(app.form),
        documents: Object.values(app.documents)
          .filter((doc) => doc.kind !== 'supplement')
          .map((doc) => ({ ...doc })),
        platformSales: salesTotal(state, 30, now),
        platformPeriod: '30 ditët deri më ' + now.toISOString().slice(0, 10),
        currency: 'USD',
        bank: BANK,
      },
    }
    next = { ...app, step: 5, submission: record }
  }
  next = addEvent(
    next,
    reference + '-sending',
    supplement
      ? 'Përgjigjja u regjistrua për dërgim të simuluar.'
      : 'Aplikimi u regjistrua për dërgim të simuluar.',
    'MarketOne',
    now,
  )
  return { ...state, application: next, updatedAt: now.toISOString() }
}
export function simulateReceipt(
  state: Workspace,
  timeout: boolean,
  supplement = false,
  now = new Date(),
): Workspace {
  const app = state.application,
    record = supplement ? app?.supplement : app?.submission
  if (!app || !record || record.delivery === 'acknowledged') return state
  const nextState = {
    ...state,
    bankReceipts: [...new Set([...state.bankReceipts, record.reference])],
  }
  if (timeout)
    return {
      ...nextState,
      application: {
        ...app,
        [supplement ? 'supplement' : 'submission']: { ...record, delivery: 'unconfirmed' },
      },
    }
  return acknowledge(nextState, supplement, now)
}
export function acknowledge(state: Workspace, supplement = false, now = new Date()): Workspace {
  const app = state.application,
    record = supplement ? app?.supplement : app?.submission
  if (
    !app ||
    !record ||
    record.delivery === 'acknowledged' ||
    !state.bankReceipts.includes(record.reference)
  )
    return state
  let next: CreditApplication = {
    ...app,
    status: supplement ? 'under_review' : 'received',
    [supplement ? 'supplement' : 'submission']: { ...record, delivery: 'acknowledged' },
  }
  next = addEvent(
    next,
    record.reference + '-received',
    supplement
      ? 'Banka demo mori dokumentin shtesë; shqyrtimi vazhdon.'
      : 'Banka demo konfirmoi marrjen e aplikimit.',
    'Banka demo',
    now,
  )
  return { ...state, application: next, updatedAt: now.toISOString() }
}
export function bankTransition(
  state: Workspace,
  status: CreditStatus,
  now = new Date(),
): Workspace {
  const app = state.application
  if (!app || app.submission?.delivery !== 'acknowledged')
    throw new Error('Pritet konfirmimi i marrjes.')
  const valid =
    app.status === 'received'
      ? status === 'under_review'
      : app.status === 'under_review' &&
        (status === 'approved' ||
          status === 'rejected' ||
          (status === 'information_required' && !app.request))
  if (!valid) return state
  let next: CreditApplication = { ...app, status }
  if (status === 'information_required')
    next.request = {
      message: 'Dërgoni dokumentin shtesë të qarkullimit për periudhën e aplikimit.',
      period: app.form.period,
      at: now.toISOString(),
    }
  if (status === 'approved')
    next.decision = {
      message:
        'Vendim pozitiv demonstrues. Kushtet dhe hapat pasues do të konfirmoheshin nga banka. Fondet nuk janë disbursuar.',
      approvedAmount: cents(app.form.amount),
    }
  if (status === 'rejected')
    next.decision = {
      message:
        'Kërkesa nuk u miratua në këtë skenar demonstrimi. Simulatori nuk jep arsye tjetër. Kontaktoni përfaqësuesin e bankës për sqarime në një shërbim real.',
      approvedAmount: null,
    }
  const texts = {
    under_review: 'Filloi shqyrtimi i simuluar.',
    information_required: 'U kërkua një dokument shtesë.',
    approved: 'U komunikua miratimi demonstrues.',
    rejected: 'U komunikua refuzimi demonstrues.',
  }
  next = addEvent(next, 'bank-' + status, texts[status as keyof typeof texts], 'Banka demo', now)
  return { ...state, application: next, updatedAt: now.toISOString() }
}
export function confirmOrder(state: Workspace, id: string, now = new Date()): Workspace {
  if (!state.orders.some((o) => o.id === id && o.status === 'pending')) return state
  return {
    ...state,
    orders: state.orders.map((o) => (o.id === id ? { ...o, status: 'confirmed' } : o)),
    updatedAt: now.toISOString(),
    activity: [
      { id: id + '-confirmed', text: 'Porosia ' + id + ' u konfirmua.', at: now.toISOString() },
      ...state.activity,
    ],
  }
}
export function tasks(state: Workspace) {
  const result: {
    id: string
    title: string
    detail: string
    href: string
    priority: number
    at: string
  }[] = []
  if (state.application?.status === 'information_required')
    result.push({
      id: 'bank-request',
      title: 'Banka demo kërkon një dokument',
      detail: 'Plotësoni kërkesën për të vazhduar shqyrtimin.',
      href: '/financing/application?step=5',
      priority: 0,
      at: state.application.request?.at ?? state.updatedAt,
    })
  if (!profileComplete(state.profile))
    result.push({
      id: 'profile',
      title: 'Plotësoni profilin e biznesit',
      detail: 'Konfirmoni të dhënat e biznesit dhe përfaqësuesit.',
      href: '/business',
      priority: 1,
      at: state.updatedAt,
    })
  for (const order of state.orders.filter((o) => o.status === 'pending'))
    result.push({
      id: order.id,
      title: 'Konfirmoni porosinë ' + order.id,
      detail: money(orderTotal(order)) + ' · ' + order.customer,
      href: '/sales?order=' + order.id,
      priority: 2,
      at: order.createdAt,
    })
  return result.sort((a, b) => a.priority - b.priority || a.at.localeCompare(b.at))
}
export function fundingAction(app: CreditApplication | null) {
  if (!app) return { label: 'Fillo aplikimin', href: '/financing' }
  if (app.status === 'information_required')
    return { label: 'Plotëso kërkesën e bankës', href: '/financing/application?step=5' }
  if (app.submission) return { label: 'Shiko statusin', href: '/financing/application?step=5' }
  return { label: 'Vazhdo aplikimin', href: '/financing/application?step=' + app.step }
}
