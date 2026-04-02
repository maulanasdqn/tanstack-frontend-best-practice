import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { IconRefresh } from '@tabler/icons-react'
import { z } from 'zod'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AppSidebar } from '../_components/app-sidebar'
import { SiteHeader } from '../_components/site-header'
import { ActivityTable } from '../_components/activity-table'

const searchSchema = z.object({
  page: z.number().int().min(1).default(1).catch(1),
  resource: z.string().optional().catch(undefined),
  action: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/$orgSlug/activity')({
  validateSearch: searchSchema,
  component: ActivityPage,
})

const RESOURCES = ['user', 'role', 'session', 'activity-log']
const ACTIONS = ['create', 'update', 'delete', 'ban', 'unban', 'set-role']

function ActivityPage() {
  const { page, resource, action } = Route.useSearch()
  const navigate = Route.useNavigate()

  const setFilter = (key: 'resource' | 'action', value: string | undefined) => {
    navigate({ search: (prev) => ({ ...prev, [key]: value, page: 1 }) })
  }

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
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">Activity Log</h1>
                <p className="text-sm text-muted-foreground">No events recorded yet</p>
              </div>
              <Button variant="outline" size="sm">
                <IconRefresh className="size-4" />
                Refresh
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={resource ?? 'all'}
                onValueChange={(v) => setFilter('resource', v === 'all' ? undefined : v)}
              >
                <SelectTrigger className="h-8 w-40 text-xs">
                  <SelectValue placeholder="All resources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All resources</SelectItem>
                  {RESOURCES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={action ?? 'all'}
                onValueChange={(v) => setFilter('action', v === 'all' ? undefined : v)}
              >
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  {ACTIONS.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ActivityTable
              logs={[]}
              isLoading={false}
              page={page}
              totalPages={1}
              onPrevPage={() => navigate({ search: (prev) => ({ ...prev, page: page - 1 }) })}
              onNextPage={() => navigate({ search: (prev) => ({ ...prev, page: page + 1 }) })}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
