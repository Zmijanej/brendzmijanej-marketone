import type { ReactNode } from 'react'
import { WorkspaceProvider } from '@/merchant/Workspace'
import { MerchantShell } from '@/merchant/Shell'
import '@/merchant/merchant.css'
export default function MerchantLayout({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <MerchantShell>{children}</MerchantShell>
    </WorkspaceProvider>
  )
}
