'use client'

import { useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { LoginScreen } from './components/LoginScreen'
import type { SimulatedSession } from './types/domain'

export default function App() {
  const [session, setSession] = useState<SimulatedSession | null>(null)

  if (!session) {
    return <LoginScreen onLogin={setSession} />
  }

  return <Dashboard session={session} onLogout={() => setSession(null)} />
}
