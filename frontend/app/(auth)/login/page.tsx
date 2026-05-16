'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { login } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Metadata } from 'next'

export default function LoginPage() {
  const { setAuth } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const resp = await login(email, password)
      setAuth(resp)
      switch (resp.user.role) {
        case 'ADMIN':   router.replace('/admin'); break
        case 'TEACHER': router.replace('/teacher'); break
        case 'STUDENT': router.replace('/student'); break
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? 'Error al iniciar sesión'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700 tracking-tight">Aula</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Sistema de Gestión de Aprendizaje
          </p>
        </div>

        <div className="card p-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-6">
            Iniciar sesión
          </h2>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-danger-100 border border-danger-600/20 px-4 py-3 text-sm text-danger-600"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="docente@escuela.edu.mx"
            />
            <Input
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6">
          ¿Olvidaste tu contraseña? Contacta al administrador de tu institución.
        </p>
      </div>
    </div>
  )
}
