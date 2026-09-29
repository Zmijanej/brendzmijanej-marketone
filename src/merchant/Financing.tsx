'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  BANK,
  creditLabels,
  documentLabels,
  documentStates,
  type ApplicationForm,
  type CreditApplication,
  type DemoDocument,
  type DocumentKind,
  type SubmissionRecord,
} from './model'
import {
  cents,
  dateTime,
  editApplication,
  fundingAction,
  money,
  salesTotal,
  validateApplication,
  type Errors,
} from './domain'
import { useWorkspace } from './Workspace'
import { ActionLink, Field, PageHeading, Panel, Select } from './ui'

export function Financing() {
  const ws = useWorkspace(),
    router = useRouter(),
    app = ws.state.application
  return (
    <>
      <PageHeading
        eyebrow="FINANCIMI I BIZNESIT"
        title="Nga një nevojë, te një kërkesë e qartë."
        description="Përgatitni informacionin që i duhet bankës për të shqyrtuar financimin e biznesit."
      />
      <div className="m-two-columns">
        <section className="m-finance-card m-finance-intro">
          <p className="m-eyebrow">MIKRO-KREDI · DEMONSTRIM</p>
          <h2>Hapi i radhës për stokun ose pajisjet tuaja.</h2>
          <p>
            MarketOne ju ndihmon të përgatisni dhe ndiqni aplikimin. Banka vlerëson kërkesën dhe
            vendos për kushtet.
          </p>
          {app ? (
            <>
              <span className="m-badge">
                {app.submission && app.submission.delivery !== 'acknowledged'
                  ? 'Pritet konfirmimi i marrjes'
                  : creditLabels[app.status]}
              </span>
              <ActionLink href={fundingAction(app).href}>{fundingAction(app).label}</ActionLink>
            </>
          ) : (
            <button
              className="m-button"
              onClick={async () => {
                if (await ws.startApplication()) router.push('/financing/application?step=1')
              }}
            >
              Fillo aplikimin <span aria-hidden="true">→</span>
            </button>
          )}
          <small>Nuk ofrohet interes, këst ose premtim miratimi.</small>
        </section>
        <Panel title="Përpara se të filloni">
          <ol className="m-number-list">
            <li>
              <b>Biznesi dhe përfaqësuesi</b>
              <p>Të dhënat e profilit do të paraplotësohen për konfirmim.</p>
            </li>
            <li>
              <b>Financat dhe periudha</b>
              <p>Xhiroja, shpenzimet dhe detyrimet deklarohen për të gjithë biznesin.</p>
            </li>
            <li>
              <b>Dokumentet për shqyrtim</b>
              <p>
                Regjistrimi, identiteti/përfaqësimi dhe qarkullimi. Këtu përdoren vetëm mostra të
                integruara.
              </p>
            </li>
          </ol>
        </Panel>
      </div>
      <Panel title="Kush e merr kërkesën?">
        <p>
          <b>{BANK}</b>
        </p>
        <p>
          Ky prototip simulon përgjigjet lokalisht. Nuk transmeton asnjë aplikim në bankë dhe nuk
          pranon skedarë personalë. Në një shërbim real, banka marrëse dhe dokumentet e detyrueshme
          do të konfirmoheshin përpara aplikimit.
        </p>
        <Handoff />
      </Panel>
    </>
  )
}
export function ApplicationPage() {
  const ws = useWorkspace(),
    router = useRouter()
  if (!ws.state.application)
    return (
      <>
        <PageHeading
          eyebrow="FINANCIM"
          title="Aplikimi juaj fillon këtu."
          description="Përgatitni një draft duke përdorur të dhënat e biznesit."
        />
        <Panel>
          <p>Nuk ka aplikim në këtë skenar.</p>
          <button
            className="m-button"
            onClick={async () => {
              if (await ws.startApplication()) router.replace('/financing/application?step=1')
            }}
          >
            Fillo aplikimin
          </button>
        </Panel>
      </>
    )
  return <ApplicationWizard app={ws.state.application} />
}
const stepTitles = ['Nevoja', 'Biznesi', 'Financat', 'Rishikimi', 'Statusi']
function ApplicationWizard({ app }: { app: CreditApplication }) {
  const ws = useWorkspace(),
    router = useRouter(),
    query = useSearchParams()
  const requested = Number(query.get('step') ?? app.step)
  const step = app.submission
    ? 5
    : Math.min(4, Math.max(1, Number.isInteger(requested) ? requested : app.step))
  const [errors, setErrors] = useState<Errors>({})
  const titleRef = useRef<HTMLHeadingElement>(null),
    summaryRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    titleRef.current?.focus()
  }, [step])
  const update = (key: keyof ApplicationForm, value: string) => {
    ws.change((s) =>
      s.application ? { ...s, application: editApplication(s.application, { [key]: value }) } : s,
    )
    setErrors((current) => ({ ...current, [key]: undefined }))
  }
  const go = async (next: number) => {
    ws.change((s) => (s.application ? { ...s, application: { ...s.application, step: next } } : s))
    if (await ws.flush()) {
      setErrors({})
      router.push('/financing/application?step=' + next)
    }
  }
  const showErrors = (next: Errors) => {
    setErrors(next)
    requestAnimationFrame(() => summaryRef.current?.focus())
  }
  const advance = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validateApplication(app, step === 4 ? undefined : step)
    if (Object.values(nextErrors).some(Boolean)) {
      showErrors(nextErrors)
      return
    }
    if (step === 4) {
      if (await ws.submit()) router.replace('/financing/application?step=5')
    } else await go(step + 1)
  }
  const form = app.form
  const field = (key: keyof ApplicationForm, label: string, hint?: string, type = 'text') => (
    <Field
      key={key}
      id={'credit-' + key}
      name={key}
      label={label}
      type={type}
      hint={hint}
      error={errors[key]}
      value={form[key]}
      onChange={(e) => update(key, e.target.value)}
      inputMode={
        ['amount', 'turnover', 'expenses', 'debt', 'installment'].includes(key)
          ? 'decimal'
          : key === 'months'
            ? 'numeric'
            : undefined
      }
    />
  )
  return (
    <>
      <PageHeading
        eyebrow={'APLIKIMI ' + app.id}
        title={step === 5 ? 'Aplikimi dhe hapi i radhës' : 'Përgatitni kërkesën tuaj.'}
        description="Ruhet në këtë browser. Përdorni vetëm të dhëna fiktive; asgjë nuk dërgohet në bankë."
      />
      <ol className="m-steps" aria-label="Hapat e aplikimit">
        {stepTitles.map((title, i) => (
          <li key={title} aria-current={step === i + 1 ? 'step' : undefined}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            {title}
          </li>
        ))}
      </ol>
      {step === 5 ? (
        <ApplicationStatus app={app} />
      ) : (
        <Panel className="m-wizard">
          <div className="m-wizard-heading">
            <span className="m-eyebrow">HAPI {step} NGA 5</span>
            <h2 tabIndex={-1} ref={titleRef}>
              {
                [
                  '',
                  'Për çfarë ju nevojitet financimi?',
                  'Konfirmoni biznesin dhe aplikuesin',
                  'Financat dhe dokumentet',
                  'Kontrolloni përpara dërgimit',
                ][step]
              }
            </h2>
          </div>
          <form noValidate onSubmit={(event) => void advance(event)}>
            {Object.values(errors).some(Boolean) && (
              <div className="m-error-summary" ref={summaryRef} tabIndex={-1} role="alert">
                <b>Ju lutemi kontrolloni:</b>
                <ul>
                  {Object.entries(errors)
                    .filter(([, message]) => message)
                    .map(([key, message]) => (
                      <li key={key}>
                        <a
                          href={'#credit-' + key}
                          onClick={() => {
                            if (!['documents', 'authorisation'].includes(key) && step === 4) {
                              const targetStep = [
                                'amount',
                                'purpose',
                                'months',
                                'explanation',
                              ].includes(key)
                                ? 1
                                : [
                                      'turnover',
                                      'expenses',
                                      'period',
                                      'hasDebt',
                                      'debt',
                                      'installment',
                                    ].includes(key)
                                  ? 3
                                  : 2
                              void go(targetStep)
                            }
                          }}
                        >
                          {message}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            )}
            {step === 1 && (
              <>
                <div className="m-form-grid">
                  {field(
                    'amount',
                    'Shuma e kërkuar (USD)',
                    'Monedhë ilustruese; nuk është ofertë financiare.',
                  )}
                  {field(
                    'months',
                    'Periudha e preferuar (muaj)',
                    'Preferencë e aplikuesit, jo kusht i miratuar.',
                  )}
                  <Select
                    id="credit-purpose"
                    label="Qëllimi"
                    value={form.purpose}
                    onChange={(e) => update('purpose', e.target.value)}
                  >
                    <option>Rimbushje stoku</option>
                    <option>Pajisje për biznesin</option>
                    <option>Nevojë tjetër e biznesit</option>
                  </Select>
                </div>
                <div className="m-field">
                  <label htmlFor="credit-explanation">Përshkruani nevojën</label>
                  <textarea
                    id="credit-explanation"
                    rows={4}
                    value={form.explanation}
                    aria-invalid={!!errors.explanation}
                    aria-describedby={errors.explanation ? 'credit-explanation-error' : undefined}
                    onChange={(e) => update('explanation', e.target.value)}
                    placeholder="p.sh. Blerje stoku për muajin e ardhshëm."
                  />
                  {errors.explanation && (
                    <p id="credit-explanation-error" className="m-field-error">
                      {errors.explanation}
                    </p>
                  )}
                </div>
                <div className="m-note">
                  Banka shqyrton kërkesën dhe përcakton kushtet. Nuk llogaritet këst ose mundësi
                  miratimi në këtë prototip.
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <p>
                  Të dhënat janë kopjuar nga profili. Korrigjimet këtu ruhen vetëm në këtë aplikim.
                </p>
                <div className="m-form-grid">
                  {field('name', 'Emri i biznesit', 'Burimi fillestar: profili i biznesit.')}
                  {field('activity', 'Aktiviteti')}
                  {field('registration', 'Numri i regjistrimit demonstrues')}
                  {field('address', 'Adresa demonstruese')}
                  {field('representative', 'Personi që aplikon')}
                  {field('email', 'Email demonstrues', undefined, 'email')}
                  {field('phone', 'Telefon demonstrues', undefined, 'tel')}
                </div>
                <div className="m-note">
                  <b>Autorizimi i përfaqësuesit</b>
                  <p>
                    Në këtë skenar, aplikuesja është pronarja. Në një shërbim real, identiteti dhe e
                    drejta për përfaqësim do të verifikoheshin nga sistemi dhe banka; ky formular
                    nuk kryen verifikim.
                  </p>
                </div>
                <Link className="m-text-link" href="/business">
                  Përditëso veçmas profilin e biznesit →
                </Link>
              </>
            )}
            {step === 3 && (
              <>
                <p>Shifrat deklarohen për të gjithë biznesin. MarketOne nuk i verifikon ato.</p>
                <div className="m-form-grid">
                  {field('period', 'Muaji i raportimit', undefined, 'month')}
                  {field(
                    'turnover',
                    'Xhiro e deklaruar (USD)',
                    'Të gjitha kanalet; mund të përfshijë MarketOne.',
                  )}
                  {field(
                    'expenses',
                    'Shpenzime të deklaruara (USD)',
                    'Për të njëjtën periudhë si xhiroja.',
                  )}
                  <Select
                    id="credit-hasDebt"
                    label="Detyrime kreditore ekzistuese?"
                    value={form.hasDebt}
                    onChange={(e) => update('hasDebt', e.target.value)}
                  >
                    <option value="no">Nuk ka · e deklaruar</option>
                    <option value="yes">Po, ka detyrime</option>
                  </Select>
                  {form.hasDebt === 'yes' && (
                    <>
                      {field('debt', 'Detyrimi i mbetur (USD)')}
                      {field('installment', 'Pagesa mujore (USD)')}
                    </>
                  )}
                </div>
                <div className="m-note">
                  <b>Raporti i MarketOne jepet veçmas</b>
                  <p>
                    {money(salesTotal(ws.state, 30))} në porosi të përfunduara gjatë 30 ditëve të
                    fundit. Ky aktivitet mund të jetë pjesë e xhiros suaj; nuk i shtohet
                    automatikisht deklarimit.
                  </p>
                </div>
                <DocumentPanel app={app} />
              </>
            )}
            {step === 4 && (
              <>
                <Review app={app} onEdit={(n) => void go(n)} />
                <div className="m-note">
                  <b>Marrësi: {BANK}</b>
                  <p>
                    Paketa përmban të dhënat e biznesit dhe përfaqësuesit, kërkesën, deklarimet
                    financiare, raportin e MarketOne dhe tre dokumentet e listuara.
                  </p>
                  <p>
                    Të dhënat ruhen vetëm në këtë browser. Mos vendosni të dhëna reale. Në prodhim
                    do të shfaqeshin njoftimi i privatësisë dhe kontakti i bankës së emërtuar.
                  </p>
                </div>
                <label className="m-check m-consent" id="credit-authorisation">
                  <input
                    type="checkbox"
                    checked={app.authorisedVersion === app.version}
                    onChange={(e) => {
                      const checked = e.target.checked
                      ws.change((s) =>
                        s.application
                          ? {
                              ...s,
                              application: {
                                ...s.application,
                                authorisedVersion: checked ? s.application.version : null,
                              },
                            }
                          : s,
                      )
                    }}
                  />
                  <span>
                    Autorizoj ndarjen e këtij versioni me <b>bankën e simuluar</b> për të
                    demonstruar shqyrtimin. Asnjë e dhënë nuk transmetohet jashtë browser-it.
                  </span>
                </label>
                <p className="m-muted">Aplikimi nuk përbën pranim kontrate kredie.</p>
                <Handoff />
              </>
            )}
            <div className="m-wizard-actions">
              <div>
                <button className="m-button" disabled={ws.busy} type="submit">
                  {ws.busy ? 'Po përpunohet…' : step === 4 ? 'Dërgo te banka demo' : 'Vazhdo'}
                </button>
                {step > 1 && (
                  <button
                    className="m-button secondary"
                    type="button"
                    disabled={ws.busy}
                    onClick={() => void go(step - 1)}
                  >
                    Kthehu
                  </button>
                )}
              </div>
              <button
                className="m-quiet"
                type="button"
                disabled={ws.busy}
                onClick={async () => {
                  if (await ws.flush()) router.push('/overview')
                }}
              >
                Ruaj dhe dil
              </button>
            </div>
          </form>
        </Panel>
      )}
    </>
  )
}
function DocumentPanel({
  app,
  supplement = false,
}: {
  app: CreditApplication
  supplement?: boolean
}) {
  return (
    <div id="credit-documents" tabIndex={-1}>
      <h3>{supplement ? 'Dokumenti i kërkuar' : 'Dokumente demonstrimi'}</h3>
      <p className="m-muted">
        Zgjidhni mostra të integruara PDF, nën 5 MB. Ky është kufi demo; nuk hapen ose ngarkohen
        skedarë nga pajisja.
      </p>
      {(supplement ? ['supplement'] : ['registration', 'identity', 'turnover']).map((kind) => (
        <DocumentRow
          key={kind}
          document={app.documents[kind as DocumentKind]}
          locked={supplement ? !!app.supplement : !!app.submission}
        />
      ))}
      <p className="m-caption">
        Përpunimi dhe kontrollet janë të simuluara, përfshirë gabimet e formatit dhe madhësisë.
      </p>
    </div>
  )
}
function DocumentRow({ document: doc, locked }: { document: DemoDocument; locked: boolean }) {
  const ws = useWorkspace(),
    [selected, setSelected] = useState('')
  return (
    <div className="m-document">
      <div>
        <b>{documentLabels[doc.kind]}</b>
        <small>
          {doc.kind === 'registration'
            ? 'Për identifikimin e biznesit.'
            : doc.kind === 'identity'
              ? 'Për identitetin dhe përfaqësimin e aplikuesit.'
              : 'Për të mbështetur qarkullimin e deklaruar.'}
        </small>
        <span
          className={
            'm-badge ' + (doc.status === 'failed' ? 'red' : doc.status === 'ready' ? '' : 'amber')
          }
          role="status"
        >
          {documentStates[doc.status]}
        </span>
        {doc.sampleId && <small>{doc.sampleId}</small>}
        {doc.message && (
          <p role="alert" className="m-field-error">
            {doc.message}
          </p>
        )}
      </div>
      {!locked && (
        <div className="m-document-picker">
          <label className="m-sr-only" htmlFor={'sample-' + doc.kind}>
            Mostra për {documentLabels[doc.kind]}
          </label>
          <select
            id={'sample-' + doc.kind}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Zgjidhni mostrën</option>
            <option value="sample">PDF demonstrues · 250 KB</option>
          </select>
          <button
            type="button"
            className="m-button secondary"
            disabled={!selected || ws.busy}
            onClick={() => void ws.processDocument(doc.kind)}
          >
            {doc.status === 'missing'
              ? 'Përdor mostrën'
              : doc.status === 'failed'
                ? 'Riprovo mostrën'
                : 'Zëvendëso mostrën'}
            <span className="m-sr-only"> · {documentLabels[doc.kind]}</span>
          </button>
        </div>
      )}
    </div>
  )
}
function Review({ app, onEdit }: { app: CreditApplication; onEdit?: (step: number) => void }) {
  const form = app.submission?.snapshot.form ?? app.form
  return (
    <div className="m-review">
      <section>
        <div className="m-section-heading">
          <h3>Kërkesa</h3>
          {onEdit && (
            <button className="m-text-link" type="button" onClick={() => onEdit(1)}>
              Ndrysho nevojën
            </button>
          )}
        </div>
        <dl>
          <dt>Shuma e kërkuar</dt>
          <dd>{cents(form.amount) !== null ? money(cents(form.amount)!) : 'E paplotësuar'}</dd>
          <dt>Qëllimi</dt>
          <dd>{form.purpose}</dd>
          <dt>Periudha e preferuar</dt>
          <dd>{form.months} muaj</dd>
          <dt>Nevoja</dt>
          <dd>{form.explanation || 'E paplotësuar'}</dd>
        </dl>
      </section>
      <section>
        <div className="m-section-heading">
          <h3>Biznesi dhe aplikuesi</h3>
          {onEdit && (
            <button className="m-text-link" type="button" onClick={() => onEdit(2)}>
              Ndrysho biznesin
            </button>
          )}
        </div>
        <dl>
          <dt>Biznesi</dt>
          <dd>{form.name}</dd>
          <dt>Aktiviteti</dt>
          <dd>{form.activity}</dd>
          <dt>Regjistrimi</dt>
          <dd>{form.registration || 'Mungon'}</dd>
          <dt>Adresa</dt>
          <dd>{form.address || 'Mungon'}</dd>
          <dt>Përfaqësuesi</dt>
          <dd>{form.representative}</dd>
          <dt>Kontakti</dt>
          <dd>
            {form.email}
            <br />
            {form.phone}
          </dd>
        </dl>
      </section>
      <section>
        <div className="m-section-heading">
          <h3>Financat e deklaruara</h3>
          {onEdit && (
            <button className="m-text-link" type="button" onClick={() => onEdit(3)}>
              Ndrysho financat
            </button>
          )}
        </div>
        <dl>
          <dt>Periudha</dt>
          <dd>{form.period}</dd>
          <dt>Xhiro</dt>
          <dd>{cents(form.turnover) !== null ? money(cents(form.turnover)!) : 'Mungon'}</dd>
          <dt>Shpenzime</dt>
          <dd>{cents(form.expenses) !== null ? money(cents(form.expenses)!) : 'Mungon'}</dd>
          <dt>Detyrime</dt>
          <dd>{form.hasDebt === 'no' ? 'Nuk ka · deklaruar' : money(cents(form.debt) ?? 0)}</dd>
          {form.hasDebt === 'yes' && (
            <>
              <dt>Pagesa mujore</dt>
              <dd>{money(cents(form.installment) ?? 0)}</dd>
            </>
          )}
        </dl>
        <p className="m-caption">Burimi: aplikuesja. Nuk është verifikuar nga MarketOne.</p>
      </section>
      <PlatformReport record={app.submission} />
      <section id="credit-documents">
        <div className="m-section-heading">
          <h3>Dokumentet e paketës</h3>
          {onEdit && (
            <button className="m-text-link" type="button" onClick={() => onEdit(3)}>
              Plotëso dokumentet
            </button>
          )}
        </div>
        {(
          app.submission?.snapshot.documents ??
          Object.values(app.documents).filter((d) => d.kind !== 'supplement')
        ).map((doc) => (
          <p className="m-line-items" key={doc.kind}>
            {documentLabels[doc.kind]} <b>{documentStates[doc.status]}</b>
            {doc.sampleId && <small> · {doc.sampleId}</small>}
          </p>
        ))}
      </section>
    </div>
  )
}
function PlatformReport({ record }: { record: SubmissionRecord | null }) {
  const { state } = useWorkspace()
  return (
    <section>
      <h3>Aktiviteti i MarketOne · veçmas</h3>
      <p>
        <b>{money(record ? record.snapshot.platformSales : salesTotal(state, 30))}</b> ·{' '}
        {record ? record.snapshot.platformPeriod : '30 ditët e fundit'}
      </p>
      <p className="m-caption">
        Burimi: porositë e përfunduara në platformën demo. Monedha: USD. Nuk i shtohet automatikisht
        xhiros së deklaruar.
      </p>
    </section>
  )
}
function ApplicationStatus({ app }: { app: CreditApplication }) {
  const ws = useWorkspace(),
    [consentVersion, setConsentVersion] = useState<number | null>(null),
    [showSnapshot, setShowSnapshot] = useState(false)
  const statusHeading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    statusHeading.current?.focus()
  }, [])
  const consent = consentVersion === app.version
  const record = app.submission!,
    pending = record.delivery !== 'acknowledged',
    supplementaryPending = !!app.supplement && app.supplement.delivery !== 'acknowledged'
  const title = pending
    ? record.delivery === 'sending'
      ? 'Po dërgohet te simulatori'
      : 'Marrja ende nuk është konfirmuar'
    : creditLabels[app.status]
  return (
    <>
      <Panel className="m-status-card">
        <p className="m-eyebrow">STATUSI I APLIKIMIT</p>
        <h2 tabIndex={-1} ref={statusHeading} aria-live="polite">
          {title}
        </h2>
        <p>
          {money(cents(record.snapshot.form.amount) ?? 0)} · {record.snapshot.form.purpose}
        </p>
        <div className="m-status-meta">
          <span>
            <small>Referenca e MarketOne</small>
            <b>{record.reference}</b>
          </span>
          <span>
            <small>Përditësimi i fundit</small>
            <b>{dateTime(app.events.at(-1)?.at ?? record.at)}</b>
          </span>
        </div>
        <p className="m-muted">{BANK}</p>
        {pending ? (
          <>
            <p role="status">
              {record.delivery === 'sending'
                ? 'Kërkesa u regjistrua. Pritet konfirmimi i marrjes.'
                : 'Rezultati i komunikimit është i panjohur. Kontrolloni statusin; përdoret e njëjta referencë, pa aplikim të dytë.'}
            </p>
            <button className="m-button" disabled={ws.busy} onClick={() => void ws.checkReceipt()}>
              Kontrollo marrjen
            </button>
          </>
        ) : (
          <>
            <p>
              Referenca e bankës demo: <b>DEMO-BANK-{record.reference}</b>
            </p>
            {['received', 'under_review'].includes(app.status) && (
              <div className="m-note">
                <b>Nuk kërkohet veprim nga ju.</b>
                <p>
                  {app.status === 'received'
                    ? 'Banka demo e ka marrë aplikimin.'
                    : 'Aplikimi është në shqyrtim të simuluar.'}{' '}
                  Nuk ka kohë përgjigjeje të konfirmuar. Rishikuesi mund ta avancojë skenarin nga
                  kontrollet e demonstrimit.
                </p>
              </div>
            )}
          </>
        )}
        {app.decision && (
          <div className="m-note">
            <b>
              {app.status === 'approved'
                ? 'Vendim pozitiv i simuluar'
                : 'Vendim negativ i simuluar'}
            </b>
            <p>{app.decision.message}</p>
            {app.decision.approvedAmount !== null && (
              <p>
                Shuma e miratuar në simulim: <b>{money(app.decision.approvedAmount)}</b>. Miratimi
                nuk është disbursim.
              </p>
            )}
          </div>
        )}
      </Panel>
      {app.status === 'information_required' && app.request && (
        <Panel title="Plotësoni kërkesën e bankës">
          <p>{app.request.message}</p>
          <p>
            <b>Periudha: {app.request.period}</b> · Afati nuk është dhënë nga simulatori.
          </p>
          <DocumentPanel app={app} supplement />
          {app.supplement ? (
            <>
              <p role="status">
                {supplementaryPending
                  ? 'Pritet konfirmimi i marrjes së përgjigjes.'
                  : 'Përgjigjja u mor.'}
              </p>
              <button
                className="m-button"
                disabled={ws.busy}
                onClick={() => void ws.checkReceipt(true)}
              >
                Kontrollo marrjen e përgjigjes
              </button>
            </>
          ) : (
            <>
              <div className="m-note">
                <b>Rishikoni përgjigjen</b>
                <p>
                  Marrësi: {BANK}. Do të përfshihet vetëm dokumenti shtesë i zgjedhur, i lidhur me{' '}
                  {record.reference}.
                </p>
              </div>
              <label className="m-check">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsentVersion(e.target.checked ? app.version : null)}
                  disabled={app.documents.supplement.status !== 'ready'}
                />
                <span>Autorizoj ndarjen e dokumentit shtesë me bankën demo.</span>
              </label>
              <button
                className="m-button"
                disabled={ws.busy || !consent || app.documents.supplement.status !== 'ready'}
                onClick={() => {
                  void ws.submit(true, consent)
                  setConsentVersion(null)
                }}
              >
                Dërgo përgjigjen te banka demo
              </button>
            </>
          )}
        </Panel>
      )}
      <div className="m-two-columns">
        <Panel title="Historiku i aplikimit">
          <ol className="m-timeline">
            {app.events.map((event) => (
              <li key={event.id}>
                <span className="m-timeline-dot" />
                <div>
                  <b>{event.text}</b>
                  <p>
                    {event.actor} · {dateTime(event.at)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="Paketa e dërguar">
          <p>
            Versioni {record.version} u ruajt në momentin e autorizimit. Ndryshimet e profilit nuk e
            ndryshojnë këtë paketë.
          </p>
          <p>Autorizuar: {dateTime(record.authorisedAt)}</p>
          <button
            className="m-button secondary"
            aria-expanded={showSnapshot}
            onClick={() => setShowSnapshot(!showSnapshot)}
          >
            {showSnapshot ? 'Mbyll aplikimin e dërguar' : 'Shiko aplikimin e dërguar'}
          </button>
          {app.supplement && (
            <p>
              Dokument shtesë: {app.supplement.snapshot.documents[0]?.sampleId} ·{' '}
              {app.supplement.reference}
            </p>
          )}
          <div className="m-actions">
            <ActionLink href="/overview" secondary>
              Kthehu te paneli
            </ActionLink>
          </div>
        </Panel>
      </div>
      {showSnapshot && (
        <Panel title="Versioni historik i aplikimit">
          <Review app={app} />
        </Panel>
      )}
      <Handoff />
    </>
  )
}
function Handoff() {
  return (
    <details className="m-handoff">
      <summary>Si do të transmetohej kërkesa në një shërbim real?</summary>
      <ol className="m-number-list">
        <li>
          <b>Ju rishikoni dhe autorizoni</b>
          <p>Paketa, versioni dhe banka marrëse identifikohen qartë.</p>
        </li>
        <li>
          <b>Serveri i MarketOne verifikon dhe dërgon</b>
          <p>
            Leje sipas biznesit, dokumente private, enkriptim dhe ndërfaqe e autentikuar e bankës.
            Riprovimet përdorin një referencë të qëndrueshme.
          </p>
        </li>
        <li>
          <b>Banka konfirmon, shqyrton dhe vendos</b>
          <p>Vetëm përgjigjet e autentikuara të bankës përditësojnë statusin dhe historikun.</p>
        </li>
      </ol>
      <p className="m-note">
        Kjo është arkitekturë e propozuar. Ky prototip ka vetëm ruajtje lokale dhe simulator; nuk
        implementon këto kontrolle sigurie ose transmetim real.
      </p>
    </details>
  )
}
