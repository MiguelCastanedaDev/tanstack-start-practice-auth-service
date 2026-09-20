import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'

export const getCurrentUser = createServerFn({
  method: 'GET',
}).handler(async () => {
  const cookieHeader = getRequestHeader('cookie')

  const cookie = cookieHeader
    ?.split(';')
    .find((cookie) =>
      cookie.trim().startsWith('auth_token='),
    )

  if (!cookie) {
    return null
  }

  const token = decodeURIComponent(
    cookie
      .trim()
      .substring('auth_token='.length),
  )

  if (!token) {
    return null
  }

  try {
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
      return null
    }

    return (await response.json()) as Record<
      string,
      string | number | boolean | null
    >
  } catch (error) {
    console.error('Error validating authentication:', error)

    return null
  }
})