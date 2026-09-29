import { Suspense } from 'react'
import { Products } from '@/merchant/Operations'
export default function Page() {
  return (
    <Suspense fallback={<p role="status">Po ngarkohet hapësira…</p>}>
      <Products />
    </Suspense>
  )
}
