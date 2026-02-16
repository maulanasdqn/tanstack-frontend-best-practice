# TanStack Frontend Best Practice

A production-ready React frontend boilerplate with TanStack ecosystem, TypeScript-first configuration, and modern tooling.

## Requirements

- Node.js >= 22.0.0
- pnpm 10.6.1

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

## Scripts

| Command                | Description                         |
| ---------------------- | ----------------------------------- |
| `pnpm dev`             | Start development server            |
| `pnpm build`           | Type check and build for production |
| `pnpm preview`         | Preview production build            |
| `pnpm lint`            | Run ESLint                          |
| `pnpm lint:fix`        | Run ESLint with auto-fix            |
| `pnpm format`          | Format all files with Prettier      |
| `pnpm format:check`    | Check formatting                    |
| `pnpm storybook`       | Start Storybook on port 6006        |
| `pnpm build-storybook` | Build static Storybook              |
| `pnpm assets:compress` | Compress images in public/assets    |

## Project Structure

```
src/
├── apis/                   # API type definitions
│   ├── index.ts
│   └── types.ts
├── components/
│   └── ui/
│       └── input-fields/   # Form input components
├── libs/
│   ├── assets/             # Asset path utilities
│   ├── axios/              # Axios HTTP client config
│   ├── env/                # Environment variable helpers
│   ├── tanstack-form/      # TanStack Form config
│   ├── tanstack-query/     # TanStack Query config
│   ├── tanstack-store/     # TanStack Store config
│   └── tanstack-table/     # TanStack Table config
├── routes/                 # File-based routing (TanStack Router)
│   ├── __root.tsx
│   └── index.tsx
├── env.d.ts                # Environment variable types
├── index.css               # Global styles (Tailwind CSS)
├── main.tsx                # Application entry point
└── routeTree.gen.ts        # Auto-generated route tree
```

## Stack

### Core

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool

### TanStack Ecosystem

- **TanStack Router** - File-based routing with type safety
- **TanStack Query** - Server state management
- **TanStack Form** - Form handling with Zod validation
- **TanStack Table** - Headless table utilities
- **TanStack Store** - Client state management

### Styling

- **Tailwind CSS v4** - Utility-first CSS framework

### Development Tools

- **ESLint** - Code linting (TypeScript config)
- **Prettier** - Code formatting (TypeScript config)
- **Husky** - Git hooks
- **lint-staged** - Run linters on staged files
- **Storybook** - Component development and documentation

### Utilities

- **Axios** - HTTP client with interceptors
- **Zod** - Schema validation
- **Sharp** - Image compression

## Configuration

### Environment Variables

Create `.env` from `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=TanStack App
VITE_APP_ENV=development
```

Access in code:

```typescript
import { env } from '@/libs/env'

console.log(env.API_BASE_URL)
console.log(env.IS_DEV)
```

### Path Aliases

The `@` alias maps to `src/`:

```typescript
import { apiClient } from '@/libs/axios'
import { TextField } from '@/components/ui/input-fields'
```

### Tailwind CSS v4

Configure theme in `src/index.css`:

```css
@import 'tailwindcss';

@theme {
  --font-sans: Inter, system-ui, sans-serif;
  --color-primary: #3b82f6;
}
```

## Routing

Routes are file-based in `src/routes/`:

| File                       | Route            |
| -------------------------- | ---------------- |
| `routes/index.tsx`         | `/`              |
| `routes/about.tsx`         | `/about`         |
| `routes/users/index.tsx`   | `/users`         |
| `routes/users/$userId.tsx` | `/users/:userId` |

Route tree is auto-generated on `pnpm dev` or `pnpm build`.

## Forms

Use TanStack Form with Zod validation:

```typescript
import { useForm, z } from '@/libs/tanstack-form'
import { TextField } from '@/components/ui/input-fields'

function LoginForm() {
  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.Field
        name="email"
        validators={{ onChange: z.string().email() }}
        children={(field) => (
          <TextField field={field} label="Email" type="email" />
        )}
      />
      <form.Field
        name="password"
        validators={{ onChange: z.string().min(8) }}
        children={(field) => (
          <TextField field={field} label="Password" type="password" />
        )}
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

## Data Fetching

Use TanStack Query:

```typescript
import { useQuery, useMutation, queryClient } from '@/libs/tanstack-query'
import { apiClient } from '@/libs/axios'

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/users').then((res) => res.data),
  })
}
```

## Asset Compression

Place images in `public/assets/` and run:

```bash
pnpm assets:compress
```

This generates WebP and AVIF versions in `public/assets/compressed/`.

```typescript
import { getAssetPath } from '@/libs/assets'

<img src={getAssetPath('hero.jpg', { format: 'webp' })} />
```

## Git Hooks

Pre-commit hook runs automatically:

- ESLint with auto-fix on TypeScript files
- Prettier on all staged files

## License

MIT
