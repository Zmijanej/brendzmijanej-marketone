import { Suspense } from 'react'
import { Overview } from '@/merchant/Overview'
export default function Page() {
  return (
    <Suspense fallback={<p role="status">Po ngarkohet hapësira…</p>}>
      <Overview />
    </Suspense>
  )
}
