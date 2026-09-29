import { seedWorkspace } from './domain'
import type { Workspace } from './model'

export const STORAGE_KEY = 'marketone.merchant-demo.v1'
export const SESSION_KEY = 'marketone.merchant-session.v1'
export interface StoragePort {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}
export class InvalidWorkspaceError extends Error {}
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validForm(value: unknown): boolean {
  return (
    object(value) &&
    [
      'amount',
      'purpose',
      'months',
      'explanation',
      'name',
      'activity',
      'registration',
      'address',
      'representative',
      'email',
      'phone',
      'turnover',
      'expenses',
      'period',
      'hasDebt',
      'debt',
      'installment',
    ].every((key) => typeof value[key] === 'string')
  )
}
function validDocument(value: unknown): boolean {
  return (
    object(value) &&
    ['registration', 'identity', 'turnover', 'supplement'].includes(String(value.kind)) &&
    typeof value.sampleId === 'string' &&
    typeof value.message === 'string' &&
    ['missing', 'selected', 'processing', 'checking', 'ready', 'failed'].includes(
      String(value.status),
    )
  )
}
export function isWorkspace(value: unknown): value is Workspace {
  if (
    !object(value) ||
    value.version !== 1 ||
    typeof value.instanceId !== 'string' ||
    !object(value.profile) ||
    typeof value.updatedAt !== 'string' ||
    !Number.isFinite(Date.parse(value.updatedAt))
  )
    return false
  if (
    !['name', 'activity', 'registration', 'address', 'representative', 'email', 'phone'].every(
      (k) => typeof (value.profile as Record<string, unknown>)[k] === 'string',
    ) ||
    typeof value.profile.configured !== 'boolean'
  )
    return false
  if (
    !Array.isArray(value.products) ||
    !value.products.every(
      (p) =>
        object(p) &&
        typeof p.id === 'string' &&
        typeof p.name === 'string' &&
        Number.isSafeInteger(p.price) &&
        Number(p.price) > 0 &&
        Number.isSafeInteger(p.stock) &&
        Number(p.stock) >= 0 &&
        typeof p.active === 'boolean',
    )
  )
    return false
  if (
    !Array.isArray(value.orders) ||
    !value.orders.every(
      (o) =>
        object(o) &&
        typeof o.id === 'string' &&
        typeof o.customer === 'string' &&
        Number.isFinite(Date.parse(String(o.createdAt))) &&
        ['pending', 'confirmed', 'completed', 'cancelled'].includes(String(o.status)) &&
        Array.isArray(o.lines) &&
        o.lines.every(
          (l) =>
            object(l) &&
            typeof l.name === 'string' &&
            Number.isSafeInteger(l.price) &&
            Number.isSafeInteger(l.quantity),
        ),
    )
  )
    return false
  if (
    !Array.isArray(value.payouts) ||
    !value.payouts.every(
      (p) =>
        object(p) &&
        typeof p.id === 'string' &&
        Number.isSafeInteger(p.amount) &&
        ['pending', 'paid'].includes(String(p.status)) &&
        Array.isArray(p.orderIds) &&
        p.orderIds.every((id) => typeof id === 'string') &&
        Number.isFinite(Date.parse(String(p.createdAt))),
    )
  )
    return false
  if (
    !Array.isArray(value.bankReceipts) ||
    !value.bankReceipts.every((v) => typeof v === 'string') ||
    !Array.isArray(value.activity) ||
    !value.activity.every(
      (e) =>
        object(e) &&
        typeof e.id === 'string' &&
        typeof e.text === 'string' &&
        Number.isFinite(Date.parse(String(e.at))),
    )
  )
    return false
  if (value.application !== null) {
    const a = value.application
    if (
      !object(a) ||
      typeof a.id !== 'string' ||
      !Number.isSafeInteger(a.version) ||
      !Number.isInteger(a.step) ||
      Number(a.step) < 1 ||
      Number(a.step) > 5 ||
      ![
        'draft',
        'received',
        'under_review',
        'information_required',
        'approved',
        'rejected',
      ].includes(String(a.status))
    )
      return false
    if (
      !object(a.form) ||
      ![
        'amount',
        'purpose',
        'months',
        'explanation',
        'name',
        'activity',
        'registration',
        'address',
        'representative',
        'email',
        'phone',
        'turnover',
        'expenses',
        'period',
        'hasDebt',
        'debt',
        'installment',
      ].every((k) => typeof (a.form as Record<string, unknown>)[k] === 'string')
    )
      return false
    if (
      !object(a.documents) ||
      !['registration', 'identity', 'turnover', 'supplement'].every((k) => {
        const d = (a.documents as Record<string, unknown>)[k]
        return (
          object(d) &&
          d.kind === k &&
          typeof d.sampleId === 'string' &&
          typeof d.message === 'string' &&
          ['missing', 'selected', 'processing', 'checking', 'ready', 'failed'].includes(
            String(d.status),
          )
        )
      })
    )
      return false
    if (a.authorisedVersion !== null && !Number.isSafeInteger(a.authorisedVersion)) return false
    if (
      !Array.isArray(a.events) ||
      !a.events.every(
        (e) =>
          object(e) &&
          typeof e.id === 'string' &&
          typeof e.text === 'string' &&
          ['MarketOne', 'Banka demo'].includes(String(e.actor)) &&
          Number.isFinite(Date.parse(String(e.at))),
      )
    )
      return false
    if (
      a.request !== null &&
      (!object(a.request) ||
        !['message', 'period', 'at'].every(
          (k) => typeof (a.request as Record<string, unknown>)[k] === 'string',
        ))
    )
      return false
    if (
      a.decision !== null &&
      (!object(a.decision) ||
        typeof a.decision.message !== 'string' ||
        (a.decision.approvedAmount !== null && !Number.isSafeInteger(a.decision.approvedAmount)))
    )
      return false
    if (a.status !== 'draft' && a.submission === null) return false
    if (a.status === 'information_required' && a.request === null) return false
    if (['approved', 'rejected'].includes(String(a.status)) && a.decision === null) return false
    for (const key of ['submission', 'supplement']) {
      const r = a[key]
      if (
        r !== null &&
        (!object(r) ||
          typeof r.reference !== 'string' ||
          !['sending', 'unconfirmed', 'acknowledged'].includes(String(r.delivery)) ||
          !Number.isSafeInteger(r.version) ||
          !Number.isFinite(Date.parse(String(r.at))) ||
          !Number.isFinite(Date.parse(String(r.authorisedAt))) ||
          !object(r.snapshot) ||
          (key === 'submission' && !validForm(r.snapshot.form)) ||
          !Array.isArray(r.snapshot.documents) ||
          !r.snapshot.documents.every(validDocument) ||
          (key === 'submission' && !Number.isSafeInteger(r.snapshot.platformSales)) ||
          (key === 'submission' && typeof r.snapshot.platformPeriod !== 'string') ||
          typeof r.snapshot.bank !== 'string' ||
          (key === 'submission' && r.snapshot.currency !== 'USD') ||
          (key === 'supplement' &&
            (typeof r.snapshot.applicationReference !== 'string' ||
              typeof r.snapshot.period !== 'string' ||
              r.snapshot.documents.length !== 1 ||
              'form' in r.snapshot ||
              'platformSales' in r.snapshot)))
      )
        return false
    }
  }
  return true
}
export function recoverInterrupted(state: Workspace): Workspace {
  const result = structuredClone(state)
  if (result.application) {
    for (const doc of Object.values(result.application.documents)) {
      if (['selected', 'processing', 'checking'].includes(doc.status)) {
        doc.status = 'failed'
        doc.message = 'Përpunimi u ndërpre. Zgjidhni përsëri mostrën.'
        result.application.authorisedVersion = null
      }
    }
    for (const record of [result.application.submission, result.application.supplement])
      if (record?.delivery === 'sending') record.delivery = 'unconfirmed'
  }
  return result
}
export class DemoRepository {
  constructor(
    private storage: StoragePort,
    private clock: () => Date = () => new Date(),
  ) {}
  async load(): Promise<Workspace> {
    const raw = this.storage.getItem(STORAGE_KEY)
    if (raw === null) {
      const seeded = seedWorkspace(false, this.clock())
      await this.save(seeded)
      return seeded
    }
    let value: unknown
    try {
      value = JSON.parse(raw)
    } catch {
      throw new InvalidWorkspaceError('Të dhënat lokale nuk mund të lexohen.')
    }
    if (!isWorkspace(value))
      throw new InvalidWorkspaceError(
        'Të dhënat lokale kanë format të dëmtuar ose version të pambështetur.',
      )
    return recoverInterrupted(value)
  }
  async save(state: Workspace) {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
  async reset(fresh = false) {
    const state = seedWorkspace(fresh, this.clock())
    await this.save(state)
    return state
  }
}
