import { type FormEvent, useState } from 'react'
import type { SimulatedSession } from '../types/domain'

interface LoginScreenProps {
  onLogin: (session: SimulatedSession) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [operatorName, setOperatorName] = useState('')
  const [operatorNameError, setOperatorNameError] = useState('')
  const [email, setEmail] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedOperatorName = operatorName.trim()

    if (!trimmedOperatorName) {
      setOperatorNameError('Shkruani emrin e operatorit.')
      return
    }

    setOperatorNameError('')
    onLogin({ operatorName: trimmedOperatorName, email: email.trim() })
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,.92fr)]">
      <section className="relative flex min-h-[42vh] flex-col justify-between overflow-hidden bg-forest px-6 py-7 text-white sm:px-10 lg:min-h-dvh lg:px-[clamp(3rem,7vw,7rem)] lg:py-10" aria-labelledby="login-title">
        <div className="pointer-events-none absolute -right-28 -top-28 size-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 size-80 rounded-full bg-white/5 blur-3xl" />
        <a className="relative flex w-fit items-center gap-3 text-lg font-extrabold tracking-tight" href="#login-title" aria-label="MarketOne">
          <span>MarketOne</span>
        </a>
        <div className="relative my-14 max-w-2xl lg:my-20">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[.18em] text-emerald-200">Hapësira e operatorit</p>
          <h1 className="max-w-[12ch] text-balance text-4xl font-extrabold leading-[1.04] tracking-[-.045em] sm:text-5xl lg:text-[clamp(3.4rem,5vw,5.7rem)]" id="login-title">Porositje e thjeshtë, inventar i qartë.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-emerald-50/75 sm:text-lg">
            Shfletoni katalogun, kontrolloni stokun dhe përgatisni porosinë e
            radhës nga një panel i vetëm.
          </p>
        </div>
        <p className="relative hidden text-sm text-emerald-50/55 lg:block">Prototip funksional · MarketOne 2026</p>
      </section>

      <section className="flex items-center justify-center bg-white px-5 py-12 sm:px-10 lg:bg-canvas" aria-label="Hyrje në prototip">
        <form className="w-full max-w-md rounded-3xl border bg-white p-6 shadow-card sm:p-9" onSubmit={handleSubmit}>
          <div className="mb-8">
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1.5 text-[.68rem] font-extrabold uppercase tracking-[.12em] text-amber-900">Autentikim i simuluar</span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-[-.035em]">Mirë se u kthyet</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Kjo hyrje është vetëm për demonstrim. Nuk përdor autentikim të
              sigurt dhe të dhënat nuk ruhen.
            </p>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold" htmlFor="operator-name">
              Emri i operatorit
            </label>
            <input
              aria-describedby={operatorNameError ? 'operator-name-error' : undefined}
              aria-invalid={Boolean(operatorNameError)}
              autoComplete="name"
              className="h-12 w-full rounded-xl border bg-white px-4 text-sm shadow-sm transition placeholder:text-slate-400 hover:border-slate-400 aria-invalid:border-red-500"
              id="operator-name"
              onChange={(event) => {
                const nextOperatorName = event.target.value
                setOperatorName(nextOperatorName)
                if (nextOperatorName.trim()) setOperatorNameError('')
              }}
              placeholder="p.sh. Ana Kola"
              required
              value={operatorName}
            />
            {operatorNameError && (
              <p className="mt-2 text-sm font-semibold text-red-700" id="operator-name-error" role="alert">
                {operatorNameError}
              </p>
            )}
          </div>

          <label className="mb-6 block">
            <span className="mb-2 block text-sm font-bold">Email-i i punës</span>
            <input
              className="h-12 w-full rounded-xl border bg-white px-4 text-sm shadow-sm transition placeholder:text-slate-400 hover:border-slate-400"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ana@market.al"
              required
              type="email"
              value={email}
            />
          </label>

          <button className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-forest px-5 text-sm font-extrabold text-white shadow-lg shadow-forest/15 transition hover:bg-forest-dark" type="submit">
            Hyr në panel
            <span aria-hidden="true">→</span>
          </button>

          <p className="mt-5 text-center text-xs leading-5 text-muted">
            Duke vazhduar, hyni në një sesion të përkohshëm demonstrimi.
          </p>
        </form>
      </section>
    </main>
  )
}
