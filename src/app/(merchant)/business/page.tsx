import { Suspense } from 'react'
import { Business } from '@/merchant/Operations'
export default function Page() {
  return (
    <Suspense fallback={<p role="status">Po ngarkohet hapësira…</p>}>
      <Business />
    </Suspense>
  )
}
