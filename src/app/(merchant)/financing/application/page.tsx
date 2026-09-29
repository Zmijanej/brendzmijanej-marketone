import { Suspense } from 'react'
import { ApplicationPage } from '@/merchant/Financing'
export default function Page() {
  return (
    <Suspense fallback={<p role="status">Po ngarkohet hapësira…</p>}>
      <ApplicationPage />
    </Suspense>
  )
}
