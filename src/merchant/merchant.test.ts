import { describe, expect, it } from 'vitest'
import {
  acknowledge,
  bankTransition,
  beginSubmission,
  cents,
  confirmOrder,
  createApplication,
  editApplication,
  fundingAction,
  orderTotal,
  salesTotal,
  seedWorkspace,
  simulateReceipt,
  tasks,
  updateDocument,
  validateApplication,
} from './domain'
import {
  DemoRepository,
  InvalidWorkspaceError,
  isWorkspace,
  recoverInterrupted,
  STORAGE_KEY,
  type StoragePort,
} from './repository'
import type { DocumentKind, Workspace } from './model'

const now = new Date('2026-09-28T10:00:00.000Z')
function ready(): Workspace {
  const state = seedWorkspace(false, now)
  let app = createApplication(state, now)
  app = editApplication(app, {
    amount: '3000',
    explanation: 'Stok demonstrues për dyqanin',
    turnover: '8000',
    expenses: '6000',
  })
  for (const kind of ['registration', 'identity', 'turnover'] as DocumentKind[])
    app = updateDocument(app, kind, 'ready')
  app.authorisedVersion = app.version
  return { ...state, application: app }
}
function reviewing() {
  return bankTransition(
    simulateReceipt(beginSubmission(ready(), false, false, now), false, false, now),
    'under_review',
    now,
  )
}
function memory(): StoragePort & { data: Map<string, string> } {
  const data = new Map<string, string>()
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value)
    },
    removeItem: (key) => {
      data.delete(key)
    },
  }
}
describe('Merchant records and business actions', () => {
  it('reconciles completed sales, payouts, and pending tasks without counting cancelled orders', () => {
    const state = seedWorkspace(false, now)
    expect(salesTotal(state, 7, now)).toBe(124000)
    expect(state.payouts.reduce((sum, p) => sum + p.amount, 0)).toBe(124000)
    expect(tasks(state).map((t) => t.id)).toEqual(['MO-1041', 'MO-1042'])
    expect(orderTotal(state.orders[0])).toBe(1000)
  })
  it('confirms an order once without creating sales, stock movements, or payouts', () => {
    const original = seedWorkspace(false, now)
    const next = confirmOrder(original, 'MO-1041', now)
    expect(tasks(next)).toHaveLength(1)
    expect(salesTotal(next, 7, now)).toBe(124000)
    expect(next.products).toEqual(original.products)
    expect(next.payouts).toEqual(original.payouts)
    expect(confirmOrder(next, 'MO-1041', now)).toBe(next)
    expect(next.activity.filter((e) => e.id === 'MO-1041-confirmed')).toHaveLength(1)
  })
  it('shows setup for a new business with no invented activity', () => {
    const state = seedWorkspace(true, now)
    expect(salesTotal(state, 7, now)).toBe(0)
    expect(state.orders).toHaveLength(0)
    expect(tasks(state)[0].href).toBe('/business')
    expect(fundingAction(state.application).label).toBe('Fillo aplikimin')
  })
  it('keeps the saved application profile separate from later business edits', () => {
    const state = ready()
    state.profile.name = 'Biznes i ndryshuar'
    expect(state.application!.form.name).toBe('Dyqani i Lagjes')
  })
})
describe('Application validation and authorisation', () => {
  it.each([
    ['0', 0],
    ['123.45', 12345],
    ['123,4', 12340],
    ['-1', null],
    ['1e3', null],
    ['.3', null],
    ['1.001', null],
    ['99999999999999999', null],
  ])('parses money %s as minor units safely', (input, expected) => {
    expect(cents(input as string)).toBe(expected)
  })
  it('validates required financial declarations while allowing zero', () => {
    const state = ready(),
      app = state.application!
    expect(validateApplication(app)).toEqual({})
    app.form.turnover = '0'
    app.form.expenses = '0'
    expect(validateApplication(app, 3)).toEqual({})
    app.form.hasDebt = 'yes'
    app.form.debt = '0'
    app.form.installment = '-1'
    expect(validateApplication(app, 3)).toHaveProperty('debt')
    expect(validateApplication(app, 3)).toHaveProperty('installment')
  })
  it('does not pre-authorise an application and invalidates consent after an edit', () => {
    const state = ready()
    expect(createApplication(state, now).authorisedVersion).toBeNull()
    state.application = editApplication(state.application!, { amount: '4000' })
    expect(validateApplication(state.application)).toHaveProperty('authorisation')
    expect(() => beginSubmission(state)).toThrow()
  })
  it('allows step-three review with missing documents but blocks submission', () => {
    const state = ready()
    state.application!.documents.turnover.status = 'failed'
    expect(validateApplication(state.application!, 3)).toEqual({})
    expect(validateApplication(state.application!)).toHaveProperty('documents')
    expect(() => beginSubmission(state)).toThrow()
  })
  it('replaces a failed sample without discarding form values', () => {
    const app = updateDocument(ready().application!, 'turnover', 'failed', 'Interrupted')
    const next = updateDocument(app, 'turnover', 'ready')
    expect(next.form).toEqual(app.form)
    expect(next.documents.turnover.status).toBe('ready')
    expect(next.authorisedVersion).toBeNull()
  })
})
describe('Simulated bank lifecycle', () => {
  it('freezes the reviewed package and keeps receipt separate from submitting', () => {
    const original = ready(),
      state = beginSubmission(original, false, false, now)
    expect(state.application!.submission!.delivery).toBe('sending')
    expect(state.application!.status).toBe('draft')
    expect(state.bankReceipts).toHaveLength(0)
    expect(state.application!.submission!.snapshot.platformSales).toBe(124000)
    original.application!.form.name = 'Changed source'
    expect(state.application!.submission!.snapshot.form.name).toBe('Dyqani i Lagjes')
    expect(() => editApplication(state.application!, { amount: '2' })).toThrow()
  })
  it('reuses one reference through timeout, reload, repeated submission, and reconciliation', async () => {
    const store = memory(),
      repository = new DemoRepository(store, () => now)
    const sending = beginSubmission(ready(), false, false, now)
    const timeout = simulateReceipt(sending, true, false, now)
    expect(timeout.application!.status).toBe('draft')
    expect(timeout.application!.submission!.delivery).toBe('unconfirmed')
    await repository.save(timeout)
    let restored = await repository.load()
    expect(beginSubmission(restored)).toBe(restored)
    restored = acknowledge(restored, false, now)
    expect(restored.application!.status).toBe('received')
    expect(restored.bankReceipts).toHaveLength(1)
    expect(acknowledge(restored)).toBe(restored)
    expect(simulateReceipt(restored, true)).toBe(restored)
    expect(restored.application!.events.filter((e) => e.id.endsWith('-received'))).toHaveLength(1)
  })
  it('requires acknowledgement before bank review and ignores invalid or old transitions', () => {
    expect(() => bankTransition(beginSubmission(ready()), 'approved')).toThrow()
    const state = reviewing()
    expect(bankTransition(state, 'received')).toBe(state)
    const approved = bankTransition(state, 'approved', now)
    expect(approved.application!.decision!.approvedAmount).toBe(300000)
    expect(bankTransition(approved, 'under_review')).toBe(approved)
    expect(approved.application!.decision!.message).toContain('nuk janë disbursuar')
  })
  it('keeps an information request open until its separately authorised response is acknowledged', () => {
    let state = bankTransition(reviewing(), 'information_required', now)
    const original = structuredClone(state.application!.submission)
    expect(tasks(state)[0].id).toBe('bank-request')
    expect(fundingAction(state.application).label).toBe('Plotëso kërkesën e bankës')
    state = { ...state, application: updateDocument(state.application!, 'supplement', 'ready') }
    expect(() => beginSubmission(state, true, false, now)).toThrow()
    state = beginSubmission(state, true, true, now)
    state = simulateReceipt(state, true, true, now)
    expect(state.application!.status).toBe('information_required')
    state = acknowledge(state, true, now)
    expect(state.application!.status).toBe('under_review')
    expect(tasks(state).some((t) => t.id === 'bank-request')).toBe(false)
    expect(state.application!.submission).toEqual(original)
    expect(state.application!.supplement!.snapshot.documents).toHaveLength(1)
    expect(state.bankReceipts).toHaveLength(2)
    expect(state.application!.supplement!.snapshot).not.toHaveProperty('form')
    expect(state.application!.supplement!.snapshot).not.toHaveProperty('platformSales')
    expect(isWorkspace(state)).toBe(true)
    expect(acknowledge(state, true, now)).toBe(state)
  })
  it('does not create an invented rejection reason or allow a terminal state to regress', () => {
    const rejected = bankTransition(reviewing(), 'rejected', now)
    expect(rejected.application!.decision!.approvedAmount).toBeNull()
    expect(rejected.application!.decision!.message).toContain('nuk jep arsye')
    expect(bankTransition(rejected, 'information_required')).toBe(rejected)
  })
})
describe('Local storage and recovery', () => {
  it('persists drafts and resets only MarketOne workspace data', async () => {
    const store = memory(),
      repo = new DemoRepository(store, () => now)
    store.setItem('unrelated', 'keep')
    await repo.save(ready())
    expect((await repo.load()).application!.form.amount).toBe('3000')
    await repo.reset(true)
    expect((await repo.load()).application).toBeNull()
    expect(store.getItem('unrelated')).toBe('keep')
  })
  it('reports storage failures rather than claiming the draft was saved', async () => {
    const storage: StoragePort = {
      getItem: () => null,
      setItem: () => {
        throw new Error('Quota exceeded')
      },
      removeItem: () => {},
    }
    const repo = new DemoRepository(storage, () => now)
    await expect(repo.save(ready())).rejects.toThrow('Quota exceeded')
  })
  it.each([
    'broken JSON',
    JSON.stringify({ version: 2 }),
    JSON.stringify({ version: 1, profile: {} }),
  ])('does not overwrite malformed stored state', async (raw) => {
    const store = memory()
    store.setItem(STORAGE_KEY, raw)
    await expect(new DemoRepository(store).load()).rejects.toBeInstanceOf(InvalidWorkspaceError)
    expect(store.getItem(STORAGE_KEY)).toBe(raw)
  })
  it('rejects malformed nested submission snapshots before rendering them', () => {
    const state = beginSubmission(ready())
    const broken = JSON.parse(JSON.stringify(state))
    broken.application.submission.snapshot.form = {}
    expect(isWorkspace(broken)).toBe(false)
    expect(isWorkspace(state)).toBe(true)
  })
  it('recovers interrupted processing honestly without losing entered data', () => {
    const state = ready()
    state.application!.documents.turnover.status = 'processing'
    const result = recoverInterrupted(state)
    expect(result.application!.documents.turnover.status).toBe('failed')
    expect(result.application!.authorisedVersion).toBeNull()
    expect(result.application!.form).toEqual(state.application!.form)
    expect(recoverInterrupted(beginSubmission(ready())).application!.submission!.delivery).toBe(
      'unconfirmed',
    )
  })
})
