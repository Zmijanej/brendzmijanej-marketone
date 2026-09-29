import { Suspense } from 'react'
import { Financing } from '@/merchant/Financing'
export default function Page() {
  return (
    <Suspense fallback={<p role="status">Po ngarkohet hapësira…</p>}>
      <Financing />
    </Suspense>
  )
}
