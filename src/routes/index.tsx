import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>This is the index route.</p>
    </div>
  )
}
