export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type CreditStatus =
  | 'draft'
  | 'received'
  | 'under_review'
  | 'information_required'
  | 'approved'
  | 'rejected'
export type DeliveryStatus = 'sending' | 'unconfirmed' | 'acknowledged'
export type DocumentKind = 'registration' | 'identity' | 'turnover' | 'supplement'
export type DocumentStatus = 'missing' | 'selected' | 'processing' | 'checking' | 'ready' | 'failed'
export interface BusinessProfile {
  name: string
  activity: string
  registration: string
  address: string
  representative: string
  email: string
  phone: string
  configured: boolean
}
export interface MerchantProduct {
  id: string
  name: string
  price: number
  stock: number
  active: boolean
}
export interface MerchantOrder {
  id: string
  customer: string
  status: OrderStatus
  createdAt: string
  lines: { name: string; quantity: number; price: number }[]
}
export interface Payout {
  id: string
  amount: number
  status: 'pending' | 'paid'
  orderIds: string[]
  createdAt: string
}
export interface DemoDocument {
  kind: DocumentKind
  status: DocumentStatus
  sampleId: string
  message: string
}
export interface ApplicationForm {
  amount: string
  purpose: string
  months: string
  explanation: string
  name: string
  activity: string
  registration: string
  address: string
  representative: string
  email: string
  phone: string
  turnover: string
  expenses: string
  period: string
  hasDebt: string
  debt: string
  installment: string
}
export interface ApplicationEvent {
  id: string
  actor: 'MarketOne' | 'Banka demo'
  text: string
  at: string
}
export interface SubmissionRecord {
  reference: string
  version: number
  delivery: DeliveryStatus
  at: string
  authorisedAt: string
  snapshot: {
    form: ApplicationForm
    documents: DemoDocument[]
    platformSales: number
    platformPeriod: string
    currency: 'USD'
    bank: string
  }
}
export interface SupplementRecord extends Omit<SubmissionRecord, 'snapshot'> {
  snapshot: {
    applicationReference: string
    period: string
    documents: DemoDocument[]
    bank: string
  }
}
export interface CreditApplication {
  id: string
  version: number
  step: number
  form: ApplicationForm
  documents: Record<DocumentKind, DemoDocument>
  authorisedVersion: number | null
  status: CreditStatus
  submission: SubmissionRecord | null
  supplement: SupplementRecord | null
  events: ApplicationEvent[]
  request: { message: string; period: string; at: string } | null
  decision: { message: string; approvedAmount: number | null } | null
}
export interface Workspace {
  version: 1
  instanceId: string
  profile: BusinessProfile
  products: MerchantProduct[]
  orders: MerchantOrder[]
  payouts: Payout[]
  application: CreditApplication | null
  bankReceipts: string[]
  activity: { id: string; text: string; at: string }[]
  updatedAt: string
}
export interface DemoFaults {
  dashboard: boolean
  saving: boolean
  document: 'none' | 'format' | 'size' | 'interrupted'
  transmission: boolean
}
export const defaultFaults: DemoFaults = {
  dashboard: false,
  saving: false,
  document: 'none',
  transmission: false,
}
export const BANK = 'Banka MarketOne Demo — simulator fiktiv'
export const documentLabels: Record<DocumentKind, string> = {
  registration: 'Regjistrimi i biznesit',
  identity: 'Identiteti / përfaqësimi',
  turnover: 'Dokumenti i qarkullimit',
  supplement: 'Dokumenti shtesë i qarkullimit',
}
export const creditLabels: Record<CreditStatus, string> = {
  draft: 'Draft',
  received: 'Marrë nga banka demo',
  under_review: 'Në shqyrtim',
  information_required: 'Kërkohet informacion',
  approved: 'Miratuar · simulim',
  rejected: 'Refuzuar · simulim',
}
export const orderLabels: Record<OrderStatus, string> = {
  pending: 'Për konfirmim',
  confirmed: 'Konfirmuar',
  completed: 'Përfunduar',
  cancelled: 'Anuluar',
}
export const documentStates: Record<DocumentStatus, string> = {
  missing: 'Mungon',
  selected: 'Zgjedhur',
  processing: 'Po përpunohet',
  checking: 'Në kontroll të simuluar',
  ready: 'Gati',
  failed: 'Dështoi',
}
