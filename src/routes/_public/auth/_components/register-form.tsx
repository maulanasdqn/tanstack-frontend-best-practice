import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useForm } from '@/libs/tanstack-form'
import { useRegister } from '@/apis/auth/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required'),
})

const validate = <K extends keyof typeof registerSchema.shape>(field: K, value: string) => {
  const result = registerSchema.shape[field].safeParse(value)
  return result.success ? undefined : result.error.issues[0]?.message
}

export const RegisterForm = () => {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const { mutateAsync: register } = useRegister()

  const form = useForm({
    defaultValues: { first_name: '', email: '', password: '' },
    onSubmit: async ({ value }) => {
      try {
        await register(value)
        navigate({ to: '/auth/login' })
      } catch {
        setFormError('Registration failed. Please try again.')
      }
    },
  })

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">Enter your details below to create your account</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.Field
          name="first_name"
          validators={{ onChange: ({ value }) => validate('first_name', value) }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="first_name">Name</Label>
              <Input
                id="first_name"
                type="text"
                placeholder="John Doe"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                autoComplete="name"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{ onChange: ({ value }) => validate('email', value) }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                autoComplete="email"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{ onChange: ({ value }) => validate('password', value) }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                autoComplete="new-password"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        {formError && <p className="text-sm text-destructive">{formError}</p>}

        <form.Subscribe selector={(s) => ({ isSubmitting: s.isSubmitting, email: s.values.email, password: s.values.password, first_name: s.values.first_name })}>
          {({ isSubmitting, email, password, first_name }) => (
            <Button type="submit" className="w-full" disabled={!email || !password || !first_name || isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <a href="/auth/login" className="underline underline-offset-4 hover:text-primary">
          Sign in
        </a>
      </p>
    </div>
  )
}
