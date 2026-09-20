// middleware/guest.ts

import { createMiddleware } from '@tanstack/react-start'

export const guestMiddleware = createMiddleware({
  type: 'request',
}).server(async ({ request, next }) => {
  const cookieHeader = request.headers.get('cookie')

  const token = cookieHeader
    ?.split(';')
    .find((cookie) => cookie.trim().startsWith('auth_token='))
    ?.split('=')[1]

  // No hay JWT → puede entrar al login
  if (!token) {
    return next()
  }

  try {
    const response = await fetch(
      'https://hono-practice-auth-service.mikeonlinemx.workers.dev/ping',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    // JWT válido → ya está autenticado
    if (response.ok) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/dashboard',
        },
      })
    }

    // JWT inválido → dejamos entrar al login
    return next()
  } catch {
    return next()
  }
})