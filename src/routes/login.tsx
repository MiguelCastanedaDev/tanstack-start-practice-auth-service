import {
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'

import { useMutation } from '@tanstack/react-query'

import React from 'react'

import { getCurrentUser } from '#/server/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const user = await getCurrentUser()

    if (user) {
      throw redirect({
        to: '/about',
      })
    }
  },

  component: LoginComponent,

  server: {
    handlers: {
      POST: async ({ request }) => {
        const credentials = await request.json()

        const response = await fetch(
          'https://hono-practice-auth-service.mikeonlinemx.workers.dev/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          },
        )

        const data = await response.json()

        if (!response.ok) {
          return Response.json(data, {
            status: response.status,
          })
        }

        const cookie = [
          `auth_token=${encodeURIComponent(data.token)}`,
          'HttpOnly',
          'Path=/',
          'SameSite=Lax',
          'Max-Age=3600',

          // Para localhost puedes dejarlo comentado.
          // En producción usa HTTPS + Secure.
          // 'Secure',
        ].join('; ')

        return Response.json(data, {
          status: 200,
          headers: {
            'Set-Cookie': cookie,
          },
        })
      },
    },
  },
})

function LoginComponent() {
  const navigate = useNavigate()

  const [userData, setUserData] = React.useState({
    email: '',
    password: '',
  })

  const {
    mutate,
    isPending,
    error,
  } = useMutation({
    mutationKey: ['login'],

    mutationFn: async (credentials: {
      email: string
      password: string
    }) => {
      const response = await fetch('/login', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Login failed',
        )
      }

      return data
    },

    onSuccess: () => {
      navigate({
        to: '/about',
      })
    },
  })

  return (
    <>
      <h1 className="demo-title mb-6">
        Login Page
      </h1>

      <input
        type="text"
        placeholder="Email"
        className="mb-4 p-2 border rounded w-full"
        value={userData.email}
        onChange={(e) =>
          setUserData({
            ...userData,
            email: e.target.value,
          })
        }
      />

      <input
        type="password"
        placeholder="Password"
        className="mb-4 p-2 border rounded w-full"
        value={userData.password}
        onChange={(e) =>
          setUserData({
            ...userData,
            password: e.target.value,
          })
        }
      />

      <button
        onClick={() => mutate(userData)}
        disabled={isPending}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isPending
          ? 'Loading...'
          : 'Login'}
      </button>

      {error && (
        <p className="text-red-500 mt-4">
          {error.message}
        </p>
      )}
    </>
  )
}