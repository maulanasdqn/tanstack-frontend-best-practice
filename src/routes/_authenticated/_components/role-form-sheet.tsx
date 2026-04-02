import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import {
  idSchema,
  labelSchema,
  descriptionSchema,
  fieldError,
  extractErrorMessage,
  type IRoleFormSheetProps,
} from './role-form-helpers'

export function RoleFormSheet({ mode, role, open, onOpenChange }: IRoleFormSheetProps) {
  const form = useForm({
    defaultValues: {
      id: role?.id ?? '',
      label: role?.label ?? '',
      description: role?.description ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        if (mode === 'create') {
          console.log('Create role:', {
            id: value.id.trim(),
            label: value.label.trim(),
            description: value.description.trim(),
          })
          toast.success('Role created')
        } else if (role) {
          console.log('Update role:', {
            id: role.id,
            label: value.label.trim(),
            description: value.description.trim(),
          })
          toast.success('Role updated')
        }
        onOpenChange(false)
      } catch (err) {
        toast.error(extractErrorMessage(err))
      }
    },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        id: role?.id ?? '',
        label: role?.label ?? '',
        description: role?.description ?? '',
      })
    }
  }, [open, role?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{mode === 'create' ? 'New Role' : 'Edit Role'}</SheetTitle>
          <SheetDescription>
            {mode === 'create'
              ? 'Create a new application role.'
              : "Update the role's label and description."}
          </SheetDescription>
        </SheetHeader>
        <form
          className="flex flex-col gap-4 px-4 py-4"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          {mode === 'create' && (
            <form.Field
              name="id"
              validators={{
                onChange: ({ value }) => fieldError(idSchema, value),
                onBlur: ({ value }) => fieldError(idSchema, value),
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="role-id">Role ID</Label>
                  <Input
                    id="role-id"
                    placeholder="e.g. moderator"
                    maxLength={50}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={field.state.meta.errors.length > 0}
                  />
                  <p className="text-muted-foreground text-xs">
                    Lowercase letters, numbers, hyphens. Cannot be changed later.
                  </p>
                  {field.state.meta.errors[0] && (
                    <p className="text-destructive text-sm" role="alert">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          )}

          <form.Field
            name="label"
            validators={{
              onChange: ({ value }) => fieldError(labelSchema, value),
              onBlur: ({ value }) => fieldError(labelSchema, value),
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role-label">Display Name</Label>
                <Input
                  id="role-label"
                  placeholder="e.g. Moderator"
                  maxLength={100}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors[0] && (
                  <p className="text-destructive text-sm" role="alert">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => fieldError(descriptionSchema, value),
              onBlur: ({ value }) => fieldError(descriptionSchema, value),
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  placeholder="What can this role do?"
                  maxLength={500}
                  rows={3}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors[0] && (
                  <p className="text-destructive text-sm" role="alert">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <SheetFooter className="px-0">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(s) => ({
                canSubmit: s.canSubmit,
                isSubmitting: s.isSubmitting,
                id: s.values.id,
                label: s.values.label,
              })}
            >
              {({ canSubmit, isSubmitting, id, label }) => (
                <Button
                  type="submit"
                  disabled={
                    !canSubmit ||
                    isSubmitting ||
                    !label.trim() ||
                    (mode === 'create' && !id.trim())
                  }
                >
                  {isSubmitting
                    ? mode === 'create'
                      ? 'Creating…'
                      : 'Saving…'
                    : mode === 'create'
                      ? 'Create'
                      : 'Save'}
                </Button>
              )}
            </form.Subscribe>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
