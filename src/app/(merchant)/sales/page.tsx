import { Suspense } from 'react'
import { Sales } from '@/merchant/Operations'
export default function Page() {
  return (
    <Suspense fallback={<p role="status">Po ngarkohet hapësira…</p>}>
      <Sales />
    </Suspense>
  )
}
