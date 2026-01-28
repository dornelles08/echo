import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticate/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticate/dashboard"!</div>
}
