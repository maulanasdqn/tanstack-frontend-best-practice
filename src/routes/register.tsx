import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm, z } from '@/libs/tanstack-form'
import { TextField } from '@/components/ui/input-fields'
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
            <div className="rounded-md bg-green-50 p-6">
              <h2 className="text-xl font-semibold text-green-800">
                Registration Successful!
              </h2>
              <p className="mt-2 text-green-700">
                Please check your email to verify your account.
              </p>
              <button
                onClick={() => navigate({ to: '/login' })}
                className="mt-4 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
              >
                Go to Login
              </button>
            </div>
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
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  )}
                </form.Field>

                <form.Field name="last_name">
                  {(field) => (
                    <TextField
                      field={field}
                      label="Last name"
                      placeholder="Doe"
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  )}
                </form.Field>
              </div>

              <form.Field
                name="email"
                validators={{
                  onChange: registerSchema.shape.email,
                }}
              >
                {(field) => (
                  <TextField
                    field={field}
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onChange: registerSchema.shape.password,
                }}
              >
                {(field) => (
                  <TextField
                    field={field}
                    label="Password"
                    type="password"
                    placeholder="At least 8 characters"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                )}
              </form.Field>
            </div>

            {registerMutation.isError && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  {registerMutation.error instanceof Error
                    ? registerMutation.error.message
                    : 'Registration failed. Please try again.'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {registerMutation.isPending
                ? 'Creating account...'
                : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </GuestRoute>
  )
}
