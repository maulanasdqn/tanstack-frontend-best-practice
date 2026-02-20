import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm, z } from '@/libs/tanstack-form'
import { TextField } from '@/components/ui/input-fields'
import { useLogin } from '@/apis/auth'
import { GuestRoute } from '@/components/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

function LoginPage() {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await loginMutation.mutateAsync(value)
        if (!response.data.data.requires_2fa) {
          void navigate({ to: '/dashboard' as const })
        }
      } catch {
        // Error handled by mutation
      }
    },
  })

  return (
    <GuestRoute>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                create a new account
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
              <form.Field
                name="email"
                validators={{
                  onChange: loginSchema.shape.email,
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
                  onChange: loginSchema.shape.password,
                }}
              >
                {(field) => (
                  <TextField
                    field={field}
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                )}
              </form.Field>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            {loginMutation.isError && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  {loginMutation.error instanceof Error
                    ? loginMutation.error.message
                    : 'Login failed. Please check your credentials.'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </GuestRoute>
  )
}
