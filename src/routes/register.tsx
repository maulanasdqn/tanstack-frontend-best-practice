import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm, z } from '@/libs/tanstack-form'
import { TextField } from '@/components/ui/input-fields'
import { Button, Alert, Card } from '@/components/ui'
import { useRegister } from '@/apis/auth'
import { GuestRoute } from '@/components/auth'
import { useState } from 'react'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

function RegisterPage() {
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await registerMutation.mutateAsync(value)
        setRegisteredUserId(response.data.data.user_id)
      } catch {
        // Error handled by mutation
      }
    },
  })

  if (registeredUserId) {
    return (
      <GuestRoute>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 text-center">
            <Card>
              <Alert variant="success" className="mb-4">
                Registration Successful! Please check your email to verify your
                account.
              </Alert>
              <Button onClick={() => navigate({ to: '/login' })}>
                Go to Login
              </Button>
            </Card>
          </div>
        </div>
      </GuestRoute>
    )
  }

  return (
    <GuestRoute>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </a>
            </p>
          </div>

          <form
            className="mt-8 space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <div className="space-y-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <form.Field name="first_name">
                  {(field) => (
                    <TextField
                      field={field}
                      label="First name"
                      placeholder="John"
                    />
                  )}
                </form.Field>

                <form.Field name="last_name">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Last name"
                      placeholder="Doe"
                    />
                  )}
                </form.Field>
              </div>

              <form.Field
                name="email"
                validators={{ onChange: registerSchema.shape.email }}
              >
                {(field) => (
                  <TextField
                    field={field}
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                  />
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{ onChange: registerSchema.shape.password }}
              >
                {(field) => (
                  <TextField
                    field={field}
                    label="Password"
                    type="password"
                    placeholder="At least 8 characters"
                  />
                )}
              </form.Field>
            </div>

            {registerMutation.isError && (
              <Alert variant="error">
                {registerMutation.error instanceof Error
                  ? registerMutation.error.message
                  : 'Registration failed. Please try again.'}
              </Alert>
            )}

            <Button
              type="submit"
              isLoading={registerMutation.isPending}
              className="w-full"
            >
              Create account
            </Button>
          </form>
        </div>
      </div>
    </GuestRoute>
  )
}
