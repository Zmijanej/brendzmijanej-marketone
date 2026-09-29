import { Suspense } from 'react'
import { Payments } from '@/merchant/Operations'
export default function Page() {
  return (
    <Suspense fallback={<p role="status">Po ngarkohet hapësira…</p>}>
      <Payments />
    </Suspense>
  )
}
