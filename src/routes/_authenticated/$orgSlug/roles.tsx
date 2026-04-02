import { createFileRoute } from '@tanstack/react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '../_components/app-sidebar'
import { RolesOverview } from '../_components/roles-overview'
import { SiteHeader } from '../_components/site-header'

export const Route = createFileRoute('/_authenticated/$orgSlug/roles')({
  component: RolesPage,
})

function RolesPage() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <div>
              <h1 className="text-2xl font-semibold">Roles</h1>
              <p className="text-muted-foreground text-sm">Manage role assignments for users.</p>
            </div>
            <RolesOverview users={[]} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
