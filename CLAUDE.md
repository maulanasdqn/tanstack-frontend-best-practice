# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start development server
pnpm build            # Type check and build for production
pnpm lint             # Run ESLint
pnpm lint:fix         # Run ESLint with auto-fix
pnpm format           # Format all files with Prettier
pnpm storybook        # Start Storybook on port 6006
pnpm assets:compress  # Compress images in public/assets
```

## Architecture

This is a React frontend boilerplate using the TanStack ecosystem with TypeScript-first configuration.

### Entry Point

`src/main.tsx` initializes the app with:

- TanStack Router (`RouterProvider`)
- TanStack Query (`QueryClientProvider`)

### Routing

File-based routing via TanStack Router in `src/routes/`:

- `__root.tsx` - Root layout with `<Outlet />` and devtools
- `index.tsx` - Index route (`/`)
- Route tree is auto-generated to `src/routeTree.gen.ts`

Route naming conventions:

- `$param.tsx` for dynamic segments (`/users/$userId`)
- `index.tsx` for index routes

### Library Configurations

All external library configurations are centralized in `src/libs/`:

| Directory         | Purpose                                                   |
| ----------------- | --------------------------------------------------------- |
| `axios/`          | Axios instance with auth interceptors and error handling  |
| `tanstack-query/` | QueryClient with default stale/gc times, re-exports hooks |
| `tanstack-form/`  | Form utilities with Zod validator, re-exports             |
| `tanstack-table/` | Table row models and type exports                         |
| `tanstack-store/` | Store creation helper                                     |
| `env/`            | Type-safe environment variable access                     |
| `assets/`         | Asset path utilities for compressed images                |

### Form Components

`src/components/ui/input-fields/` contains controlled form inputs that integrate with TanStack Form's `AnyFieldApi`:

- `TextField`, `TextAreaField`, `SelectField`, `CheckboxField`
- `FieldWrapper` handles label and error display

### Configuration Files

All configs use TypeScript:

- `eslint.config.ts` - ESLint flat config with Prettier integration
- `prettier.config.ts` - Prettier settings
- `lint-staged.config.ts` - Pre-commit lint rules
- `vite.config.ts` - Vite with TanStack Router, Tailwind, Storybook plugins

### Path Alias

`@/` maps to `src/` (configured in both `tsconfig.app.json` and `vite.config.ts`).

### Environment Variables

Defined in `src/env.d.ts`, accessed via `src/libs/env/`:

- `VITE_API_BASE_URL`
- `VITE_APP_NAME`
- `VITE_APP_ENV`

### Styling

Tailwind CSS v4 configured in `src/index.css` using `@import 'tailwindcss'` and `@theme` directive.
