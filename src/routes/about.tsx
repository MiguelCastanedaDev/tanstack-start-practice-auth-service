import {
  createFileRoute,
  redirect,
} from '@tanstack/react-router'

import { getCurrentUser } from '#/server/auth'

export const Route = createFileRoute('/about')({
  beforeLoad: async () => {
    const user = await getCurrentUser()

    if (!user) {
      throw redirect({
        to: '/login',
      })
    }

    return {
      user,
    }
  },

  component: About,
})

function About() {
  const { user } = Route.useRouteContext()

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">
          About
        </p>

        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          A small starter with room to grow.
        </h1>

        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          TanStack Start gives you type-safe routing,
          server functions, and modern SSR defaults.
          Use this as a clean foundation, then layer in
          your own routes, styling, and add-ons.
        </p>

        {user && (
          <div className="mt-6">
            <p>
              Usuario autenticado:
            </p>

            <pre>
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </main>
  )
}