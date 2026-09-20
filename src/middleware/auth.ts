import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'

export const authMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
  const cookieHeader = getRequestHeader('cookie')

  const cookie = cookieHeader
    ?.split(';')
    .find((cookie) =>
      cookie.trim().startsWith('auth_token='),
    )

  if (!cookie) {
    throw new Error('Unauthorized')
  }

  const token = decodeURIComponent(
    cookie
      .trim()
      .substring('auth_token='.length),
  )

  if (!token) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(
    'https://hono-practice-auth-service.mikeonlinemx.workers.dev/ping',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error('Unauthorized')
  }

  const user = await response.json()

  return next({
    context: {
      user,
    },
  })
})