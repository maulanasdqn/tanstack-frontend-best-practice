import { useState } from 'react'
import { IconTrash } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useActiveOrganization } from '@/routes/_public/auth/_hooks/use-active-organization'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function OrgSettingsGeneral() {
  const navigate = useNavigate()
  const { data: activeOrg } = useActiveOrganization()

  const [name, setName] = useState(activeOrg?.name ?? '')
  const [slug, setSlug] = useState(activeOrg?.slug ?? '')
  const [logo, setLogo] = useState(activeOrg?.logo ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!activeOrg) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      console.log('Update organization:', {
        organizationId: activeOrg.id,
        data: { name, slug, logo: logo || undefined },
      })
      toast.success('Organization updated')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update organization'
      setError(msg)
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${activeOrg.name}"? This cannot be undone.`,
      )
    )
      return

    setDeleting(true)
    try {
      console.log('Delete organization:', { organizationId: activeOrg.id })
      toast.success('Organization deleted')
      navigate({ to: '/org/create' })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete organization'
      setError(msg)
      toast.error(msg)
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="org-name">Organization name</Label>
          <Input
            id="org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="org-slug">Slug</Label>
          <Input
            id="org-slug"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="org-logo">Logo URL</Label>
          <Input
            id="org-logo"
            type="url"
            placeholder="https://..."
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
      </form>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-destructive">
            Danger zone
          </h3>
          <p className="text-sm text-muted-foreground">
            Permanently delete this organization and all its data.
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          <IconTrash className="size-4" />
          {deleting ? 'Deleting...' : 'Delete Organization'}
        </Button>
      </div>
    </div>
  )
}
