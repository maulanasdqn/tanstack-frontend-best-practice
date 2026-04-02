import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
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
import {
  nameSchema,
  emailSchema,
  fieldError,
  extractErrorMessage,
  type IUserFormSheetProps,
} from './user-form-helpers'
import { UserFormCreate } from './user-form-create'

export function UserFormSheet({
  mode,
  user,
  defaultRole = 'member',
  open,
  onOpenChange,
}: IUserFormSheetProps) {
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [deleteError, setDeleteError] = React.useState<string | null>(null)
  const [updateError, setUpdateError] = React.useState<string | null>(null)

  const editForm = useForm({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
    onSubmit: async ({ value }) => {
      if (!user) return
      try {
        console.log('Update user:', {
          userId: user.id,
          name: value.name.trim(),
          email: value.email.trim().toLowerCase(),
        })
        onOpenChange(false)
        toast.success('User updated')
      } catch (err) {
        const msg = extractErrorMessage(err)
        setUpdateError(msg)
        toast.error(msg)
      }
    },
  })

  React.useEffect(() => {
    if (mode === 'edit' && user) {
      editForm.reset({ name: user.name, email: user.email })
    }
  }, [user?.id, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  if (mode === 'delete') {
    const handleDelete = async () => {
      if (!user) return
      setIsDeleting(true)
      setDeleteError(null)
      try {
        console.log('Delete user:', { userId: user.id })
        onOpenChange(false)
        toast.success('User deleted')
      } catch (err) {
        const msg = extractErrorMessage(err)
        setDeleteError(msg)
        toast.error(msg)
      } finally {
        setIsDeleting(false)
      }
    }

    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Delete User</SheetTitle>
            <SheetDescription>This action cannot be undone.</SheetDescription>
          </SheetHeader>
          <div className="px-4 py-4">
            <p className="text-sm">
              Are you sure you want to delete{' '}
              <span className="font-medium">{user?.name}</span>{' '}
              <span className="text-muted-foreground">({user?.email})</span>?
            </p>
            {deleteError && (
              <p className="text-destructive mt-3 text-sm" role="alert">
                {deleteError}
              </p>
            )}
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  if (mode === 'edit') {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>Update name and email.</SheetDescription>
          </SheetHeader>
          <form
            className="flex flex-col gap-4 px-4 py-4"
            onSubmit={(e) => {
              e.preventDefault()
              editForm.handleSubmit()
            }}
          >
            <editForm.Field
              name="name"
              validators={{
                onChange: ({ value }) => fieldError(nameSchema, value),
                onBlur: ({ value }) => fieldError(nameSchema, value),
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    placeholder="e.g. Jane Smith"
                    autoComplete="name"
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
            </editForm.Field>

            <editForm.Field
              name="email"
              validators={{
                onChange: ({ value }) => fieldError(emailSchema, value),
                onBlur: ({ value }) => fieldError(emailSchema, value),
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="e.g. jane@example.com"
                    autoComplete="email"
                    maxLength={254}
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
            </editForm.Field>

            <div className="flex flex-col gap-1.5">
              <Label>Role</Label>
              <Badge variant="outline" className="w-fit">
                {user?.role ?? 'member'}
              </Badge>
              <p className="text-muted-foreground text-xs">
                Change role from the Users table.
              </p>
            </div>

            {updateError && (
              <p className="text-destructive text-sm" role="alert">
                {updateError}
              </p>
            )}

            <SheetFooter className="px-0">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <editForm.Subscribe
                selector={(s) => ({
                  canSubmit: s.canSubmit,
                  isSubmitting: s.isSubmitting,
                  name: s.values.name,
                  email: s.values.email,
                })}
              >
                {({ canSubmit, isSubmitting, name, email }) => (
                  <Button
                    type="submit"
                    disabled={
                      !canSubmit ||
                      isSubmitting ||
                      !name.trim() ||
                      !email.trim()
                    }
                  >
                    {isSubmitting ? 'Saving…' : 'Save'}
                  </Button>
                )}
              </editForm.Subscribe>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <UserFormCreate
      defaultRole={defaultRole}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}
